import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { prisma } from "../../../../utils/prisma";
import { sendResponse } from "../../../../utils/sendResponse";
import { validateRequest } from "../../../../utils/validator";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import { ShortlistEntry, ShortlistSnapshot, ShortlistType } from "@ganaka/db";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Counts unique companies across all snapshots for a given list type on a given date
 */
function countUniqueCompanies(snapshots: Array<ShortlistSnapshot>): number {
  const uniqueSymbols = new Set<string>();

  for (const snapshot of snapshots) {
    const entries = snapshot.entries as ShortlistEntry[] | null;
    if (!entries || entries.length === 0) {
      continue;
    }

    for (const entry of entries) {
      uniqueSymbols.add(entry.nseSymbol);
    }
  }

  return uniqueSymbols.size;
}

const dailyUniqueCompaniesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_dashboard_schemas.v1_dashboard_daily_unique_companies_schemas.getDailyUniqueCompanies
        .query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    try {
      const { date: dateParam, type: shortlistType } = validationResult;

      // Parse the date (expecting format like "2024-01-15" or ISO string)
      const parsedDate = dayjs(dateParam);

      // Calculate start and end of day (in UTC to match database timestamps)
      const startOfDay = parsedDate.utc().startOf("day");
      const endOfDay = parsedDate.utc().endOf("day");

      // Fetch all snapshots for the requested list type for the entire day
      const snapshots = await prisma.shortlistSnapshot.findMany({
        where: {
          timestamp: {
            gte: startOfDay.toDate(),
            lte: endOfDay.toDate(),
          },
          shortlistType: shortlistType,
        },
        orderBy: {
          timestamp: "asc",
        },
      });

      // Count unique companies across all snapshots
      const uniqueCount = countUniqueCompanies(snapshots);

      return sendResponse<
        z.infer<
          typeof v1_dashboard_schemas.v1_dashboard_daily_unique_companies_schemas.getDailyUniqueCompanies.response
        >
      >({
        statusCode: 200,
        message: "Daily unique companies fetched successfully",
        data: {
          date: parsedDate.format("YYYY-MM-DD"),
          type: shortlistType,
          uniqueCount,
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching daily unique companies: %s", JSON.stringify(error));
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch daily unique companies";
      return reply.internalServerError(errorMessage);
    }
  });
};

export default dailyUniqueCompaniesRoutes;
