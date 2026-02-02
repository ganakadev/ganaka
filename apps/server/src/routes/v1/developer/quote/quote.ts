import { growwQuoteSchema, v1_developer_quote_schemas } from "@ganaka/schemas";
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
import { prisma } from "../../../../utils/prisma";
import { RedisManager } from "../../../../utils/redis";

dayjs.extend(utc);
dayjs.extend(timezone);

const quoteRoutes: FastifyPluginAsync = async (fastify) => {
  const redisManager = RedisManager.getInstance(fastify);
  const tokenManager = new TokenManager(redisManager.redis, fastify);
  const growwAPIRequest = makeGrowwAPIRequest(fastify, tokenManager);

  // ==================== GET /v1/developer/quote ====================
  fastify.get("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_developer_quote_schemas.getGrowwQuote.query,
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
          return sendResponse<z.infer<typeof v1_developer_quote_schemas.getGrowwQuote.response>>(
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
          return sendResponse<z.infer<typeof v1_developer_quote_schemas.getGrowwQuote.response>>(
            reply,
            {
              statusCode: 200,
              message: "Quote snapshot not found",
              data: null as any,
            }
          );
        }

        return sendResponse<z.infer<typeof v1_developer_quote_schemas.getGrowwQuote.response>>(
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
      const developerCredentials = request.developer
        ? {
            developerId: request.developer.id,
            growwApiKey: request.developer.growwApiKey,
            growwApiSecret: request.developer.growwApiSecret,
          }
        : undefined;

      const response = await growwAPIRequest<z.infer<typeof growwQuoteSchema>>({
        method: "get",
        url: `https://api.groww.in/v1/live-data/quote`,
        params: {
          exchange: "NSE",
          segment: "CASH",
          trading_symbol: validationResult.symbol,
        },
        developerCredentials,
      });

      return sendResponse<z.infer<typeof v1_developer_quote_schemas.getGrowwQuote.response>>(
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
};

export default quoteRoutes;
