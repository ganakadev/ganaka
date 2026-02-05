import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { prisma } from "../utils/prisma";
import { acquireGrowwToken } from "../utils/rateLimiter";
import { fetchHistoricalCandles } from "./groww-client";
import type { NseIntrument } from "@ganaka/db";
import { Decimal } from "@ganaka/db/prisma";

dayjs.extend(utc);
dayjs.extend(timezone);

export interface FetchRequest {
  instrument: NseIntrument;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface SyncError {
  symbol: string;
  error: string;
}

/**
 * Get the latest candle date for an instrument
 * Returns date in YYYY-MM-DD format (IST) or null if no candles exist
 */
async function getLatestCandleDate(instrumentId: string): Promise<string | null> {
  const latestCandle = await prisma.nseCandle.findFirst({
    where: {
      instrumentId,
    },
    orderBy: {
      timestamp: "desc",
    },
    select: {
      timestamp: true,
    },
  });

  if (!latestCandle) {
    return null; // No candles exist
  }

  // Convert UTC timestamp to IST date string
  return dayjs.utc(latestCandle.timestamp).tz("Asia/Kolkata").format("YYYY-MM-DD");
}

/**
 * Split a date range into 30-day chunks
 */
function splitInto30DayChunks(
  startDate: string,
  endDate: string
): Array<{ start: string; end: string }> {
  const chunks: Array<{ start: string; end: string }> = [];
  let currentStart = dayjs.tz(startDate, "Asia/Kolkata");
  const end = dayjs.tz(endDate, "Asia/Kolkata");

  while (currentStart.isBefore(end) || currentStart.isSame(end)) {
    const chunkEnd = currentStart.add(29, "day"); // 30 days inclusive
    const actualEnd = chunkEnd.isAfter(end) ? end : chunkEnd;

    chunks.push({
      start: currentStart.format("YYYY-MM-DD"),
      end: actualEnd.format("YYYY-MM-DD"),
    });

    currentStart = actualEnd.add(1, "day");
  }

  return chunks;
}

/**
 * Determine fetch request for a single instrument
 * Returns FetchRequest or null if no fetch is needed
 */
async function determineFetchRequestForInstrument(
  instrument: NseIntrument,
  recordStartDate: string,
  today: string
): Promise<FetchRequest | null> {
  const latestDate = await getLatestCandleDate(instrument.id);

  if (latestDate !== null) {
    // Has existing candles - fetch from latest date + 1 to today
    const latestDateObj = dayjs.tz(latestDate, "Asia/Kolkata");
    const todayDateObj = dayjs.tz(today, "Asia/Kolkata");

    if (latestDateObj.isBefore(todayDateObj)) {
      const fetchStartDate = latestDateObj.add(1, "day").format("YYYY-MM-DD");
      return {
        instrument,
        startDate: fetchStartDate,
        endDate: today,
      };
    }
    // No fetch needed - already up to date
    return null;
  } else {
    // No candles exist - full fetch from recordStartDate
    // (Groww will return from actual IPO date for new stocks)
    return {
      instrument,
      startDate: recordStartDate,
      endDate: today,
    };
  }
}

/**
 * Determine what candles need to be fetched for each instrument
 */
export async function determineFetchRequests(instruments: NseIntrument[]): Promise<FetchRequest[]> {
  const recordStartDate = "2026-01-01";
  const today = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD");

  console.log(`\nDetermining fetch requests for ${instruments.length} instruments...`);

  // Process all instruments in parallel
  const results = await Promise.allSettled(
    instruments.map(async (instrument) => {
      try {
        return await determineFetchRequestForInstrument(instrument, recordStartDate, today);
      } catch (error) {
        console.error(`Error determining fetch request for ${instrument.symbol}:`, error);
        // Return null to indicate this instrument should be skipped
        return null;
      }
    })
  );

  // Process results and build requests array
  const requests: FetchRequest[] = [];
  for (const result of results) {
    if (result.status === "fulfilled" && result.value !== null) {
      requests.push(result.value);
    } else if (result.status === "rejected") {
      // Log rejection errors (though they should be caught in the try-catch above)
      console.error("Unexpected rejection in determineFetchRequests:", result.reason);
    }
  }

  return requests;
}

/**
 * Fetch and store candles with rate limiting
 */
export async function fetchAndStoreCandles(
  requests: FetchRequest[]
): Promise<{ fetched: number; inserted: number; errors: SyncError[] }> {
  let totalFetched = 0;
  let totalInserted = 0;
  const errors: SyncError[] = [];

  console.log(`\nProcessing ${requests.length} fetch requests...`);

  for (let i = 0; i < requests.length; i++) {
    const request = requests[i];
    const { instrument, startDate, endDate } = request;

    try {
      // Split into 30-day chunks
      const chunks = splitInto30DayChunks(startDate, endDate);

      for (const chunk of chunks) {
        try {
          // Format times for Groww API (IST format: YYYY-MM-DDTHH:mm:ss)
          const startTime = dayjs
            .tz(chunk.start, "Asia/Kolkata")
            .startOf("day")
            .format("YYYY-MM-DDTHH:mm:ss");
          const endTime = dayjs
            .tz(chunk.end, "Asia/Kolkata")
            .endOf("day")
            .format("YYYY-MM-DDTHH:mm:ss");

          // Acquire rate limit token before API call
          await acquireGrowwToken();

          // Fetch candles from Groww API
          const candles = await fetchHistoricalCandles(instrument.growwSymbol, startTime, endTime);

          if (candles.length === 0) {
            continue; // No candles for this period
          }

          totalFetched += candles.length;

          // Transform candles to database format
          const dbCandles = candles.flatMap((candle) => {
            // Parse timestamp from IST string to UTC Date
            const timestamp = dayjs.tz(candle.timestamp, "Asia/Kolkata").utc().toDate();

            if (
              !timestamp ||
              !candle.open ||
              !candle.high ||
              !candle.low ||
              !candle.close ||
              !candle.volume
            ) {
              return [];
            }

            return {
              instrumentId: instrument.id,
              timestamp,
              open: new Decimal(candle.open.toString()),
              high: new Decimal(candle.high.toString()),
              low: new Decimal(candle.low.toString()),
              close: new Decimal(candle.close.toString()),
              volume: BigInt(candle.volume),
            };
          });

          // Bulk insert with skipDuplicates
          const result = await prisma.nseCandle.createMany({
            data: dbCandles,
            skipDuplicates: true,
          });

          totalInserted += result.count;

          console.log(
            `  [${i + 1}/${requests.length}] ${instrument.symbol}: Fetched ${candles.length} candles, inserted ${result.count} (${chunk.start} to ${chunk.end})`
          );
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(
            `  [${i + 1}/${requests.length}] Error fetching candles for ${instrument.symbol} (${chunk.start} to ${chunk.end}):`,
            errorMessage
          );
          errors.push({
            symbol: instrument.symbol,
            error: `Failed to fetch ${chunk.start} to ${chunk.end}: ${errorMessage}`,
          });
          // Continue with next chunk
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error processing ${instrument.symbol}:`, errorMessage);
      errors.push({
        symbol: instrument.symbol,
        error: errorMessage,
      });
      // Continue with next instrument
    }
  }

  return {
    fetched: totalFetched,
    inserted: totalInserted,
    errors,
  };
}
