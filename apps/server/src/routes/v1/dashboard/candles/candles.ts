import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import z from "zod";
import { RedisManager } from "../../../../utils/redis";
import { sendResponse } from "../../../../utils/sendResponse";
import { TokenManager } from "../../../../utils/token-manager";
import { validateRequest } from "../../../../utils/validator";
import { v1_dashboard_schemas, validCandleIntervals } from "@ganaka/schemas";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Helper function to make Groww API requests with automatic token refresh
 */
const makeGrowwAPIRequest =
  (fastify: FastifyInstance, tokenManager: TokenManager) =>
  async <T>({
    method,
    url,
    params,
  }: {
    url: string;
    method: string;
    params?: Record<string, any>;
  }): Promise<T> => {
    const maxAttempts = 3;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const accessToken = await tokenManager.getToken();
        if (!accessToken) {
          throw new Error("Failed to get access token");
        }

        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        const response = await axios({
          method,
          url,
          params,
          headers,
        });

        return response.data;
      } catch (error) {
        lastError = error;
        console.dir(error, { depth: null });

        // Check if it's a 401 Unauthorized error
        const isUnauthorized =
          axios.isAxiosError(error) && (error as AxiosError).response?.status === 401;

        if (isUnauthorized && attempt < maxAttempts) {
          // Invalidate token and retry
          await tokenManager.invalidateToken();
          continue;
        }

        // Log the error response for debugging
        if (axios.isAxiosError(error) && error.response) {
          const errorResponse = {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            config: {
              url: error.config?.url,
              params: error.config?.params,
            },
          };
          fastify.log.error("Groww API Error: %s", JSON.stringify(errorResponse));

          // For 500 errors, log additional details
          if (error.response.status === 500) {
            fastify.log.error(
              "Groww API 500 Error Details - URL: %s, Params: %s, Response Data: %s",
              error.config?.url,
              JSON.stringify(error.config?.params),
              JSON.stringify(error.response.data)
            );
            continue;
          }
        }

        throw error;
      }
    }

    throw lastError;
  };

const candlesRoutes: FastifyPluginAsync = async (fastify) => {
  const redisManager = RedisManager.getInstance(fastify);
  const tokenManager = new TokenManager(redisManager.redis, fastify);
  const growwAPIRequest = makeGrowwAPIRequest(fastify, tokenManager);

  fastify.get("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    try {
      const { symbol, date: dateParam, interval } = validationResult;

      // Parse the selected date (it comes in as UTC ISO string)
      const selectedDate = dayjs(dateParam);
      if (!selectedDate.isValid()) {
        return reply.badRequest("Invalid date format");
      }

      // Get the date in IST timezone and set market hours (9:15 AM - 3:30 PM IST)
      // Extract just the date part (YYYY-MM-DD) and create new dayjs object in IST
      const dateStr = selectedDate.format("YYYY-MM-DD");
      const marketStart = dayjs.tz(`${dateStr} 09:15:00`, "Asia/Kolkata");
      const marketEnd = dayjs.tz(`${dateStr} 15:30:00`, "Asia/Kolkata");

      // Convert to format expected by Groww API: YYYY-MM-DDTHH:mm:ss (no milliseconds, no Z)
      // The API expects times in IST format without timezone suffix
      const start_time = marketStart.format("YYYY-MM-DDTHH:mm:ss");
      const end_time = marketEnd.format("YYYY-MM-DDTHH:mm:ss");

      // Validate interval
      if (interval && !validCandleIntervals.includes(interval)) {
        return reply.badRequest(
          `Invalid interval. Must be one of: ${validCandleIntervals.join(", ")}`
        );
      }

      // Use interval from query or default to 1minute
      const candleInterval = interval || "1minute";

      // Make API request
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
          groww_symbol: `NSE-${symbol}`,
        },
      });

      // Convert candles to lightweight-charts format
      const candleData = response.payload.candles.flatMap((candle) => {
        // candle is [timestamp, open, high, low, close, volume, turnover]
        const [timestamp, open, high, low, close] = candle;
        // Convert timestamp string to Unix timestamp
        const time = dayjs.utc(timestamp).unix() as number;
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
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.response>
      >({
        statusCode: 200,
        message: "Candles fetched successfully",
        data: {
          candles: candleData,
          start_time: response.payload.start_time,
          end_time: response.payload.end_time,
          interval_in_minutes: response.payload.interval_in_minutes,
        },
      });
    } catch (error) {
      const { symbol, date: dateParam } = validationResult;
      fastify.log.error(
        "Error fetching candles - Symbol: %s, Date: %s, Error: %s",
        symbol,
        dateParam,
        JSON.stringify(error)
      );

      // Provide more detailed error information
      let errorMessage = "Failed to fetch candles";
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;

          // Special handling for 500 errors from Groww API
          if (status === 500) {
            const growwErrorMessage =
              error.response.data?.message ||
              error.response.data?.error ||
              error.response.data?.errorMessage;

            errorMessage = growwErrorMessage
              ? `Groww API error: ${JSON.stringify(
                  growwErrorMessage
                )}. Please verify the date (${dateParam}) and symbol (${symbol}) are valid.`
              : `Groww API returned a server error. Please verify the date (${dateParam}) and symbol (${symbol}) are valid. Historical data may not be available for this date.`;

            fastify.log.error(
              "Groww API 500 Error - Symbol: %s, Date: %s, Response: %s",
              symbol,
              dateParam,
              JSON.stringify(error.response.data)
            );
          } else {
            // For other status codes, use existing logic
            errorMessage =
              error.response.data?.message ||
              error.response.data?.error ||
              `API Error: ${status} ${error.response.statusText}`;
            fastify.log.error("API Error Details: %s", JSON.stringify(error.response.data));
          }
        } else if (error.request) {
          errorMessage = "No response from API";
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return reply.internalServerError(errorMessage);
    }
  });
};

export default candlesRoutes;
