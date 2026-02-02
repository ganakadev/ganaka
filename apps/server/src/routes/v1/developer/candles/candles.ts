import { v1_developer_candles_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { validateCurrentTimestamp } from "../../../../utils/current-timestamp-validator";
import { sendResponse } from "../../../../utils/sendResponse";
import { parseDateTimeInTimezone } from "../../../../utils/timezone";
import { TokenManager } from "../../../../utils/token-manager";
import { validateRequest } from "../../../../utils/validator";
import { makeGrowwAPIRequest } from "../../../../utils/groww-api-request";
import { RedisManager } from "../../../../utils/redis";

dayjs.extend(utc);
dayjs.extend(timezone);

const historicalCandlesRoutes: FastifyPluginAsync = async (fastify) => {
  const redisManager = RedisManager.getInstance(fastify);
  const tokenManager = new TokenManager(redisManager.redis, fastify);
  const growwAPIRequest = makeGrowwAPIRequest(fastify, tokenManager);

  // ==================== GET /v1/developer/candles ====================
  fastify.get("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_developer_candles_schemas.getGrowwHistoricalCandles.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    try {
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
      const endTimeIST = dayjs.utc(endDateTimeUTC).tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss");

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
    } catch (error) {
      fastify.log.error("Error fetching historical candles: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to fetch historical candles. Please check server logs for more details."
      );
    }
  });
};

export default historicalCandlesRoutes;
