import { ShortlistType } from "@ganaka/db";
import { growwQuoteSchema, shortlistEntrySchema, v1_dashboard_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { prisma } from "../../../../utils/prisma";
import { sendResponse } from "../../../../utils/sendResponse";
import { parseDateTimeInTimezone } from "../../../../utils/timezone";
import { validateRequest } from "../../../../utils/validator";
import { formatDateTime } from "../../../../utils/date-formatter";
import { RedisManager } from "../../../../utils/redis";
import { TokenManager } from "../../../../utils/token-manager";
import { makeGrowwAPIRequest } from "../../../../utils/groww-api-request";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Calculate trade metrics for a shortlist entry based on historical candle data after shortlist capture.
 * Determines if the instrument would have achieved the specified take profit and stop loss targets
 * when run as a trading strategy from the shortlist datetime onwards.
 */
async function calculateTradeMetrics({
  nseSymbol,
  entryPrice,
  shortlistTimestamp,
  takeProfitPercentage,
  stopLossPercentage,
  growwAPIRequest,
}: {
  nseSymbol: string;
  entryPrice: number;
  shortlistTimestamp: Date;
  takeProfitPercentage: number;
  stopLossPercentage: number;
  growwAPIRequest: <T>({
    method,
    url,
    params,
  }: {
    url: string;
    method: string;
    params?: Record<string, any>;
  }) => Promise<T>;
}): Promise<{
  targetPrice?: number;
  stopLossPrice?: number;
  targetAchieved?: boolean;
  stopLossHit?: boolean;
  timeToTargetMinutes?: number;
  timeToStopLossMinutes?: number;
  targetTimestamp?: string;
  stopLossTimestamp?: string;
}> {
  try {
    // Get the date in IST timezone and set market hours (9:15 AM - 3:30 PM IST)
    const dateStr = dayjs.utc(shortlistTimestamp).tz("Asia/Kolkata").format("YYYY-MM-DD");
    const marketStart = dayjs.tz(`${dateStr} 09:15:00`, "Asia/Kolkata");
    const marketEnd = dayjs.tz(`${dateStr} 15:30:00`, "Asia/Kolkata");

    // Convert to format expected by Groww API: YYYY-MM-DDTHH:mm:ss (no milliseconds, no Z)
    // The API expects times in IST format without timezone suffix
    const start_time = marketStart.format("YYYY-MM-DDTHH:mm:ss");
    const end_time = marketEnd.format("YYYY-MM-DDTHH:mm:ss");

    // Fetch historical candles from Groww API
    const response = await growwAPIRequest<{
      status: "SUCCESS" | "FAILURE";
      payload: {
        candles: Array<[string, number, number, number, number, number, number | null]>;
        closing_price: number | null;
        start_time: string;
        end_time: string;
        interval_in_minutes: number;
      };
    }>({
      method: "get",
      url: `https://api.groww.in/v1/historical/candles`,
      params: {
        candle_interval: "1minute",
        start_time,
        end_time,
        exchange: "NSE",
        segment: "CASH",
        groww_symbol: `NSE-${nseSymbol}`,
      },
    });

    if (
      response.status !== "SUCCESS" ||
      !response.payload?.candles ||
      response.payload.candles.length === 0
    ) {
      return {};
    }

    // Parse candles: [timestamp, open, high, low, close, volume, turnover]
    const candles = response.payload.candles.map((candle) => {
      const [timestamp, open, high, low, close] = candle;
      return {
        // convert to UTC since shortlistTimestamp is in UTC
        timestamp: dayjs.tz(timestamp, "Asia/Kolkata").utc().toDate(),
        open,
        high,
        low,
        close,
      };
    });

    // Use the entry price from shortlist (no need to find it like in orders)
    const entryPriceAtPlacement = entryPrice;

    // Avoid division by zero
    if (!entryPriceAtPlacement || entryPriceAtPlacement === 0) {
      return {};
    }

    const result: {
      targetPrice?: number;
      stopLossPrice?: number;
      targetAchieved?: boolean;
      stopLossHit?: boolean;
      timeToTargetMinutes?: number;
      timeToStopLossMinutes?: number;
      targetTimestamp?: string;
      stopLossTimestamp?: string;
    } = {};

    /**
     * Calculate target and stop loss prices based on entry price
     * Take profit price: entry_price × (1 + take_profit_percentage / 100)
     * Stop loss price: entry_price × (1 - stop_loss_percentage / 100)
     */
    const targetPrice = entryPriceAtPlacement * (1 + takeProfitPercentage / 100);
    const stopLossPrice = entryPriceAtPlacement * (1 - stopLossPercentage / 100);
    result.targetPrice = targetPrice;
    result.stopLossPrice = stopLossPrice;

    let targetTimestamp: Date | null = null;
    let stopLossTimestamp: Date | null = null;
    let bestPrice = entryPriceAtPlacement;

    // Check all candles after shortlist timestamp to see if target or stop loss was reached
    for (const candle of candles) {
      // Only consider candles strictly after shortlist capture (not equal to)
      if (!dayjs.utc(candle.timestamp).isAfter(dayjs.utc(shortlistTimestamp), "minute")) {
        continue;
      }

      // Check for stop loss hit (using candle low price)
      if (candle.low && typeof candle.low === "number" && stopLossTimestamp === null) {
        if (candle.low <= stopLossPrice) {
          stopLossTimestamp = candle.timestamp;
        }
      }

      // Check for take profit hit (using candle high price)
      if (candle.high && typeof candle.high === "number") {
        const highPrice = candle.high;

        // Track best price for calculating actual gain if target not achieved
        if (highPrice > bestPrice) {
          bestPrice = highPrice;
        }

        // Check if target price was reached (only record first occurrence)
        if (targetTimestamp === null && highPrice >= targetPrice) {
          targetTimestamp = candle.timestamp;
        }
      }
    }

    // Determine which happened first: stop loss or take profit
    // If stop loss was hit, we exit immediately, so target cannot be achieved
    // If take profit was hit first, we exit at take profit, so target is achieved
    let stopLossHit = false;
    let stopLossTimeDiffSeconds = Infinity;
    let targetTimeDiffSeconds = Infinity;

    if (stopLossTimestamp !== null) {
      const stopLossTimestampUTC = dayjs.utc(stopLossTimestamp).format("YYYY-MM-DD HH:mm:ss");
      stopLossTimeDiffSeconds = dayjs
        .utc(stopLossTimestampUTC)
        .diff(dayjs.utc(shortlistTimestamp), "second", true);

      // Ensure the timestamp is truly after the shortlist capture (at least 1 second difference)
      if (stopLossTimeDiffSeconds >= 1) {
        stopLossHit = true;
      }
    }

    if (targetTimestamp !== null) {
      const targetTimestampUTC = dayjs.utc(targetTimestamp).format("YYYY-MM-DD HH:mm:ss");
      targetTimeDiffSeconds = dayjs
        .utc(targetTimestampUTC)
        .diff(dayjs.utc(shortlistTimestamp), "second", true);
    }

    // Determine which happened first: stop loss or take profit
    // If stop loss was hit, mark it
    if (stopLossHit) {
      // If stop loss was hit first, we exited, so target is not achieved
      if (targetTimestamp !== null && stopLossTimeDiffSeconds < targetTimeDiffSeconds) {
        result.stopLossHit = true;
        result.timeToStopLossMinutes =
          stopLossTimeDiffSeconds < 30 ? 0 : Math.round(stopLossTimeDiffSeconds / 60);
        result.stopLossTimestamp = formatDateTime(stopLossTimestamp!);
        result.targetAchieved = false;
      } else if (targetTimestamp !== null && targetTimeDiffSeconds < stopLossTimeDiffSeconds) {
        // Take profit was hit first, so we exited at take profit (target achieved)
        // Stop loss was never triggered because we exited at target
        result.stopLossHit = false;
        result.targetAchieved = true;
        result.timeToTargetMinutes =
          targetTimeDiffSeconds < 30 ? 0 : Math.round(targetTimeDiffSeconds / 60);
        result.targetTimestamp = formatDateTime(targetTimestamp);
      } else {
        // Stop loss hit, but target was never reached
        result.stopLossHit = true;
        result.timeToStopLossMinutes =
          stopLossTimeDiffSeconds < 30 ? 0 : Math.round(stopLossTimeDiffSeconds / 60);
        result.stopLossTimestamp = formatDateTime(stopLossTimestamp!);
        result.targetAchieved = false;
      }
    } else {
      // Stop loss was not hit
      result.stopLossHit = false;

      // Handle target achievement if stop loss was not hit
      if (targetTimestamp !== null && targetTimeDiffSeconds >= 1) {
        result.targetAchieved = true;
        result.timeToTargetMinutes =
          targetTimeDiffSeconds < 30 ? 0 : Math.round(targetTimeDiffSeconds / 60);
        result.targetTimestamp = formatDateTime(targetTimestamp);
      } else {
        // Target was not achieved
        result.targetAchieved = false;
      }
    }

    return result;
  } catch (error) {
    // Return empty metrics on error
    return {};
  }
}

const shortlistsRoutes: FastifyPluginAsync = async (fastify) => {
  const redisManager = RedisManager.getInstance(fastify);
  const tokenManager = new TokenManager(redisManager.redis, fastify);
  const growwAPIRequest = makeGrowwAPIRequest(fastify, tokenManager);
  fastify.get("/", async (request, reply) => {
    // Check if trade metrics parameters were explicitly provided in the query
    const rawQuery = request.query as Record<string, unknown>;
    const shouldCalculateMetrics =
      rawQuery.takeProfitPercentage !== undefined &&
      rawQuery.stopLossPercentage !== undefined;

    const validationResult = validateRequest(
      request.query,
      reply,
      v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    try {
      const {
        datetime: dateTimeParam,
        timezone: timezoneParam,
        type: typeParam,
        takeProfitPercentage,
        stopLossPercentage,
      } = validationResult;

      // Convert datetime string to UTC Date
      const selectedDateTimeUTC = parseDateTimeInTimezone(dateTimeParam, timezoneParam);

      const shortlists = await prisma.shortlistSnapshot.findMany({
        where: {
          timestamp: {
            gte: selectedDateTimeUTC,
            lte: dayjs.utc(selectedDateTimeUTC).add(1, "second").toDate(), // Add 1 second
          },
          shortlistType: typeParam as ShortlistType,
        },
      });
      const quoteSnapshots = await prisma.quoteSnapshot.findMany({
        where: {
          timestamp: {
            gte: selectedDateTimeUTC,
            lte: dayjs.utc(selectedDateTimeUTC).add(1, "minute").toDate(), // Add 1 minute
          },
        },
      });

      if (shortlists.length === 0) {
        return sendResponse<
          z.infer<
            typeof v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.response
          >
        >(reply, {
          statusCode: 200,
          message: "Shortlist fetched successfully",
          data: {
            shortlist: null,
          },
        });
      }

      const shortlistFromDb = shortlists[0];
      const shortlistEntries = shortlistFromDb.entries as
        | z.infer<typeof shortlistEntrySchema>[]
        | null;
      let entries: Array<z.infer<typeof shortlistEntrySchema>> = [];

      if (shortlistEntries) {
        // Process entries with trade metrics in parallel
        const entriesWithMetrics = await Promise.all(
          shortlistEntries.flatMap(async (entry) => {
            const quoteSnapshot = quoteSnapshots.find(
              (quoteSnapshot) => quoteSnapshot.nseSymbol === entry.nseSymbol
            );
            const quoteData = quoteSnapshot?.quoteData;

            if (quoteData) {
              // Only calculate trade metrics if both parameters were explicitly provided
              const tradeMetrics = shouldCalculateMetrics
                ? await calculateTradeMetrics({
                    nseSymbol: entry.nseSymbol,
                    entryPrice: entry.price,
                    shortlistTimestamp: selectedDateTimeUTC,
                    takeProfitPercentage,
                    stopLossPercentage,
                    growwAPIRequest,
                  })
                : {};

              const data: NonNullable<
                z.infer<
                  typeof v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.response
                >["data"]["shortlist"]
              >["entries"][number] = {
                nseSymbol: entry.nseSymbol,
                name: entry.name,
                price: entry.price,
                quoteData: quoteData as unknown as z.infer<typeof growwQuoteSchema>,
                stopLossHit: tradeMetrics.stopLossHit,
                timeToStopLossMinutes: tradeMetrics.timeToStopLossMinutes,
                stopLossTimestamp: tradeMetrics.stopLossTimestamp,
                targetAchieved: tradeMetrics.targetAchieved,
                timeToTargetMinutes: tradeMetrics.timeToTargetMinutes,
                targetTimestamp: tradeMetrics.targetTimestamp,
                stopLossPrice: tradeMetrics.stopLossPrice,
                targetPrice: tradeMetrics.targetPrice,
              };

              return data;
            }

            return [];
          })
        );

        entries = entriesWithMetrics.flat();
      }

      return sendResponse<
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.response>
      >(reply, {
        statusCode: 200,
        message: "Shortlist fetched successfully",
        data: {
          shortlist: {
            id: shortlistFromDb.id,
            timestamp: formatDateTime(shortlistFromDb.timestamp),
            shortlistType: shortlistFromDb.shortlistType,
            entries,
          },
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching shortlists: %s", JSON.stringify(error));
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch shortlists";
      return reply.internalServerError(errorMessage);
    }
  });
};

export default shortlistsRoutes;
