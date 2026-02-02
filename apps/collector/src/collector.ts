import {
  v1_developer_quote_schemas,
  v1_developer_lists_schemas,
  v1_developer_collector_schemas,
} from "@ganaka/schemas";
import axios from "axios";
import dayjs from "dayjs";
import { chunk } from "lodash";
import z from "zod";
import { RedisManager } from "./utils/redis";
import { ShortlistType, ShortlistScope } from "@ganaka/db";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

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

    return axios.get<z.infer<typeof v1_developer_lists_schemas.getLists.response>>(
      `${API_DOMAIN}/v1/developer/lists`,
      {
        params,
        headers: {
          Authorization: `Bearer ${developerKey}`,
        },
      }
    );
  };

export const getGrowwQuote = (developerKey: string) => async (symbol: string) => {
  const params: z.infer<typeof v1_developer_quote_schemas.getGrowwQuote.query> = {
    symbol: symbol,
  };

  return axios.get<z.infer<typeof v1_developer_quote_schemas.getGrowwQuote.response>>(
    `${API_DOMAIN}/v1/developer/quote`,
    {
      params,
      headers: {
        Authorization: `Bearer ${developerKey}`,
      },
    }
  );
};

// ==================== Collector Data Insertion APIs ====================

export const createShortlistSnapshot =
  (developerKey: string) =>
  async (
    timestamp: Date,
    shortlistType: ShortlistType,
    entries: z.infer<typeof v1_developer_collector_schemas.shortlistEntrySchema>[],
    scope?: ShortlistScope
  ) => {
    const body: z.infer<typeof v1_developer_collector_schemas.createShortlistSnapshot.body> = {
      data: {
        timestamp: dayjs(timestamp).format("YYYY-MM-DDTHH:mm:ss"),
        timezone: "Etc/UTC",
        shortlistType,
        entries,
        scope,
      },
    };

    return axios.post<
      z.infer<typeof v1_developer_collector_schemas.createShortlistSnapshot.response>
    >(`${API_DOMAIN}/v1/developer/collector/lists`, body, {
      headers: {
        Authorization: `Bearer ${developerKey}`,
        "Content-Type": "application/json",
      },
    });
  };

export const createQuoteSnapshots =
  (developerKey: string) =>
  async (
    timestamp: Date,
    quotes: z.infer<typeof v1_developer_collector_schemas.quoteSnapshotDataSchema>[]
  ) => {
    const body: z.infer<typeof v1_developer_collector_schemas.createQuoteSnapshots.body> = {
      data: {
        timestamp: dayjs(timestamp).format("YYYY-MM-DDTHH:mm:ss"),
        timezone: "Etc/UTC",
        quotes,
      },
    };

    return axios.post<z.infer<typeof v1_developer_collector_schemas.createQuoteSnapshots.response>>(
      `${API_DOMAIN}/v1/developer/collector/quotes`,
      body,
      {
        headers: {
          Authorization: `Bearer ${developerKey}`,
          "Content-Type": "application/json",
        },
      }
    );
  };

export const createNiftyQuote =
  (developerKey: string) =>
  async (
    timestamp: Date,
    quoteData: z.infer<
      typeof v1_developer_collector_schemas.createNiftyQuote.body
    >["data"]["quoteData"],
    dayChangePerc: number
  ) => {
    const body: z.infer<typeof v1_developer_collector_schemas.createNiftyQuote.body> = {
      data: {
        timestamp: dayjs(timestamp).format("YYYY-MM-DDTHH:mm:ss"),
        timezone: "Etc/UTC",
        quoteData,
        dayChangePerc,
      },
    };

    return axios.post<z.infer<typeof v1_developer_collector_schemas.createNiftyQuote.response>>(
      `${API_DOMAIN}/v1/developer/collector/nifty`,
      body,
      {
        headers: {
          Authorization: `Bearer ${developerKey}`,
          "Content-Type": "application/json",
        },
      }
    );
  };

