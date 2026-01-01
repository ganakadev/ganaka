import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { prisma } from "../../../../utils/prisma";
import { sendResponse } from "../../../../utils/sendResponse";
import { validateRequest } from "../../../../utils/validator";
import { growwQuoteSchema, v1_dashboard_schemas } from "@ganaka/schemas";
import { parseDateInTimezone } from "../../../../utils/timezone";
import { formatDateTime } from "../../../../utils/date-formatter";

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
      const { symbol, date } = validationResult;

      // Get the date in IST timezone and set market hours (9:15 AM - 3:30 PM IST)
      // Extract just the date part (YYYY-MM-DD) and create new dayjs object in IST
      const marketStart = dayjs.tz(`${date} 09:14:00`, "Asia/Kolkata");
      const marketEnd = dayjs.tz(`${date} 15:31:00`, "Asia/Kolkata");
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
      >(reply, {
        statusCode: 200,
        message: "Quote snapshots fetched successfully",
        data: {
          quoteTimeline: quoteSnapshots
            ? quoteSnapshots.map((snapshot) => {
                const data: z.infer<
                  typeof v1_dashboard_schemas.v1_dashboard_quote_timeline_schemas.getQuoteTimeline.response
                >["data"]["quoteTimeline"][0] = {
                  id: snapshot.id,
                  timestamp: formatDateTime(snapshot.timestamp),
                  nseSymbol: snapshot.nseSymbol,
                  quoteData: snapshot.quoteData as unknown as z.infer<typeof growwQuoteSchema>,
                  createdAt: formatDateTime(snapshot.createdAt),
                  updatedAt: formatDateTime(snapshot.updatedAt),
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
