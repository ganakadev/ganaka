import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  ShortlistEntry,
  DailyUniqueCompaniesResponse,
  ShortlistSnapshot,
} from "@/types";
import {
  dailyPersistentCompaniesQuerySchema,
  formatZodError,
} from "@/lib/validation";
import { prisma } from "@ganaka-algos/db";

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

    // Count unique companies across all snapshots
    const uniqueCount = countUniqueCompanies(snapshots);

    const response: DailyUniqueCompaniesResponse = {
      date: parsedDate.format("YYYY-MM-DD"),
      type: shortlistType,
      uniqueCount,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching daily unique companies:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch daily unique companies";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

