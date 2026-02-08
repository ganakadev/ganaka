import { v1_schemas, validCandleIntervals } from "@ganaka/schemas";
import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { validateCurrentTimestamp } from "../../../utils/current-timestamp-validator";
import { formatDateTime } from "../../../utils/date-formatter";
import { makeGrowwAPIRequest } from "../../../utils/groww-api-request";
import { prisma } from "../../../utils/prisma";
import { RedisManager } from "../../../utils/redis";
import { sendResponse } from "../../../utils/sendResponse";
import { sourceBasedExecute } from "../../../utils/sourceBasedExecute";
import { parseDateTimeInTimezone } from "../../../utils/timezone";
import { TokenManager } from "../../../utils/token-manager";
import { validateRequest } from "../../../utils/validator";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Get today's date in IST timezone as YYYY-MM-DD string
 */
function getTodayIST(): string {
  return dayjs.utc().tz("Asia/Kolkata").format("YYYY-MM-DD");
}

const dbCandleBoundaryStart = dayjs.tz("2025-11-01 09:15:00", "Asia/Kolkata");
const dbCandleBoundaryEnd = dayjs
  .tz(`${getTodayIST()} 15:30:00`, "Asia/Kolkata")
  .subtract(1, "day");

/**
 * Fetch candles from database for a given symbol and time range
 * Returns null if instrument not found
 */
async function fetchCandlesFromDB(
  symbol: string,
  startUTC: Date,
  endUTC: Date
): Promise<Array<{
  timestamp: Date;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: bigint | null;
}> | null> {
  const instrument = await prisma.nseIntrument.findUnique({
    where: { symbol },
  });

  if (!instrument) {
    return null;
  }

  const candles = await prisma.nseCandle.findMany({
    where: {
      instrumentId: instrument.id,
      timestamp: {
        gte: startUTC,
        lte: endUTC,
      },
    },
    orderBy: {
      timestamp: "asc",
    },
  });

  return candles.map((candle) => ({
    timestamp: candle.timestamp,
    open: candle.open ? Number(candle.open) : null,
    high: candle.high ? Number(candle.high) : null,
    low: candle.low ? Number(candle.low) : null,
    close: candle.close ? Number(candle.close) : null,
    volume: candle.volume,
  }));
}

