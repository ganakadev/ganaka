import {
  growwQuoteSchema,
  v1_developer_collector_schemas,
  v1_developer_nifty_schemas,
} from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { validateCurrentTimestamp } from "../../../utils/current-timestamp-validator";
import { prisma } from "../../../utils/prisma";
import { sendResponse } from "../../../utils/sendResponse";
import { parseDateTimeInTimezone } from "../../../utils/timezone";
import { validateRequest } from "../../../utils/validator";
import { Decimal } from "@ganaka/db/prisma";
import { formatDateTime } from "../../../utils/date-formatter";

dayjs.extend(utc);
dayjs.extend(timezone);

const niftyRoutes: FastifyPluginAsync = async (fastify) => {
  // ==================== GET /v1/nifty ====================
  fastify.get("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_developer_nifty_schemas.getGrowwNiftyQuote.query,
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
            z.infer<typeof v1_developer_nifty_schemas.getGrowwNiftyQuote.response>
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
            z.infer<typeof v1_developer_nifty_schemas.getGrowwNiftyQuote.response>
          >(reply, {
            statusCode: 200,
            message: "NIFTY quote snapshot not found",
            data: null as any,
          });
        }

        return sendResponse<z.infer<typeof v1_developer_nifty_schemas.getGrowwNiftyQuote.response>>(
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
  // ==================== POST /v1/nifty ====================
  fastify.post("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.body,
      reply,
      v1_developer_collector_schemas.createNiftyQuote.body,
      "body"
    );
    if (!validationResult) {
      return;
    }

    try {
      // Convert datetime string to UTC Date
      const timestamp = parseDateTimeInTimezone(
        validationResult.data.timestamp,
        validationResult.data.timezone
      );

      // Store NIFTY quote in database
      const niftyQuote = await prisma.niftyQuote.create({
        data: {
          timestamp,
          quoteData: validationResult.data.quoteData as any, // JSON data
          dayChangePerc: new Decimal(validationResult.data.dayChangePerc),
        },
      });

      return sendResponse(reply, {
        statusCode: 201,
        message: "NIFTY quote created successfully",
        data: {
          id: niftyQuote.id,
          timestamp: formatDateTime(niftyQuote.timestamp),
          dayChangePerc: Number(niftyQuote.dayChangePerc),
        },
      });
    } catch (error) {
      fastify.log.error("Error creating NIFTY quote: %s", JSON.stringify(error));
      const errorMessage = error instanceof Error ? error.message : "Failed to create NIFTY quote";
      return reply.internalServerError(errorMessage);
    }
  });
};

export default niftyRoutes;
