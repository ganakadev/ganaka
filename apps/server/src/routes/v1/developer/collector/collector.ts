import { ShortlistType, ShortlistScope } from "@ganaka/db";
import { v1_developer_collector_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import { prisma } from "../../../../utils/prisma";
import { sendResponse } from "../../../../utils/sendResponse";
import { parseDateTimeInTimezone } from "../../../../utils/timezone";
import { validateRequest } from "../../../../utils/validator";
import { Decimal } from "@ganaka/db/prisma";
import { formatDateTime, formatDate } from "../../../../utils/date-formatter";

dayjs.extend(utc);
dayjs.extend(timezone);

const collectorRoutes: FastifyPluginAsync = async (fastify) => {
  // ==================== GET /check-holiday ====================
  fastify.get("/check-holiday", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_developer_collector_schemas.checkHoliday.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    try {
      // Parse the date from query parameter and convert to UTC Date range
      const dateStr = validationResult.date;
      const dateStart = dayjs.utc(dateStr).startOf("day").toDate();
      const dateEnd = dayjs.utc(dateStr).endOf("day").toDate();

      // Check if the provided date is a holiday
      const holiday = await prisma.nseHoliday.findFirst({
        where: {
          date: {
            gte: dateStart,
            lte: dateEnd,
          },
        },
      });

      return sendResponse(reply, {
        statusCode: 200,
        message: "Holiday check completed",
        data: {
          isHoliday: !!holiday,
          date: dateStr,
        },
      });
    } catch (error) {
      fastify.log.error("Error checking holiday: %s", JSON.stringify(error));
      const errorMessage = error instanceof Error ? error.message : "Failed to check holiday";
      return reply.internalServerError(errorMessage);
    }
  });
  // ==================== POST /shortlists ====================
  fastify.post("/shortlists", async (request, reply) => {
    const validationResult = validateRequest(
      request.body,
      reply,
      v1_developer_collector_schemas.createShortlistSnapshot.body,
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

      // Store shortlist in database
      const shortlistSnapshot = await prisma.shortlistSnapshot.create({
        data: {
          timestamp,
          shortlistType: validationResult.data.shortlistType as ShortlistType,
          entries: validationResult.data.entries as any, // JSON data
          scope: (validationResult.data.scope ?? "TOP_5") as ShortlistScope,
        },
      });

      return sendResponse(reply, {
        statusCode: 201,
        message: "Shortlist snapshot created successfully",
        data: {
          id: shortlistSnapshot.id,
          timestamp: formatDateTime(shortlistSnapshot.timestamp),
          shortlistType: shortlistSnapshot.shortlistType,
          entriesCount: validationResult.data.entries.length,
        },
      });
    } catch (error) {
      fastify.log.error("Error creating shortlist snapshot: %s", JSON.stringify(error));
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create shortlist snapshot";
      return reply.internalServerError(errorMessage);
    }
  });

  // ==================== POST /quotes ====================
  fastify.post("/quotes", async (request, reply) => {
    const validationResult = validateRequest(
      request.body,
      reply,
      v1_developer_collector_schemas.createQuoteSnapshots.body,
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

      // Prepare quote snapshot data array
      const quoteData = validationResult.data.quotes.map((quote) => ({
        timestamp,
        nseSymbol: quote.nseSymbol,
        quoteData: quote.quoteData as any, // JSON data
      }));

      // Store quote snapshots in database
      const createdQuotes = await prisma.quoteSnapshot.createMany({
        data: quoteData,
      });

      return sendResponse(reply, {
        statusCode: 201,
        message: "Quote snapshots created successfully",
        data: {
          count: createdQuotes.count,
          timestamp: formatDateTime(timestamp),
        },
      });
    } catch (error) {
      fastify.log.error("Error creating quote snapshots: %s", JSON.stringify(error));
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create quote snapshots";
      return reply.internalServerError(errorMessage);
    }
  });

  // ==================== POST /nifty ====================
  fastify.post("/nifty", async (request, reply) => {
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

export default collectorRoutes;
