import {
  InputJsonValue,
  NiftyQuote,
  QuoteSnapshot,
  ShortlistSnapshot,
} from "@ganaka/db";
import { Decimal } from "@ganaka/db/src/generated/prisma/runtime/library";
import { chunk } from "lodash";
import { prisma } from "./utils/prisma";
import { getCurrentISTTime } from "./utils/time";
import { RedisManager } from "./utils/redis";
import { v1_developer_lists, v1_developer_groww } from "@ganaka/apis";
import { v1_developer_groww_schemas } from "@ganaka/schemas";
import z from "zod";

// Enum matching Prisma schema (will be available from @prisma/client after generation)
enum ShortlistType {
  TOP_GAINERS = "TOP_GAINERS",
  VOLUME_SHOCKERS = "VOLUME_SHOCKERS",
}

const NIFTY_SYMBOL = "NIFTY";
const TOP_STOCKS_LIMIT = 5;
const RATE_LIMIT_BATCH_SIZE = 5;
const RATE_LIMIT_DELAY_MS = 1000; // 1 second

async function fetchQuotesWithRateLimit(symbols: string[]) {
  const results = new Map<
    string,
    z.infer<typeof v1_developer_groww_schemas.getGrowwQuote.response>["data"]
  >();
  const batches = chunk(symbols, RATE_LIMIT_BATCH_SIZE);

  for await (const batch of batches) {
    const promises = batch.map((symbol) =>
      v1_developer_groww
        .getGrowwQuote(symbol)
        .then((quote) => ({ symbol, quote }))
        .catch((error: unknown) => {
          console.error(`Failed to fetch quote for ${symbol}:`, error);
          return { symbol, quote: null };
        })
    );

    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ symbol, quote }) => {
      if (quote) {
        results.set(symbol, quote.data.data);
      }
    });

    // Wait 1 second before next batch
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY_MS));
  }

  return results;
}

/**
 * Update daily bucket with new companies from shortlists
 * Fetches shortlists, stores them in DB, and adds new companies to Redis bucket
 * Returns the symbolMap for the current run's top 5 companies
 */
async function updateDailyBucket(): Promise<Map<string, Set<ShortlistType>>> {
  const timestamp = getCurrentISTTime();
  console.log("Updating daily bucket...");

  // 1. Fetch both shortlists in parallel
  console.log("Fetching shortlists...");
  const [topGainers, volumeShockers] = await Promise.all([
    v1_developer_lists.getLists("top-gainers").catch((error: unknown) => {
      console.error("Failed to fetch top-gainers:", error);
      return null;
    }),
    v1_developer_lists.getLists("volume-shockers").catch((error: unknown) => {
      console.error("Failed to fetch volume-shockers:", error);
      return null;
    }),
  ]);
  if (!topGainers || !volumeShockers) {
    console.error("Failed to fetch shortlists");
    throw new Error("Failed to fetch shortlists");
  }

  // 2. Limit each to top items
  const topGainersLimited =
    topGainers.data?.data?.slice(0, TOP_STOCKS_LIMIT) ?? [];
  const volumeShockersLimited =
    volumeShockers.data?.data?.slice(0, TOP_STOCKS_LIMIT) ?? [];
  console.log(
    `Top gainers: ${topGainersLimited.length}, Volume shockers: ${volumeShockersLimited.length}`
  );

  // 3. Store shortlists in database
  console.log("Storing shortlists in database...");
  const shortlistData: (Omit<
    ShortlistSnapshot,
    "id" | "createdAt" | "entries" | "updatedAt"
  > & { entries: InputJsonValue })[] = [];
  if (topGainersLimited.length > 0) {
    shortlistData.push({
      timestamp,
      shortlistType: ShortlistType.TOP_GAINERS,
      entries: topGainersLimited as unknown as InputJsonValue,
    });
  }
  if (volumeShockersLimited.length > 0) {
    shortlistData.push({
      timestamp,
      shortlistType: ShortlistType.VOLUME_SHOCKERS,
      entries: volumeShockersLimited as unknown as InputJsonValue,
    });
  }

  if (shortlistData.length > 0) {
    await prisma.shortlistSnapshot.createMany({ data: shortlistData });
  }

  // 4. Collect unique symbols from top 5 (de-duplicate across both lists)
  const symbolMap = new Map<string, Set<ShortlistType>>();
  topGainersLimited.forEach((item) => {
    if (!symbolMap.has(item.nseSymbol)) {
      symbolMap.set(item.nseSymbol, new Set());
    }
    symbolMap.get(item.nseSymbol)!.add(ShortlistType.TOP_GAINERS);
  });
  volumeShockersLimited.forEach((item) => {
    if (!symbolMap.has(item.nseSymbol)) {
      symbolMap.set(item.nseSymbol, new Set());
    }
    symbolMap.get(item.nseSymbol)!.add(ShortlistType.VOLUME_SHOCKERS);
  });
  const currentRunSymbols = Array.from(symbolMap.keys());
  console.log(`Current run unique symbols: ${currentRunSymbols.length}`);

  // 5. Get current day's bucket from Redis
  const redisManager = RedisManager.getInstance();
  const existingBucket = await redisManager.getDailyBucket(timestamp);
  console.log(`Existing bucket size: ${existingBucket.size}`);

  // 6. Find new symbols not in bucket
  const newSymbols = currentRunSymbols.filter(
    (symbol) => !existingBucket.has(symbol)
  );
  console.log(`New symbols to add: ${newSymbols.length}`);

  // 7. Add new symbols to bucket
  if (newSymbols.length > 0) {
    await redisManager.addToDailyBucket(timestamp, newSymbols);
    console.log(`Added ${newSymbols.length} new symbols to bucket`);
  }

  return symbolMap;
}