const candlesRoutes: FastifyPluginAsync = async (fastify) => {
  const redisManager = RedisManager.getInstance(fastify);
  const tokenManager = new TokenManager(redisManager.redis, fastify);
  const growwAPIRequest = makeGrowwAPIRequest(fastify, tokenManager);

  // ==================== GET /v1/candles ====================
  fastify.get("/", async (request, reply) => {
    try {
      return await sourceBasedExecute({
        request,
        reply,
        sources: {
          dashboard: async () => {
            const validationResult = validateRequest(
              request.query,
              reply,
              v1_schemas.v1_candles_schemas.getDashboardCandles.query,
              "query"
            );
            if (!validationResult) {
              return;
            }

            // using validationResult.date directly as it is in UTC
            const marketStart = dayjs.tz(`${validationResult.date} 09:15:00`, "Asia/Kolkata");
            const marketEnd = dayjs.tz(`${validationResult.date} 15:30:00`, "Asia/Kolkata");

            // Convert to format expected by Groww API: YYYY-MM-DDTHH:mm:ss (no milliseconds, no Z)
            // The API expects times in IST format without timezone suffix
            const start_time = marketStart.format("YYYY-MM-DDTHH:mm:ss");
            const end_time = marketEnd.format("YYYY-MM-DDTHH:mm:ss");

            // Validate interval
            if (
              validationResult.interval &&
              !validCandleIntervals.includes(validationResult.interval)
            ) {
              return reply.badRequest(
                `Invalid interval. Must be one of: ${validCandleIntervals.join(", ")}`
              );
            }

            // Use interval from query or default to 1minute
            const candleInterval = validationResult.interval || "1minute";

            // Check if we should fetch from DB or Groww
            const shouldFetchFromDB =
              candleInterval === "1minute" &&
              !marketStart.isBefore(dbCandleBoundaryStart) &&
              !marketEnd.isAfter(dbCandleBoundaryEnd) &&
              validationResult.ignoreDb !== true;

            if (shouldFetchFromDB) {
              // Fetch from database
              const marketStartUTC = marketStart.utc().toDate();
              const marketEndUTC = marketEnd.utc().toDate();

              const dbCandles = await fetchCandlesFromDB(
                validationResult.symbol,
                marketStartUTC,
                marketEndUTC
              );

              if (dbCandles === null) {
                return sendResponse<
                  z.infer<typeof v1_schemas.v1_candles_schemas.getDashboardCandles.response>
                >(reply, {
                  statusCode: 200,
                  message: "Candles fetched successfully",
                  data: {
                    candles: [],
                    start_time: null,
                    end_time: null,
                    interval_in_minutes: 1,
                    source: "db",
                  },
                });
              }

              // Convert candles to lightweight-charts format
              const candleData = dbCandles
                .filter((candle) => {
                  return (
                    candle.open !== null &&
                    candle.high !== null &&
                    candle.low !== null &&
                    candle.close !== null &&
                    typeof candle.open === "number" &&
                    typeof candle.high === "number" &&
                    typeof candle.low === "number" &&
                    typeof candle.close === "number"
                  );
                })
                .map((candle) => {
                  const time = dayjs.utc(candle.timestamp).unix() as number;
                  return {
                    time,
                    open: candle.open as number,
                    high: candle.high as number,
                    low: candle.low as number,
                    close: candle.close as number,
                  };
                });

              return sendResponse<
                z.infer<typeof v1_schemas.v1_candles_schemas.getDashboardCandles.response>
              >(reply, {
                statusCode: 200,
                message: "Candles fetched successfully",
                data: {
                  candles: candleData,
                  source: "db",
                  start_time: formatDateTime(marketStartUTC),
                  end_time: formatDateTime(marketEndUTC),
                  interval_in_minutes: 1,
                },
              });
            }

            // Make API request to Groww
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
                candle_interval: candleInterval,
                start_time,
                end_time,
                exchange: "NSE",
                segment: "CASH",
                groww_symbol: `NSE-${validationResult.symbol}`,
              },
            });

            // Convert candles to lightweight-charts format
            const candleData = response.payload.candles.flatMap((candle) => {
              // candle is [timestamp, open, high, low, close, volume, turnover]
              const [timestamp, open, high, low, close] = candle;
              // Convert timestamp string to Unix timestamp
              const time = dayjs.tz(timestamp, "Asia/Kolkata").utc().unix() as number;
              if (
                !open ||
                !high ||
                !low ||
                !close ||
                typeof open !== "number" ||
                typeof high !== "number" ||
                typeof low !== "number" ||
                typeof close !== "number"
              ) {
                return [];
              }
              return {
                time,
                open: open,
                high: high,
                low: low,
                close: close,
              };
            });

            return sendResponse<
              z.infer<typeof v1_schemas.v1_candles_schemas.getDashboardCandles.response>
            >(reply, {
              statusCode: 200,
              message: "Candles fetched successfully",
              data: {
                candles: candleData,
                source: "broker",
                // Convert start_time and end_time to UTC since Groww API returns times in IST
                start_time: response.payload.start_time
                  ? formatDateTime(
                      dayjs.tz(response.payload.start_time, "Asia/Kolkata").utc().toDate()
                    )
                  : null,
                end_time: response.payload.end_time
                  ? formatDateTime(
                      dayjs.tz(response.payload.end_time, "Asia/Kolkata").utc().toDate()
                    )
                  : null,
                interval_in_minutes: response.payload.interval_in_minutes,
              },
            });
          },
          developer: async () => {
            const validationResult = validateRequest(
              request.query,
              reply,
              v1_schemas.v1_candles_schemas.getDeveloperCandles.query,
              "query"
            );
            if (!validationResult) {
              return;
            }

            // Convert datetime strings to UTC Date objects for validation
            const startDateTimeUTC = parseDateTimeInTimezone(
              validationResult.start_datetime,
              validationResult.timezone ?? "Asia/Kolkata"
            );
            const endDateTimeUTC = parseDateTimeInTimezone(
              validationResult.end_datetime,
              validationResult.timezone ?? "Asia/Kolkata"
            );

            // Validate against currentTimestamp if present
            if (request.currentTimestamp) {
              try {
                validateCurrentTimestamp(
                  request.currentTimestamp,
                  [startDateTimeUTC, endDateTimeUTC],
                  reply
                );
              } catch (error) {
                // Error already sent via reply in validator
                return;
              }
            }

            // Check if we should fetch from DB or Groww
            const startDateIST = dayjs.utc(startDateTimeUTC).tz("Asia/Kolkata");
            const endDateIST = dayjs.utc(endDateTimeUTC).tz("Asia/Kolkata");
            const shouldFetchFromDB =
              validationResult.interval === "1minute" &&
              !startDateIST.isBefore(dbCandleBoundaryStart) &&
              !endDateIST.isAfter(dbCandleBoundaryEnd) &&
              validationResult.ignoreDb !== true;

            if (shouldFetchFromDB) {
              // Fetch from database
              const dbCandles = await fetchCandlesFromDB(
                validationResult.symbol,
                startDateTimeUTC,
                endDateTimeUTC
              );

              if (dbCandles === null) {
                return sendResponse<
                  z.infer<typeof v1_schemas.v1_candles_schemas.getDeveloperCandles.response>
                >(reply, {
                  statusCode: 200,
                  message: "Candles fetched successfully",
                  data: {
                    status: "SUCCESS",
                    payload: {
                      candles: [],
                      closing_price: null,
                      start_time: null,
                      end_time: null,
                      interval_in_minutes: 1,
                      source: "db",
                    },
                  },
                });
              }

              // Convert datetime strings to IST format for response
              const startTimeIST = dayjs
                .utc(startDateTimeUTC)
                .tz("Asia/Kolkata")
                .format("YYYY-MM-DDTHH:mm:ss");
              const endTimeIST = dayjs
                .utc(endDateTimeUTC)
                .tz("Asia/Kolkata")
                .format("YYYY-MM-DDTHH:mm:ss");

              // Transform to Groww response format
              const candles = dbCandles
                .filter((candle) => {
                  return (
                    candle.open !== null &&
                    candle.high !== null &&
                    candle.low !== null &&
                    candle.close !== null &&
                    typeof candle.open === "number" &&
                    typeof candle.high === "number" &&
                    typeof candle.low === "number" &&
                    typeof candle.close === "number"
                  );
                })
                .map((candle) => {
                  const timestampIST = dayjs
                    .utc(candle.timestamp)
                    .tz("Asia/Kolkata")
                    .format("YYYY-MM-DDTHH:mm:ss");
                  return [
                    timestampIST,
                    candle.open as number,
                    candle.high as number,
                    candle.low as number,
                    candle.close as number,
                    candle.volume ? Number(candle.volume) : null,
                    null,
                  ] as [string, number, number, number, number, number | null, null];
                });

              const dbResponse: z.infer<typeof v1_schemas.v1_candles_schemas.candlesSchema> = {
                status: "SUCCESS",
                payload: {
                  candles,
                  closing_price: null,
                  start_time: startTimeIST,
                  end_time: endTimeIST,
                  interval_in_minutes: 1,
                  source: "db",
                },
              };

              return sendResponse<
                z.infer<typeof v1_schemas.v1_candles_schemas.getDeveloperCandles.response>
              >(reply, {
                statusCode: 200,
                message: "Historical candles fetched successfully",
                data: dbResponse,
              });
            }

            // Convert datetime strings to IST format for Groww API
            const startTimeIST = dayjs
              .utc(startDateTimeUTC)
              .tz("Asia/Kolkata")
              .format("YYYY-MM-DDTHH:mm:ss");
            const endTimeIST = dayjs
              .utc(endDateTimeUTC)
              .tz("Asia/Kolkata")
              .format("YYYY-MM-DDTHH:mm:ss");

            const developerCredentials = request.developer
              ? {
                  developerId: request.developer.id,
                  growwApiKey: request.developer.growwApiKey,
                  growwApiSecret: request.developer.growwApiSecret,
                }
              : undefined;

            const response = await growwAPIRequest<
              z.infer<typeof v1_schemas.v1_candles_schemas.candlesSchema>
            >({
              method: "get",
              url: `https://api.groww.in/v1/historical/candles`,
              params: {
                candle_interval: validationResult.interval,
                start_time: startTimeIST,
                end_time: endTimeIST,
                exchange: "NSE",
                segment: "CASH",
                groww_symbol: `NSE-${validationResult.symbol}`,
              },
              developerCredentials,
            });

            return sendResponse<
              z.infer<typeof v1_schemas.v1_candles_schemas.getDeveloperCandles.response>
            >(reply, {
              statusCode: 200,
              message: "Historical candles fetched successfully",
              data: {
                status: response.status,
                payload: {
                  candles: response.payload.candles,
                  closing_price: response.payload.closing_price,
                  start_time: response.payload.start_time,
                  end_time: response.payload.end_time,
                  interval_in_minutes: response.payload.interval_in_minutes,
                  source: "broker",
                },
              },
            });
          },
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching candles - Error: %s", JSON.stringify(error));

      if (axios.isAxiosError(error) && error.response?.status === 429) {
        return reply.status(429).send({
          statusCode: 429,
          error: "Too Many Requests",
          message: "Too Many Requests",
        });
      }

      return reply.internalServerError();
    }
  });
};

export default candlesRoutes;
