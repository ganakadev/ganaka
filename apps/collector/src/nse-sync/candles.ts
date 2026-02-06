import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { promises as fs } from "fs";
import { prisma } from "../utils/prisma";
import { acquireGrowwToken } from "../utils/rateLimiter";
import { fetchHistoricalCandles } from "./groww-client";
import type { NseIntrument } from "@ganaka/db";
import { Decimal } from "@ganaka/db/prisma";
import { getGrowwToken } from "../utils/token-manager";

dayjs.extend(utc);
dayjs.extend(timezone);

// Batch size for database inserts to prevent PostgreSQL out-of-memory errors
const BATCH_SIZE = 500;

// Number of instruments to process before disconnecting Prisma to release memory
const INSTRUMENTS_BEFORE_DISCONNECT = 25;

// Delay between batches in milliseconds to allow PostgreSQL to release memory
const BATCH_DELAY_MS = 50;

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
async function getLatestCandleDate(instrumentId: number): Promise<string | null> {
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
 * Split an array into chunks of specified size
 */
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
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
  const recordStartDate = "2025-11-01";
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
 * Format a candle row for CSV export
 */
function formatCandleRowForCSV(candle: {
  instrumentId: number;
  timestamp: Date;
  open: Decimal | null;
  high: Decimal | null;
  low: Decimal | null;
  close: Decimal | null;
  volume: bigint | null;
}): string {
  // Format timestamp as ISO 8601 with UTC timezone for PostgreSQL compatibility
  const timestamp = dayjs.utc(candle.timestamp).toISOString();
  const open = candle.open ? candle.open.toString() : "";
  const high = candle.high ? candle.high.toString() : "";
  const low = candle.low ? candle.low.toString() : "";
  const close = candle.close ? candle.close.toString() : "";
  const volume = candle.volume ? candle.volume.toString() : "";

  return `${candle.instrumentId},${timestamp},${open},${high},${low},${close},${volume}`;
}

/**
 * Write CSV header if file doesn't exist
 */
async function ensureCSVHeader(csvFilePath: string): Promise<void> {
  try {
    await fs.access(csvFilePath);
    // File exists, no need to write header
  } catch {
    // File doesn't exist, write header
    const header = "instrumentId,timestamp,open,high,low,close,volume\n";
    await fs.appendFile(csvFilePath, header);
  }
}

/**
 * Fetch and store candles with rate limiting
 */
export async function fetchAndStoreCandles(
  requests: FetchRequest[],
  /**
   * If csvFilePath is provided, the candles will be written to a CSV file
   */
  csvFilePath?: string
): Promise<{ fetched: number; inserted: number; errors: SyncError[] }> {
  let totalFetched = 0;
  let totalInserted = 0;
  const errors: SyncError[] = [];

  // Initialize CSV file if csvFilePath is provided
  if (csvFilePath) {
    await ensureCSVHeader(csvFilePath);
    console.log(`\nProcessing ${requests.length} fetch requests (CSV mode: ${csvFilePath})...`);
  } else {
    console.log(`\nProcessing ${requests.length} fetch requests...`);
  }

  // Get access token for authentication
  const accessToken = await getGrowwToken();

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
          const candles = await fetchHistoricalCandles({
            growwSymbol: instrument.growwSymbol,
            startTime,
            endTime,
            maxRetries: 5,
            accessToken,
          });

          if (candles.length === 0) {
            continue; // No candles for this period
          }

          totalFetched += candles.length;

          // Transform candles to database format
          const dbCandles = candles.flatMap((candle) => {
            // Parse timestamp from IST string to UTC Date
            const timestamp = dayjs.tz(candle.timestamp, "Asia/Kolkata").utc().toDate();

            if (!timestamp) {
              return [];
            }

            return {
              instrumentId: instrument.id,
              timestamp,
              open: candle.open ? new Decimal(candle.open.toString()) : null,
              high: candle.high ? new Decimal(candle.high.toString()) : null,
              low: candle.low ? new Decimal(candle.low.toString()) : null,
              close: candle.close ? new Decimal(candle.close.toString()) : null,
              volume: candle.volume ? BigInt(candle.volume) : null,
            };
          });

          // Chunk the candles array if it exceeds batch size
          const candleChunks = chunkArray(dbCandles, BATCH_SIZE);
          let chunkInserted = 0;
          const dateRangeStart = chunk.start;
          const dateRangeEnd = chunk.end;

          if (csvFilePath) {
            // CSV mode: write to file
            if (candleChunks.length > 1) {
              console.log(
                `  [${i + 1}/${requests.length}] ${instrument.symbol}: Writing ${dbCandles.length} candles to CSV in ${candleChunks.length} batches...`
              );
            }

            // Process each chunk sequentially
            for (let chunkIdx = 0; chunkIdx < candleChunks.length; chunkIdx++) {
              const candleChunk = candleChunks[chunkIdx];
              try {
                const csvRows = candleChunk.map(formatCandleRowForCSV).join("\n") + "\n";
                await fs.appendFile(csvFilePath, csvRows);

                chunkInserted += candleChunk.length;

                if (candleChunks.length > 1) {
                  console.log(
                    `    Batch [${chunkIdx + 1}/${candleChunks.length}]: wrote ${candleChunk.length} candles`
                  );
                }
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(
                  `    Batch [${chunkIdx + 1}/${candleChunks.length}] failed: ${errorMessage}`
                );
                errors.push({
                  symbol: instrument.symbol,
                  error: `Failed to write batch ${chunkIdx + 1}/${candleChunks.length} for date range ${dateRangeStart} to ${dateRangeEnd}: ${errorMessage}`,
                });
                // Continue with next chunk
              }
            }
          } else {
            // Database mode: write to database
            if (candleChunks.length > 1) {
              console.log(
                `  [${i + 1}/${requests.length}] ${instrument.symbol}: Inserting ${dbCandles.length} candles in ${candleChunks.length} batches...`
              );
            }

            // Process each chunk sequentially
            for (let chunkIdx = 0; chunkIdx < candleChunks.length; chunkIdx++) {
              const candleChunk = candleChunks[chunkIdx];
              try {
                const result = await prisma.nseCandle.createMany({
                  data: candleChunk,
                  skipDuplicates: true,
                });

                chunkInserted += result.count;

                if (candleChunks.length > 1) {
                  console.log(
                    `    Batch [${chunkIdx + 1}/${candleChunks.length}]: inserted ${result.count} candles`
                  );
                }

                // Add delay between batches to allow PostgreSQL to release memory
                if (chunkIdx < candleChunks.length - 1) {
                  await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
                }
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(
                  `    Batch [${chunkIdx + 1}/${candleChunks.length}] failed: ${errorMessage}`
                );
                errors.push({
                  symbol: instrument.symbol,
                  error: `Failed to insert batch ${chunkIdx + 1}/${candleChunks.length} for date range ${dateRangeStart} to ${dateRangeEnd}: ${errorMessage}`,
                });
                // Continue with next chunk
              }
            }
          }

          totalInserted += chunkInserted;

          if (csvFilePath) {
            console.log(
              `  [${i + 1}/${requests.length}] ${instrument.symbol}: Fetched ${candles.length} candles, wrote ${chunkInserted} to CSV (${chunk.start} to ${chunk.end})`
            );
          } else {
            console.log(
              `  [${i + 1}/${requests.length}] ${instrument.symbol}: Fetched ${candles.length} candles, inserted ${chunkInserted} (${chunk.start} to ${chunk.end})`
            );
          }
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

    // Periodically disconnect Prisma to force PostgreSQL to release connection memory
    // This helps prevent out-of-memory errors during long-running syncs
    // Skip this in CSV mode as we're not using the database
    if (!csvFilePath && (i + 1) % INSTRUMENTS_BEFORE_DISCONNECT === 0) {
      console.log(`  Disconnecting Prisma after ${i + 1} instruments to release memory...`);
      try {
        await prisma.$disconnect();
        // Prisma will auto-reconnect on the next query
      } catch (error) {
        // Ignore disconnect errors - connection may already be closed
        console.warn(`  Warning: Error during Prisma disconnect: ${error}`);
      }
    }
  }

  return {
    fetched: totalFetched,
    inserted: totalInserted,
    errors,
  };
}
