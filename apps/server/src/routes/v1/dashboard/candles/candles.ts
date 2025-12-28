import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { RedisManager } from "../../../../utils/redis";
import { sendResponse } from "../../../../utils/sendResponse";
import { TokenManager } from "../../../../utils/token-manager";
import { validateRequest } from "../../../../utils/validator";
import { v1_dashboard_schemas, validCandleIntervals } from "@ganaka/schemas";
import { makeGrowwAPIRequest } from "../../../../utils/groww-api-request";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Helper function to safely extract error messages from response data.
 * Converts objects to JSON strings to avoid "[object Object]" issues.
 */
function safeExtractErrorMessage(value: unknown): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

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

          // Special handling for rate limit errors (429)
          if (status === 429) {
            const rateLimitMessage = safeExtractErrorMessage(
              error.response.data?.message || error.response.data?.error
            );
            errorMessage = rateLimitMessage
              ? `Rate limit exceeded: ${rateLimitMessage}. Please try again later.`
              : "Rate limit exceeded. Please try again later.";

            fastify.log.error(
              "Groww API Rate Limit Error - Symbol: %s, Date: %s, Response: %s",
              symbol,
              dateParam,
              JSON.stringify(error.response.data)
            );
          } else if (status === 500) {
            // Special handling for 500 errors from Groww API
            const growwErrorMessage =
              safeExtractErrorMessage(
                error.response.data?.message ||
                  error.response.data?.error ||
                  error.response.data?.errorMessage
              ) || undefined;

            errorMessage = growwErrorMessage
              ? `Groww API error: ${growwErrorMessage}. Please verify the date (${dateParam}) and symbol (${symbol}) are valid.`
              : `Groww API returned a server error. Please verify the date (${dateParam}) and symbol (${symbol}) are valid. Historical data may not be available for this date.`;

            fastify.log.error(
              "Groww API 500 Error - Symbol: %s, Date: %s, Response: %s",
              symbol,
              dateParam,
              JSON.stringify(error.response.data)
            );
          } else {
            // For other status codes, use safe extraction
            const extractedMessage =
              safeExtractErrorMessage(error.response.data?.message) ||
              safeExtractErrorMessage(error.response.data?.error);
            errorMessage = extractedMessage
              ? extractedMessage
              : `API Error: ${status} ${error.response.statusText}`;
            fastify.log.error("API Error Details: %s", JSON.stringify(error.response.data));
          }
        } else if (error.request) {
          errorMessage = "No response from API";
        } else {
          errorMessage = error.message || "Unknown API error";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message || "Unknown error occurred";
      } else {
        // Fallback for non-Error objects
        errorMessage = typeof error === "string" ? error : JSON.stringify(error);
      }

      // Ensure errorMessage is always a string
      const finalErrorMessage = typeof errorMessage === "string" ? errorMessage : String(errorMessage);
      return reply.internalServerError(finalErrorMessage);
    }
  });
};

export default candlesRoutes;
