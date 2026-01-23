import { ShortlistSnapshot } from "@ganaka/db";
import { ShortlistType, ShortlistScope } from "@ganaka/db/prisma";
import { v1_developer_shortlist_persistence_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { prisma } from "../../../../../utils/prisma";
import { sendResponse } from "../../../../../utils/sendResponse";
import { validateRequest } from "../../../../../utils/validator";
import { parseDateTimeInTimezone } from "../../../../../utils/timezone";
import { formatDateTime } from "../../../../../utils/date-formatter";
import { validateCurrentTimestamp } from "../../../../../utils/current-timestamp-validator";
import { shortlistEntrySchema } from "@ganaka/schemas";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Maps API type format to database enum format
 */
function mapTypeToShortlistType(
  type: z.infer<
    typeof v1_developer_shortlist_persistence_schemas.getShortlistPersistence.query
  >["type"]
): ShortlistType {
  switch (type) {
    case "top-gainers":
      return ShortlistType.TOP_GAINERS;
    case "volume-shockers":
      return ShortlistType.VOLUME_SHOCKERS;
    default:
      throw new Error(`Unknown shortlist type: ${type}`);
  }
}

/**
 * Finds all instruments that appeared in any snapshot between start and end datetime,
 * ordered by total number of appearances (descending)
 */
function findPersistentInstruments(
  snapshots: Array<ShortlistSnapshot>,
  totalSnapshots: number
): Array<{
  nseSymbol: string;
  name: string;
  appearanceCount: number;
  totalSnapshots: number;
  percentage: number;
}> {
  if (totalSnapshots === 0) {
    return [];
  }

  // Filter to only non-empty snapshots
  const nonEmptySnapshots = snapshots.filter((snapshot) => {
    const entries = snapshot.entries as z.infer<typeof shortlistEntrySchema>[] | null;
    return entries && entries.length > 0;
  });

  // Track which symbols appear in each snapshot
  const symbolAppearances = new Map<string, number>();
  const symbolToNameMap = new Map<string, string>();

  for (let i = 0; i < nonEmptySnapshots.length; i++) {
    const snapshot = nonEmptySnapshots[i];
    const entries = snapshot.entries as z.infer<typeof shortlistEntrySchema>[] | null;

    if (!entries || entries.length === 0) {
      continue;
    }

    const seenInThisSnapshot = new Set<string>();
    for (const entry of entries) {
      // Only count each symbol once per snapshot
      if (!seenInThisSnapshot.has(entry.nseSymbol)) {
        symbolAppearances.set(entry.nseSymbol, (symbolAppearances.get(entry.nseSymbol) || 0) + 1);
        seenInThisSnapshot.add(entry.nseSymbol);
      }
      // Store name from first occurrence
      if (!symbolToNameMap.has(entry.nseSymbol)) {
        symbolToNameMap.set(entry.nseSymbol, entry.name);
      }
    }
  }

  // Filter to only symbols that appear in ALL non-empty snapshots
  const persistentInstruments: Array<{
    nseSymbol: string;
    name: string;
    appearanceCount: number;
    totalSnapshots: number;
    percentage: number;
  }> = [];

  for (const [symbol, appearanceCount] of symbolAppearances.entries()) {
    // Only include if present in all snapshots
    const percentage = (appearanceCount / totalSnapshots) * 100;
    persistentInstruments.push({
      nseSymbol: symbol,
      name: symbolToNameMap.get(symbol) || symbol,
      appearanceCount,
      totalSnapshots,
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
    });
  }

  // Sort by appearanceCount descending (most appearances first)
  persistentInstruments.sort((a, b) => b.appearanceCount - a.appearanceCount);

  return persistentInstruments;
}

const shortlistPersistenceRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_developer_shortlist_persistence_schemas.getShortlistPersistence.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    try {
      const shortlistType = mapTypeToShortlistType(validationResult.type);
      const timezone = validationResult.timezone || "Asia/Kolkata";
      const scope = (validationResult.scope ?? "TOP_5") as ShortlistScope;

      // Parse datetime strings to UTC Date objects
      const startDateTime = parseDateTimeInTimezone(validationResult.start_datetime, timezone);
      const endDateTime = parseDateTimeInTimezone(validationResult.end_datetime, timezone);

      // Validate that start_datetime <= end_datetime
      if (startDateTime > endDateTime) {
        return reply.badRequest("start_datetime must be less than or equal to end_datetime");
      }

      // Validate against currentTimestamp if present
      if (request.currentTimestamp) {
        try {
          validateCurrentTimestamp(request.currentTimestamp, [startDateTime, endDateTime], reply);
        } catch (error) {
          // Error already sent via reply in validator
          return;
        }
      }

      // Fetch all snapshots for the requested list type in the time range
      const snapshots = await prisma.shortlistSnapshot.findMany({
        where: {
          timestamp: {
            gte: startDateTime,
            lte: endDateTime,
          },
          shortlistType: shortlistType,
          scope: scope,
        },
        orderBy: {
          timestamp: "asc",
        },
      });

      // Count non-empty snapshots (empty snapshots don't count towards persistence)
      const nonEmptySnapshots = snapshots.filter((snapshot) => {
        const entries = snapshot.entries as z.infer<typeof shortlistEntrySchema>[] | null;
        return entries && entries.length > 0;
      });
      const totalNonEmptySnapshots = nonEmptySnapshots.length;

      // Find all instruments that appeared in any snapshot, ordered by appearance count
      const instruments = findPersistentInstruments(snapshots, totalNonEmptySnapshots);

      return sendResponse<
        z.infer<typeof v1_developer_shortlist_persistence_schemas.getShortlistPersistence.response>
      >(reply, {
        statusCode: 200,
        message: "Shortlist persistence fetched successfully",
        data: {
          start_datetime: formatDateTime(startDateTime),
          end_datetime: formatDateTime(endDateTime),
          type: validationResult.type,
          totalSnapshots: totalNonEmptySnapshots,
          instruments,
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching shortlist persistence: %s", JSON.stringify(error));
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch shortlist persistence";
      return reply.internalServerError(errorMessage);
    }
  });
};

export default shortlistPersistenceRoutes;
