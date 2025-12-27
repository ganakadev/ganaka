import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { prisma } from "../../../../utils/prisma";
import { sendResponse } from "../../../../utils/sendResponse";
import { validateRequest } from "../../../../utils/validator";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import { QuoteData } from "@ganaka/db";

dayjs.extend(utc);
dayjs.extend(timezone);

const quoteSnapshotsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_dashboard_schemas.v1_dashboard_quote_timeline_schemas.getQuoteTimeline.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    try {
      const { symbol, date: dateParam } = validationResult;

      // Parse the selected date (it comes in as UTC ISO string)
      const selectedDate = dayjs(dateParam);
      if (!selectedDate.isValid()) {
        return reply.badRequest("Invalid date format");
      }

      // Get the date in IST timezone and set market hours (9:15 AM - 3:30 PM IST)
      // Extract just the date part (YYYY-MM-DD) and create new dayjs object in IST
      const dateStr = selectedDate.format("YYYY-MM-DD");
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
        z.infer<
          typeof v1_dashboard_schemas.v1_dashboard_quote_timeline_schemas.getQuoteTimeline.response
        >
      >({
        statusCode: 200,
        message: "Quote snapshots fetched successfully",
        data: {
          quoteTimeline: quoteSnapshots
            ? quoteSnapshots.map((snapshot) => {
                const data: z.infer<
                  typeof v1_dashboard_schemas.v1_dashboard_quote_timeline_schemas.getQuoteTimeline.response
                >["data"]["quoteTimeline"][0] = {
                  id: snapshot.id,
                  timestamp: snapshot.timestamp,
                  nseSymbol: snapshot.nseSymbol,
                  quoteData: snapshot.quoteData as unknown as QuoteData,
                  createdAt: snapshot.createdAt,
                  updatedAt: snapshot.updatedAt,
                };
                return data;
              })
            : [],
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching quote snapshots: %s", JSON.stringify(error));

      let errorMessage = "Failed to fetch quote snapshots";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return reply.internalServerError(errorMessage);
    }
  });
};

export default quoteSnapshotsRoutes;
