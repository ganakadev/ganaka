import { FastifyPluginAsync } from "fastify";
import { validateRequest } from "../../../../utils/validator";
import { v1_admin_schemas } from "@ganaka/schemas";
import { sendResponse } from "../../../../utils/sendResponse";
import { prisma } from "../../../../utils/prisma";
import z from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { formatDate } from "../../../../utils/date-formatter";

dayjs.extend(utc);
dayjs.extend(timezone);

const dataRoutes: FastifyPluginAsync = async (fastify) => {
  // ==================== GET /data/available-dates ====================

  fastify.get("/available-dates", async (request, reply) => {
    try {
      // Get all unique dates from ShortlistSnapshot
      const shortlistSnapshots = await prisma.shortlistSnapshot.findMany({
        select: {
          timestamp: true,
        },
        distinct: ["timestamp"],
        orderBy: {
          timestamp: "asc",
        },
      });

      // Group by date and count records
      const dateMap = new Map<
        string,
        { shortlistCount: number; quoteCount: number; niftyCount: number }
      >();

      // Process shortlists
      shortlistSnapshots.forEach((snapshot) => {
        const dateKey = formatDate(snapshot.timestamp);
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, {
            shortlistCount: 0,
            quoteCount: 0,
            niftyCount: 0,
          });
        }
        const dateData = dateMap.get(dateKey)!;
        dateData.shortlistCount += 1;
      });

      // Get quote counts for each date
      const quoteSnapshots = await prisma.quoteSnapshot.findMany({
        select: {
          timestamp: true,
        },
        distinct: ["timestamp"],
      });

      quoteSnapshots.forEach((snapshot) => {
        const dateKey = formatDate(snapshot.timestamp);
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, {
            shortlistCount: 0,
            quoteCount: 0,
            niftyCount: 0,
          });
        }
        const dateData = dateMap.get(dateKey)!;
        dateData.quoteCount += 1;
      });

      // Get nifty quote counts for each date
      const niftyQuotes = await prisma.niftyQuote.findMany({
        select: {
          timestamp: true,
        },
        distinct: ["timestamp"],
      });

      niftyQuotes.forEach((quote) => {
        const dateKey = formatDate(quote.timestamp);
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, {
            shortlistCount: 0,
            quoteCount: 0,
            niftyCount: 0,
          });
        }
        const dateData = dateMap.get(dateKey)!;
        dateData.niftyCount += 1;
      });

      // Convert to response format
      const dates = Array.from(dateMap.entries())
        .map(([date, counts]) => ({
          date,
          shortlistCount: counts.shortlistCount,
          quoteCount: counts.quoteCount,
          niftyCount: counts.niftyCount,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return sendResponse<
        z.infer<typeof v1_admin_schemas.v1_admin_data_schemas.getAvailableDates.response>
      >(reply, {
        statusCode: 200,
        message: "Available dates fetched successfully",
        data: {
          dates,
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching available dates: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to fetch available dates. Please check server logs for more details."
      );
    }
  });

  // ==================== DELETE /data/dates ====================

  fastify.delete("/dates", async (request, reply) => {
    const validationResult = validateRequest(
      request.body,
      reply,
      v1_admin_schemas.v1_admin_data_schemas.deleteDates.body,
      "body"
    );
    if (!validationResult) {
      return;
    }

    try {
      // Parse dates and convert to Date objects (start and end of day in UTC)
      const dateRanges = validationResult.dates.map((dateStr) => {
        const startOfDay = dayjs.utc(dateStr).startOf("day").toDate();
        const endOfDay = dayjs.utc(dateStr).endOf("day").toDate();
        return { startOfDay, endOfDay };
      });

      // Use transaction to ensure atomicity
      const result = await prisma.$transaction(async (tx) => {
        let shortlistCount = 0;
        let quoteCount = 0;
        let niftyCount = 0;

        // Delete shortlists
        for (const range of dateRanges) {
          const deleted = await tx.shortlistSnapshot.deleteMany({
            where: {
              timestamp: {
                gte: range.startOfDay,
                lte: range.endOfDay,
              },
            },
          });
          shortlistCount += deleted.count;
        }

        // Delete quotes
        for (const range of dateRanges) {
          const deleted = await tx.quoteSnapshot.deleteMany({
            where: {
              timestamp: {
                gte: range.startOfDay,
                lte: range.endOfDay,
              },
            },
          });
          quoteCount += deleted.count;
        }

        // Delete nifty quotes
        for (const range of dateRanges) {
          const deleted = await tx.niftyQuote.deleteMany({
            where: {
              timestamp: {
                gte: range.startOfDay,
                lte: range.endOfDay,
              },
            },
          });
          niftyCount += deleted.count;
        }

        return {
          shortlists: shortlistCount,
          quotes: quoteCount,
          niftyQuotes: niftyCount,
        };
      });

      return sendResponse<
        z.infer<typeof v1_admin_schemas.v1_admin_data_schemas.deleteDates.response>
      >(reply, {
        statusCode: 200,
        message: "Data deleted successfully",
        data: {
          deleted: result,
        },
      });
    } catch (error) {
      fastify.log.error("Error deleting data: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to delete data. Please check server logs for more details."
      );
    }
  });
};

export default dataRoutes;