/**
 * Collect market data for all companies in the daily bucket
 * Fetches quotes for all bucket companies and stores them in database
 */
async function collectMarketDataForBucket(
  currentRunSymbolMap: Map<string, Set<ShortlistType>>
): Promise<void> {
  const timestamp = getCurrentISTTime();
  console.log("Collecting market data for bucket companies...");

  // 1. Get all symbols from daily bucket
  const redisManager = RedisManager.getInstance();
  const bucketSymbols = await redisManager.getAllFromDailyBucket(timestamp);
  console.log(`Total symbols in bucket: ${bucketSymbols.length}`);

  if (bucketSymbols.length === 0) {
    console.log("No symbols in bucket, skipping quote collection");
    return;
  }

  // 2. Fetch NIFTY quote
  console.log("Fetching NIFTY quote...");
  const niftybankQuote = await v1_developer_groww.getGrowwQuote(NIFTY_SYMBOL);

  // 3. Fetch quotes with rate limiting
  console.log("Fetching quotes with rate limiting...");
  const quotesMap = await fetchQuotesWithRateLimit(bucketSymbols);
  console.log(`Successfully fetched ${quotesMap.size} quotes`);

  // 4. Store data via Prisma
  console.log("Storing quotes in database...");

  // Prepare quote snapshot data array
  const quoteData: (Omit<
    QuoteSnapshot,
    "id" | "createdAt" | "updatedAt" | "quoteData"
  > & {
    quoteData: InputJsonValue;
  })[] = [];

  for (const [symbol, quote] of quotesMap.entries()) {
    quoteData.push({
      timestamp,
      nseSymbol: symbol,
      quoteData: quote as unknown as InputJsonValue,
    });
  }

  // Prepare NIFTY quote data array
  const niftyData: (Omit<
    NiftyQuote,
    "id" | "createdAt" | "updatedAt" | "quoteData"
  > & {
    quoteData: InputJsonValue;
  })[] = [];
  if (niftybankQuote && niftybankQuote.data?.data?.status === "SUCCESS") {
    niftyData.push({
      timestamp,
      quoteData: niftybankQuote.data.data as unknown as InputJsonValue,
      dayChangePerc: new Decimal(
        niftybankQuote.data.data.payload.day_change_perc
      ),
    });
  }

  // Use transaction for atomicity
  await prisma.$transaction(async (tx) => {
    if (quoteData.length > 0) {
      await tx.quoteSnapshot.createMany({ data: quoteData });
    }
    if (niftyData.length > 0) {
      await tx.niftyQuote.createMany({ data: niftyData });
    }
  });

  console.log("Quote collection completed successfully");
}

export async function collectMarketData(): Promise<void> {
  const timestamp = getCurrentISTTime();
  console.log(
    `\n[${timestamp.toISOString()}] Starting market data collection...`
  );

  try {
    // 1. Update daily bucket with new companies from shortlists
    // This also stores shortlists in database
    const currentRunSymbolMap = await updateDailyBucket();

    // 2. Collect market data for all companies in the bucket
    await collectMarketDataForBucket(currentRunSymbolMap);

    console.log("Data collection completed successfully");
  } catch (error) {
    console.error("Error during market data collection:", error);
    throw error;
  }
}
