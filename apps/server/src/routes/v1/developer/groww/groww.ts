import { growwQuoteSchema, v1_developer_groww_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { validateCurrentTimestamp } from "../../../../utils/current-timestamp-validator";
import { formatDateTime } from "../../../../utils/date-formatter";
import { makeGrowwAPIRequest } from "../../../../utils/groww-api-request";
import { prisma } from "../../../../utils/prisma";
import { RedisManager } from "../../../../utils/redis";
import { sendResponse } from "../../../../utils/sendResponse";
import { parseDateTimeInTimezone } from "../../../../utils/timezone";
import { TokenManager } from "../../../../utils/token-manager";
import { validateRequest } from "../../../../utils/validator";

dayjs.extend(utc);
dayjs.extend(timezone);

const growwRoutes: FastifyPluginAsync = async (fastify) => {
  const redisManager = RedisManager.getInstance(fastify);
  const tokenManager = new TokenManager(redisManager.redis, fastify);
  const growwAPIRequest = makeGrowwAPIRequest(fastify, tokenManager);

  // Get latest token endpoint
  fastify.get("/token", async (request, reply) => {
    const token = await tokenManager.getToken();
    return sendResponse<z.infer<typeof v1_developer_groww_schemas.getGrowwToken.response>>(reply, {
      statusCode: 200,
      message: "Token fetched successfully",
      data: token,
    });
  });

  // ==================== GET /quote ====================

  // Quote endpoint
  fastify.get("/quote", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_developer_groww_schemas.getGrowwQuote.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    // If datetime is provided, fetch from snapshot
    const datetime = validationResult.datetime;
    const timezone = validationResult.timezone || "Asia/Kolkata";
    if (datetime) {
      try {
        // Convert datetime string to UTC Date object
        const selectedDateTime = parseDateTimeInTimezone(datetime, timezone);

        // Validate against currentTimestamp if present
        if (request.currentTimestamp) {
          try {
            validateCurrentTimestamp(request.currentTimestamp, [selectedDateTime], reply);
          } catch (error) {
            // Error already sent via reply in validator
            return;
          }
        }

        const quoteSnapshots = await prisma.quoteSnapshot.findMany({
          where: {
            timestamp: {
              gte: selectedDateTime,
              lte: dayjs.utc(selectedDateTime).add(1, "minute").toDate(), // Add 1 minute
            },
            nseSymbol: validationResult.symbol,
          },
          orderBy: {
            timestamp: "desc",
          },
        });

        if (quoteSnapshots.length === 0) {
          return sendResponse<z.infer<typeof v1_developer_groww_schemas.getGrowwQuote.response>>(
            reply,
            {
              statusCode: 200,
              message: "Quote snapshot not found",
              data: null as any,
            }
          );
        }

        const quoteSnapshot = quoteSnapshots[0];
        const quoteData = quoteSnapshot.quoteData as z.infer<typeof growwQuoteSchema> | null;

        if (!quoteData) {
          return sendResponse<z.infer<typeof v1_developer_groww_schemas.getGrowwQuote.response>>(
            reply,
            {
              statusCode: 200,
              message: "Quote snapshot not found",
              data: null as any,
            }
          );
        }

        return sendResponse<z.infer<typeof v1_developer_groww_schemas.getGrowwQuote.response>>(
          reply,
          {
            statusCode: 200,
            message: "Quote fetched successfully",
            data: quoteData,
          }
        );
      } catch (error) {
        fastify.log.error(
          `Error fetching quote snapshot for ${
            validationResult.symbol
          } at ${datetime}: ${JSON.stringify(error)}`
        );
        return reply.internalServerError(
          "Failed to fetch quote snapshot. Please check server logs for more details."
        );
      }
    }

    // If no datetime, fetch live data from Groww API
    try {
      const response = await growwAPIRequest<z.infer<typeof growwQuoteSchema>>({
        method: "get",
        url: `https://api.groww.in/v1/live-data/quote`,
        params: {
          exchange: "NSE",
          segment: "CASH",
          trading_symbol: validationResult.symbol,
        },
      });

      return sendResponse<z.infer<typeof v1_developer_groww_schemas.getGrowwQuote.response>>(
        reply,
        {
          statusCode: 200,
          message: "Quote fetched successfully",
          data: response,
        }
      );
    } catch (error) {
      fastify.log.error("Error fetching quote: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to fetch quote. Please check server logs for more details."
      );
    }
  });

  // ==================== GET /historical-candles ====================

  // Historical candles endpoint
  fastify.get("/historical-candles", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_developer_groww_schemas.getGrowwHistoricalCandles.query,
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

      const response = await growwAPIRequest<
        z.infer<typeof v1_developer_groww_schemas.growwHistoricalCandlesSchema>
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
      });

      return sendResponse<
        z.infer<typeof v1_developer_groww_schemas.getGrowwHistoricalCandles.response>
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

  // ==================== GET /quote-timeline ====================

  // Quote timeline endpoint
  fastify.get("/quote-timeline", async (request, reply) => {
    const validationResult = validateRequest<
      z.infer<typeof v1_developer_groww_schemas.getGrowwQuoteTimeline.query>
    >(request.query, reply, v1_developer_groww_schemas.getGrowwQuoteTimeline.query, "query");
    if (!validationResult) {
      return;
    }

    try {
      const timezone = validationResult.timezone || "Asia/Kolkata";

      // Parse end_datetime in the specified timezone
      const endDateTimeUTC = parseDateTimeInTimezone(validationResult.end_datetime, timezone);

      // Validate against currentTimestamp if present (prevents future data access in backtesting)
      if (request.currentTimestamp) {
        try {
          validateCurrentTimestamp(request.currentTimestamp, [endDateTimeUTC], reply);
        } catch (error) {
          // Error already sent via reply in validator
          return;
        }
      }

      // Extract date from end_datetime to calculate market start
      const dateStr = dayjs.utc(endDateTimeUTC).tz(timezone).format("YYYY-MM-DD");
      const marketStart = dayjs.tz(`${dateStr} 09:14:00`, timezone);
      const marketStartUtc = marketStart.utc();

      // Fetch quote snapshots from market start to end_datetime
      const quoteSnapshots = await prisma.quoteSnapshot.findMany({
        where: {
          timestamp: {
            gte: marketStartUtc.toDate(),
            lt: endDateTimeUTC,
          },
          nseSymbol: validationResult.symbol,
        },
        orderBy: {
          timestamp: "asc",
        },
      });

      return sendResponse<
        z.infer<typeof v1_developer_groww_schemas.getGrowwQuoteTimeline.response>
      >(reply, {
        statusCode: 200,
        message: "Quote timeline fetched successfully",
        data: {
          quoteTimeline: quoteSnapshots.map((snapshot) => ({
            id: snapshot.id,
            timestamp: formatDateTime(snapshot.timestamp),
            nseSymbol: snapshot.nseSymbol,
            quoteData: snapshot.quoteData as unknown as z.infer<typeof growwQuoteSchema>,
            createdAt: formatDateTime(snapshot.createdAt),
            updatedAt: formatDateTime(snapshot.updatedAt),
          })),
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching quote timeline: %s", JSON.stringify(error));

      let errorMessage = "Failed to fetch quote timeline";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return reply.internalServerError(errorMessage);
    }
  });

  // ==================== GET /nifty ====================

  // NIFTY quote endpoint
  fastify.get("/nifty", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_developer_groww_schemas.getGrowwNiftyQuote.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    // If datetime is provided, fetch from snapshot
    const datetime = validationResult.datetime;
    const timezone = validationResult.timezone || "Asia/Kolkata";
    if (datetime) {
      try {
        // Convert datetime string to UTC Date object
        const selectedDateTime = parseDateTimeInTimezone(datetime, timezone);

        // Validate against currentTimestamp if present
        if (request.currentTimestamp) {
          try {
            validateCurrentTimestamp(request.currentTimestamp, [selectedDateTime], reply);
          } catch (error) {
            // Error already sent via reply in validator
            return;
          }
        }

        const niftyQuotes = await prisma.niftyQuote.findMany({
          where: {
            timestamp: {
              gte: selectedDateTime,
              lte: dayjs.utc(selectedDateTime).add(1, "minute").toDate(), // Add 1 minute
            },
          },
          orderBy: {
            timestamp: "desc",
          },
        });

        if (niftyQuotes.length === 0) {
          return sendResponse<
            z.infer<typeof v1_developer_groww_schemas.getGrowwNiftyQuote.response>
          >(reply, {
            statusCode: 200,
            message: "NIFTY quote snapshot not found",
            data: null as any,
          });
        }

        const niftyQuote = niftyQuotes[0];
        const quoteData = niftyQuote.quoteData as z.infer<typeof growwQuoteSchema> | null;

        if (!quoteData) {
          return sendResponse<
            z.infer<typeof v1_developer_groww_schemas.getGrowwNiftyQuote.response>
          >(reply, {
            statusCode: 200,
            message: "NIFTY quote snapshot not found",
            data: null as any,
          });
        }

        return sendResponse<z.infer<typeof v1_developer_groww_schemas.getGrowwNiftyQuote.response>>(
          reply,
          {
            statusCode: 200,
            message: "NIFTY quote fetched successfully",
            data: quoteData,
          }
        );
      } catch (error) {
        fastify.log.error(
          `Error fetching NIFTY quote snapshot at ${datetime}: ${JSON.stringify(error)}`
        );
        return reply.internalServerError(
          "Failed to fetch NIFTY quote snapshot. Please check server logs for more details."
        );
      }
    }

    // If no datetime, return error - NIFTY quotes must be fetched from historical data
    return reply.badRequest("datetime parameter is required for NIFTY quotes");
  });
};

export default growwRoutes;
