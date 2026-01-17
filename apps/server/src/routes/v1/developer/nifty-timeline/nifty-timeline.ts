import { growwQuoteSchema, v1_developer_groww_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { validateCurrentTimestamp } from "../../../../utils/current-timestamp-validator";
import { formatDateTime } from "../../../../utils/date-formatter";
import { sendResponse } from "../../../../utils/sendResponse";
import { parseDateTimeInTimezone } from "../../../../utils/timezone";
import { TokenManager } from "../../../../utils/token-manager";
import { validateRequest } from "../../../../utils/validator";
import { prisma } from "../../../../utils/prisma";
import { RedisManager } from "../../../../utils/redis";

dayjs.extend(utc);
dayjs.extend(timezone);

const niftyTimelineRoutes: FastifyPluginAsync = async (fastify) => {
  const redisManager = RedisManager.getInstance(fastify);
  const tokenManager = new TokenManager(redisManager.redis, fastify);

  // NIFTY timeline endpoint
  fastify.get("/", async (request, reply) => {
    const validationResult = validateRequest<
      z.infer<typeof v1_developer_groww_schemas.getGrowwNiftyQuoteTimeline.query>
    >(request.query, reply, v1_developer_groww_schemas.getGrowwNiftyQuoteTimeline.query, "query");
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

      // Fetch NIFTY quotes from market start to end_datetime
      const niftyQuotes = await prisma.niftyQuote.findMany({
        where: {
          timestamp: {
            gte: marketStartUtc.toDate(),
            lt: endDateTimeUTC,
          },
        },
        orderBy: {
          timestamp: "asc",
        },
      });

      return sendResponse<
        z.infer<typeof v1_developer_groww_schemas.getGrowwNiftyQuoteTimeline.response>
      >(reply, {
        statusCode: 200,
        message: "NIFTY timeline fetched successfully",
        data: {
          niftyTimeline: niftyQuotes.map((quote) => ({
            id: quote.id,
            timestamp: formatDateTime(quote.timestamp),
            quoteData: quote.quoteData as unknown as z.infer<typeof growwQuoteSchema>,
            createdAt: formatDateTime(quote.createdAt),
            updatedAt: formatDateTime(quote.updatedAt),
          })),
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching NIFTY timeline: %s", JSON.stringify(error));

      let errorMessage = "Failed to fetch NIFTY timeline";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return reply.internalServerError(errorMessage);
    }
  });
};

export default niftyTimelineRoutes;