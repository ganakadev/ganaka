import {
  v1_dashboard_schemas,
  v1_developer_candles_schemas,
  validCandleIntervals,
} from "@ganaka/schemas";
import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { formatDateTime } from "../../../utils/date-formatter";
import { makeGrowwAPIRequest } from "../../../utils/groww-api-request";
import { RedisManager } from "../../../utils/redis";
import { sendResponse } from "../../../utils/sendResponse";
import { TokenManager } from "../../../utils/token-manager";
import { validateRequest } from "../../../utils/validator";
import { sourceBasedExecute } from "../../../utils/sourceBasedExecute";
import { parseDateTimeInTimezone } from "../../../utils/timezone";
import { validateCurrentTimestamp } from "../../../utils/current-timestamp-validator";

dayjs.extend(utc);
dayjs.extend(timezone);

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
            return await sourceBasedExecute({
              request,
              reply,
              sources: {
                dashboard: async () => {
                  const validationResult = validateRequest(
                    request.query,
                    reply,
                    v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.query,
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

                  // Make API request
                  const response = await growwAPIRequest<{
                    status: "SUCCESS" | "FAILURE";
                    payload: {
                      candles: Array<
                        [string, number, number, number, number, number, number | null]
                      >;
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
                    z.infer<
                      typeof v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.response
                    >
                  >(reply, {
                    statusCode: 200,
                    message: "Candles fetched successfully",
                    data: {
                      candles: candleData,
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
              },
            });
          },
          developer: async () => {
            const validationResult = validateRequest(
              request.query,
              reply,
              v1_developer_candles_schemas.getGrowwHistoricalCandles.query,
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
              z.infer<typeof v1_developer_candles_schemas.growwHistoricalCandlesSchema>
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
              z.infer<typeof v1_developer_candles_schemas.getGrowwHistoricalCandles.response>
            >(reply, {
              statusCode: 200,
              message: "Historical candles fetched successfully",
              data: response,
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
