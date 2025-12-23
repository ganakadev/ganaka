import {
  InputJsonValue,
  NiftyQuote,
  QuoteSnapshot,
  ShortlistSnapshot,
} from "@ganaka/db";
import { Decimal } from "@ganaka/db/prisma";
import {
  v1_developer_groww_schemas,
  v1_developer_lists_schemas,
} from "@ganaka/schemas";
import { chunk } from "lodash";
import z from "zod";
import { prisma } from "./utils/prisma";
import { RedisManager } from "./utils/redis";
import { getCurrentISTTime } from "./utils/time";
import axios from "axios";

// Enum matching Prisma schema (will be available from @prisma/client after generation)
enum ShortlistType {
  TOP_GAINERS = "TOP_GAINERS",
  VOLUME_SHOCKERS = "VOLUME_SHOCKERS",
}

const API_DOMAIN = process.env.API_DOMAIN ?? "https://api.ganaka.live";

const NIFTY_SYMBOL = "NIFTY";
const TOP_STOCKS_LIMIT = 5;
const MAX_SYMBOLS_IN_BUCKET = 298; // 300/minute is the groww API rate limit
const RATE_LIMIT_BATCH_SIZE = 8; // 10/second is the groww API rate limit
const RATE_LIMIT_DELAY_MS = 1000; // 1 second

export const getLists =
  (developerKey: string) => async (type: "top-gainers" | "volume-shockers") => {
    const params: z.infer<typeof v1_developer_lists_schemas.getLists.query> = {
      type,
    };

    return axios.get<
      z.infer<typeof v1_developer_lists_schemas.getLists.response>
    >(`${API_DOMAIN}/v1/developer/lists`, {
      params,
      headers: {
        Authorization: `Bearer ${developerKey}`,
      },
    });
  };

export const getGrowwQuote =
  (developerKey: string) => async (symbol: string) => {
    const params: z.infer<
      typeof v1_developer_groww_schemas.getGrowwQuote.query
    > = {
      symbol: symbol,
    };

    return axios.get<
      z.infer<typeof v1_developer_groww_schemas.getGrowwQuote.response>
    >(`${API_DOMAIN}/v1/developer/groww/quote`, {
      params,
      headers: {
        Authorization: `Bearer ${developerKey}`,
      },
    });
  };

async function fetchQuotesWithRateLimit(symbols: string[]) {
  const results = new Map<
    string,
    z.infer<typeof v1_developer_groww_schemas.getGrowwQuote.response>["data"]
  >();
  const batches = chunk(symbols, RATE_LIMIT_BATCH_SIZE);

  for await (const batch of batches) {
    const promises = batch.map((symbol) =>
      getGrowwQuote(process.env.DEVELOPER_KEY!)(symbol)
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
async function updateDailyBucket(): Promise<Set<string>> {
  const timestamp = getCurrentISTTime();
  console.log("Updating daily bucket...");

  // 1. Fetch both shortlists in parallel
  console.log("Fetching shortlists...");
  const [topGainers, volumeShockers] = await Promise.all([
    getLists(process.env.DEVELOPER_KEY!)("top-gainers").catch(
      (error: unknown) => {
        console.error("Failed to fetch top-gainers:", error);
        return null;
      }
    ),
    getLists(process.env.DEVELOPER_KEY!)("volume-shockers").catch(
      (error: unknown) => {
        console.error("Failed to fetch volume-shockers:", error);
        return null;
      }
    ),
  ]);

  let currentRunSymbols: string[] = [];
  let symbolMap: Set<string> = new Set();

  if (
    topGainers &&
    volumeShockers &&
    topGainers.data?.data?.length > 0 &&
    volumeShockers.data?.data?.length > 0
  ) {
    // 2. Limit each to top items
    const topGainersLimited =
      topGainers.data?.data?.slice(0, TOP_STOCKS_LIMIT) ?? [];
    const volumeShockersLimited =
      volumeShockers.data?.data?.slice(0, TOP_STOCKS_LIMIT) ?? [];
    // shuffle for testing in local development
    // const topGainersLimited =
    //   shuffle(topGainers.data?.data ?? [])?.slice(0, TOP_STOCKS_LIMIT) ?? [];
    // const volumeShockersLimited =
    //   shuffle(volumeShockers.data?.data ?? [])?.slice(0, TOP_STOCKS_LIMIT) ?? [];
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
    symbolMap = new Set<string>();
    topGainersLimited.forEach((item) => {
      symbolMap.add(item.nseSymbol);
    });
    volumeShockersLimited.forEach((item) => {
      symbolMap.add(item.nseSymbol);
    });

    currentRunSymbols = Array.from(symbolMap.keys());
    console.log(`Current run unique symbols: ${currentRunSymbols.length}`);
  }

  // 5. Get current day's bucket from Redis
  const redisManager = RedisManager.getInstance();
  const existingBucket = await redisManager.getDailyBucket(timestamp);

  if (!existingBucket) {
    console.error("Failed to get existing bucket from Redis");
    return symbolMap;
  }

  console.log(`Existing bucket size: ${existingBucket.size}`);

  // if no symbols to add to bucket, return existing bucket
  if (currentRunSymbols.length === 0) {
    console.log("No symbols to add to bucket");
    return existingBucket;
  }

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

  // 8. Add bucket symbols to symbol map
  for (const symbol of existingBucket) {
    if (symbolMap.size > MAX_SYMBOLS_IN_BUCKET) {
      break;
    }
    symbolMap.add(symbol);
  }

  return symbolMap;
}

/**
 * Collect market data for all companies in the daily bucket
 * Fetches quotes for all bucket companies and stores them in database
 */
async function collectMarketDataForBucket(
  currentRunSymbolMap: Set<string>
): Promise<void> {
  const timestamp = getCurrentISTTime();

  // 1. Format symbols from current run symbol map
  const bucketSymbols = Array.from(currentRunSymbolMap.keys());

  // 2. Fetch NIFTY quote
  console.log("Fetching NIFTY quote...");
  const niftybankQuote = await getGrowwQuote(process.env.DEVELOPER_KEY!)(
    NIFTY_SYMBOL
  ).catch((error: unknown) => {
    console.error("Failed to fetch NIFTY quote:", error);
    return null;
  });

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
