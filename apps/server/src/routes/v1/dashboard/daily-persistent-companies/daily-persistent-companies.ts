import { ShortlistSnapshot } from "@ganaka/db";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { prisma } from "../../../../utils/prisma";
import { sendResponse } from "../../../../utils/sendResponse";
import { validateRequest } from "../../../../utils/validator";
import { parseDateInTimezone } from "../../../../utils/timezone";
import { shortlistEntrySchema } from "@ganaka/schemas";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Finds companies that appeared in at least 80% of snapshots for a given list type on a given date
 */
function findPersistentCompanies(
  snapshots: Array<ShortlistSnapshot>,
  totalSnapshots: number
): Array<{
  nseSymbol: string;
  name: string;
  count: number;
  percentage: number;
}> {
  // Count occurrences of each symbol across all snapshots
  const symbolCounts = new Map<string, number>();
  const symbolToNameMap = new Map<string, string>();

  for (const snapshot of snapshots) {
    const entries = snapshot.entries as z.infer<typeof shortlistEntrySchema>[] | null;
    if (!entries || entries.length === 0) {
      // Skip empty snapshots - they just reduce the total count
      continue;
    }

    const seenInThisSnapshot = new Set<string>();
    for (const entry of entries) {
      // Only count each symbol once per snapshot
      if (!seenInThisSnapshot.has(entry.nseSymbol)) {
        symbolCounts.set(entry.nseSymbol, (symbolCounts.get(entry.nseSymbol) || 0) + 1);
        seenInThisSnapshot.add(entry.nseSymbol);
      }
      // Store name from first occurrence
      if (!symbolToNameMap.has(entry.nseSymbol)) {
        symbolToNameMap.set(entry.nseSymbol, entry.name);
      }
    }
  }

  // Count occurrences and filter by 80% threshold
  if (totalSnapshots === 0) {
    return [];
  }

  const threshold = Math.ceil(totalSnapshots * 0.8);
  const persistentCompanies: Array<{
    nseSymbol: string;
    name: string;
    count: number;
    percentage: number;
  }> = [];

  for (const [symbol, count] of symbolCounts.entries()) {
    if (count >= threshold) {
      const percentage = (count / totalSnapshots) * 100;
      persistentCompanies.push({
        nseSymbol: symbol,
        name: symbolToNameMap.get(symbol) || symbol,
        count,
        percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
      });
    }
  }

  return persistentCompanies;
}

const dailyPersistentCompaniesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_dashboard_schemas.v1_dashboard_daily_persistent_companies_schemas
        .getDailyPersistentCompanies.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    try {
      const { date: dateParam, timezone = "Asia/Kolkata", type: shortlistType } = validationResult;

      // Convert date string to UTC Date representing midnight IST of that date
      const dateUTC = parseDateInTimezone(dateParam, timezone);

      // Calculate start and end of day (in UTC to match database timestamps)
      const startOfDay = dayjs(dateUTC).utc().startOf("day");
      const endOfDay = dayjs(dateUTC).utc().endOf("day");

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

      // Find companies that appeared in at least 80% of snapshots
      const companies = findPersistentCompanies(snapshots, snapshots.length);

      return sendResponse<
        z.infer<
          typeof v1_dashboard_schemas.v1_dashboard_daily_persistent_companies_schemas.getDailyPersistentCompanies.response
        >
      >(reply, {
        statusCode: 200,
        message: "Daily persistent companies fetched successfully",
        data: {
          date: dayjs(dateUTC).format("YYYY-MM-DD"),
          type: shortlistType,
          totalSnapshots: snapshots.length,
          companies,
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching daily persistent companies: %s", JSON.stringify(error));
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch daily persistent companies";
      return reply.internalServerError(errorMessage);
    }
  });
};

export default dailyPersistentCompaniesRoutes;
