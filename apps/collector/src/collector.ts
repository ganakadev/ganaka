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

interface SymbolWithSource {
  symbol: string;
  shortlistType: ShortlistType;
}

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

export async function collectMarketData(): Promise<void> {
  const timestamp = getCurrentISTTime();
  console.log(
    `\n[${timestamp.toISOString()}] Starting market data collection...`
  );

  try {
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
      return;
    }

    // 2. Limit each to top items
    const topGainersLimited =
      topGainers.data?.data?.slice(0, TOP_STOCKS_LIMIT) ?? [];
    const volumeShockersLimited =
      volumeShockers.data?.data?.slice(0, TOP_STOCKS_LIMIT) ?? [];
    console.log(
      `Top gainers: ${topGainersLimited.length}, Volume shockers: ${volumeShockersLimited.length}`
    );

    // 3. Collect unique symbols (de-duplicate across both lists)
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
    const uniqueSymbols = Array.from(symbolMap.keys());
    console.log(`Unique symbols to fetch: ${uniqueSymbols.length}`);

    // 4. Fetch NIFTYBANK quote
    console.log("Fetching NIFTYBANK quote...");
    const niftybankQuote = await v1_developer_groww.getGrowwQuote(NIFTY_SYMBOL);

    // 5. Fetch quotes with rate limiting
    console.log("Fetching quotes with rate limiting...");
    const quotesMap = await fetchQuotesWithRateLimit(uniqueSymbols);
    console.log(`Successfully fetched ${quotesMap.size} quotes`);

    // 6. Store data via Prisma
    console.log("Storing data in database...");

    // Prepare shortlist data array
    const shortlistData: (Omit<
      ShortlistSnapshot,
      "id" | "createdAt" | "entries"
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

    // Prepare quote snapshot data array
    const quoteData: (Omit<QuoteSnapshot, "id" | "createdAt" | "quoteData"> & {
      quoteData: InputJsonValue;
    })[] = [];
    for (const [symbol, quote] of quotesMap.entries()) {
      const shortlistTypes = Array.from(symbolMap.get(symbol) || []);

      for (const shortlistType of shortlistTypes) {
        const dataToPush = {
          timestamp,
          nseSymbol: symbol,
          shortlistType,
          quoteData: quote as unknown as InputJsonValue,
        };
        quoteData.push(dataToPush);
      }
    }

    // Prepare NIFTY quote data array
    const niftyData: (Omit<NiftyQuote, "id" | "createdAt" | "quoteData"> & {
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
      if (shortlistData.length > 0) {
        await tx.shortlistSnapshot.createMany({ data: shortlistData });
      }
      if (quoteData.length > 0) {
        await tx.quoteSnapshot.createMany({ data: quoteData });
      }
      if (niftyData.length > 0) {
        await tx.niftyQuote.createMany({ data: niftyData });
      }
    });

    console.log("Data collection completed successfully");
  } catch (error) {
    console.error("Error during market data collection:", error);
    throw error;
  }
}
