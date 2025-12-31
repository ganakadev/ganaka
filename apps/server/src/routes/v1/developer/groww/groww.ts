import { growwQuoteSchema, v1_developer_groww_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { makeGrowwAPIRequest } from "../../../../utils/groww-api-request";
import { prisma } from "../../../../utils/prisma";
import { RedisManager } from "../../../../utils/redis";
import { sendResponse } from "../../../../utils/sendResponse";
import { parseDateInTimezone, parseDateTimeInTimezone } from "../../../../utils/timezone";
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

        const quoteSnapshots = await prisma.quoteSnapshot.findMany({
          where: {
            timestamp: {
              gte: selectedDateTime,
              lte: new Date(selectedDateTime.getTime() + 60000), // Add 1 minute
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
      const { start_datetime, end_datetime, timezone = "Asia/Kolkata", ...rest } = validationResult;

      // Convert datetime strings to IST format for Groww API
      const startTimeIST = dayjs(parseDateTimeInTimezone(start_datetime, timezone))
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DDTHH:mm:ss");
      const endTimeIST = dayjs(parseDateTimeInTimezone(end_datetime, timezone))
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DDTHH:mm:ss");

      const response = await growwAPIRequest<
        z.infer<typeof v1_developer_groww_schemas.growwHistoricalCandlesSchema>
      >({
        method: "get",
        url: `https://api.groww.in/v1/historical/candles`,
        params: {
          candle_interval: rest.interval,
          start_time: startTimeIST,
          end_time: endTimeIST,
          exchange: "NSE",
          segment: "CASH",
          groww_symbol: `NSE-${rest.symbol}`,
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
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_developer_groww_schemas.getGrowwQuoteTimeline.query,
      "query"
    ) as z.infer<typeof v1_developer_groww_schemas.getGrowwQuoteTimeline.query> | false;
    if (!validationResult) {
      return;
    }

    try {
      const { symbol, date: dateParam, timezone = "Asia/Kolkata" } = validationResult;

      // Convert date string to UTC Date representing midnight IST of that date
      const dateUTC = parseDateInTimezone(dateParam, timezone);

      // Get the date in IST timezone and set market hours (9:15 AM - 3:30 PM IST)
      // Extract just the date part (YYYY-MM-DD) and create new dayjs object in IST
      const dateStr = dayjs(dateUTC).format("YYYY-MM-DD");
      const marketStart = dayjs.tz(`${dateStr} 09:14:00`, "Asia/Kolkata");
      const marketEnd = dayjs.tz(`${dateStr} 15:31:00`, "Asia/Kolkata");
      const marketStartUtc = marketStart.utc();
      const marketEndUtc = marketEnd.utc();

      // Fetch quote snapshots from database for the symbol and date range
      const quoteSnapshots = await prisma.quoteSnapshot.findMany({
        where: {
          timestamp: {
            gte: marketStartUtc.toDate(),
            lte: marketEndUtc.toDate(),
          },
          nseSymbol: symbol,
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
            timestamp: `${snapshot.timestamp.toISOString()}`,
            nseSymbol: snapshot.nseSymbol,
            quoteData: snapshot.quoteData as unknown as z.infer<typeof growwQuoteSchema>,
            createdAt: `${snapshot.createdAt.toISOString()}`,
            updatedAt: `${snapshot.updatedAt.toISOString()}`,
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
};

export default growwRoutes;