async function fetchQuotesWithRateLimit(symbols: string[]) {
  const results = new Map<
    string,
    z.infer<typeof v1_developer_quote_schemas.getGrowwQuote.response>["data"]
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
  const timestamp = dayjs().utc().toDate();
  console.log("Updating daily bucket...");

  // 1. Fetch both shortlists in parallel
  console.log("Fetching shortlists...");
  const [topGainers, volumeShockers] = await Promise.all([
    getLists(process.env.DEVELOPER_KEY!)("top-gainers").catch((error: unknown) => {
      console.error("Failed to fetch top-gainers:", error);
      return null;
    }),
    getLists(process.env.DEVELOPER_KEY!)("volume-shockers").catch((error: unknown) => {
      console.error("Failed to fetch volume-shockers:", error);
      return null;
    }),
  ]);

  let currentRunSymbols: string[] = [];
  let symbolMap: Set<string> = new Set();

  if (
    topGainers &&
    volumeShockers &&
    (topGainers.data?.data ?? []).length > 0 &&
    (volumeShockers.data?.data ?? []).length > 0
  ) {
    // 2. Limit each to top items
    const topGainersLimited = topGainers.data?.data?.slice(0, TOP_STOCKS_LIMIT) ?? [];
    const volumeShockersLimited = volumeShockers.data?.data?.slice(0, TOP_STOCKS_LIMIT) ?? [];
    // shuffle for testing in local development
    // const topGainersLimited =
    //   shuffle(topGainers.data?.data ?? [])?.slice(0, TOP_STOCKS_LIMIT) ?? [];
    // const volumeShockersLimited =
    //   shuffle(volumeShockers.data?.data ?? [])?.slice(0, TOP_STOCKS_LIMIT) ?? [];
    console.log(
      `Top gainers: ${topGainersLimited.length}, Volume shockers: ${volumeShockersLimited.length}`
    );

    // 3. Store shortlists via API
    console.log("Storing shortlists via API...");
    const topGainersShortlistType: ShortlistType = "TOP_GAINERS";
    const volumeShockersShortlistType: ShortlistType = "VOLUME_SHOCKERS";
    const topGainersFull = topGainers.data?.data ?? [];
    const volumeShockersFull = volumeShockers.data?.data ?? [];

    // Store FULL shortlist for top-gainers
    if (topGainersFull.length > 0) {
      await createShortlistSnapshot(process.env.DEVELOPER_KEY!)(
        timestamp,
        topGainersShortlistType,
        topGainersFull,
        "FULL"
      );
      console.log(`Stored TOP_GAINERS shortlist (FULL, ${topGainersFull.length} entries)`);
    }

    // Store TOP_5 shortlist for top-gainers
    if (topGainersLimited.length > 0) {
      await createShortlistSnapshot(process.env.DEVELOPER_KEY!)(
        timestamp,
        topGainersShortlistType,
        topGainersLimited,
        "TOP_5"
      );
      console.log(`Stored TOP_GAINERS shortlist (TOP_5, ${topGainersLimited.length} entries)`);
    }

    // Store FULL shortlist for volume-shockers
    if (volumeShockersFull.length > 0) {
      await createShortlistSnapshot(process.env.DEVELOPER_KEY!)(
        timestamp,
        volumeShockersShortlistType,
        volumeShockersFull,
        "FULL"
      );
      console.log(`Stored VOLUME_SHOCKERS shortlist (FULL, ${volumeShockersFull.length} entries)`);
    }

    // Store TOP_5 shortlist for volume-shockers
    if (volumeShockersLimited.length > 0) {
      await createShortlistSnapshot(process.env.DEVELOPER_KEY!)(
        timestamp,
        volumeShockersShortlistType,
        volumeShockersLimited,
        "TOP_5"
      );
      console.log(
        `Stored VOLUME_SHOCKERS shortlist (TOP_5, ${volumeShockersLimited.length} entries)`
      );
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
  const newSymbols = currentRunSymbols.filter((symbol) => !existingBucket.has(symbol));
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
async function collectMarketDataForBucket(currentRunSymbolMap: Set<string>): Promise<void> {
  const timestamp = dayjs().utc().toDate();

  // 1. Format symbols from current run symbol map
  const bucketSymbols = Array.from(currentRunSymbolMap.keys());

  // 2. Fetch NIFTY quote
  console.log("Fetching NIFTY quote...");
  const niftybankQuote = await getGrowwQuote(process.env.DEVELOPER_KEY!)(NIFTY_SYMBOL).catch(
    (error: unknown) => {
      console.error("Failed to fetch NIFTY quote:", error);
      return null;
    }
  );

  // 3. Fetch quotes with rate limiting
  console.log("Fetching quotes with rate limiting...");
  const quotesMap = await fetchQuotesWithRateLimit(bucketSymbols);
  console.log(`Successfully fetched ${quotesMap.size} quotes`);

  // 4. Store data via APIs
  console.log("Storing quotes via APIs...");

  // Prepare quote snapshot data array for API
  const quotesData: z.infer<typeof v1_developer_collector_schemas.quoteSnapshotDataSchema>[] = [];

  for (const [symbol, quote] of quotesMap.entries()) {
    if (quote) {
      quotesData.push({
        nseSymbol: symbol,
        quoteData: quote,
      });
    }
  }

  // Store quotes via API (if any)
  if (quotesData.length > 0) {
    await createQuoteSnapshots(process.env.DEVELOPER_KEY!)(timestamp, quotesData);
    console.log(`Stored ${quotesData.length} quote snapshots`);
  }

  // Store NIFTY quote via API (if available)
  if (niftybankQuote && niftybankQuote.data?.data?.status === "SUCCESS") {
    const niftyData = niftybankQuote.data.data!;
    await createNiftyQuote(process.env.DEVELOPER_KEY!)(
      timestamp,
      niftyData,
      niftyData.payload.day_change_perc ?? 0
    );
    console.log("Stored NIFTY quote");
  }

  console.log("Quote collection completed successfully");
}

export async function collectMarketData(): Promise<void> {
  const timestamp = dayjs().utc().toDate();
  console.log(`\n[${timestamp.toISOString()}] Starting market data collection...`);

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
