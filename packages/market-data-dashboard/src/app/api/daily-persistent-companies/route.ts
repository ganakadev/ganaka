import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { prisma } from "@ganaka-algos/db";
import timezone from "dayjs/plugin/timezone";
import {
  ShortlistEntry,
  DailyPersistentCompaniesResponse,
  ShortlistSnapshot,
} from "@/types";
import {
  dailyPersistentCompaniesQuerySchema,
  formatZodError,
} from "@/lib/validation";

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
    const entries = snapshot.entries as ShortlistEntry[] | null;
    if (!entries || entries.length === 0) {
      // Skip empty snapshots - they just reduce the total count
      continue;
    }

    const seenInThisSnapshot = new Set<string>();
    for (const entry of entries) {
      // Only count each symbol once per snapshot
      if (!seenInThisSnapshot.has(entry.nseSymbol)) {
        symbolCounts.set(
          entry.nseSymbol,
          (symbolCounts.get(entry.nseSymbol) || 0) + 1
        );
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build query object from search params
    const queryParams = {
      date: searchParams.get("date") || undefined,
      type: searchParams.get("type") || undefined,
    };

    // Validate query parameters using Zod
    const validationResult =
      dailyPersistentCompaniesQuerySchema.safeParse(queryParams);

    if (!validationResult.success) {
      const errorResponse = formatZodError(validationResult.error);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { date: dateParam, type: shortlistType } = validationResult.data;

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

    // Find companies that appeared in at least 80% of snapshots
    const companies = findPersistentCompanies(snapshots, snapshots.length);

    const response: DailyPersistentCompaniesResponse = {
      date: parsedDate.format("YYYY-MM-DD"),
      type: shortlistType,
      totalSnapshots: snapshots.length,
      companies,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching daily persistent companies:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch daily persistent companies";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
