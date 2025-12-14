import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ShortlistType } from "@prisma/client";
import { ShortlistEntry, DailyPersistentCompaniesResponse } from "@/types";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Finds companies that appeared in ALL snapshots for a given list type on a given date
 */
function findPersistentCompanies(
  snapshots: Array<{ entries: unknown }>
): Array<{ nseSymbol: string; name: string }> {
  if (snapshots.length === 0) {
    return [];
  }

  // Extract nseSymbol sets from each snapshot
  const symbolSets: Set<string>[] = [];
  const symbolToNameMap = new Map<string, string>();

  for (const snapshot of snapshots) {
    const entries = snapshot.entries as ShortlistEntry[] | null;
    if (!entries || entries.length === 0) {
      // If any snapshot is empty, no company can be in all snapshots
      return [];
    }

    const symbolSet = new Set<string>();
    for (const entry of entries) {
      symbolSet.add(entry.nseSymbol);
      // Store name from first occurrence
      if (!symbolToNameMap.has(entry.nseSymbol)) {
        symbolToNameMap.set(entry.nseSymbol, entry.name);
      }
    }
    symbolSets.push(symbolSet);
  }

  // Find intersection: companies that appear in ALL snapshots
  if (symbolSets.length === 0) {
    return [];
  }

  // Start with the first set
  const intersection = new Set(symbolSets[0]);

  // Intersect with all other sets
  for (let i = 1; i < symbolSets.length; i++) {
    const currentSet = symbolSets[i];
    for (const symbol of intersection) {
      if (!currentSet.has(symbol)) {
        intersection.delete(symbol);
      }
    }
  }

  // Convert to array with names
  return Array.from(intersection).map((nseSymbol) => ({
    nseSymbol,
    name: symbolToNameMap.get(nseSymbol) || nseSymbol,
  }));
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get("date");
    const typeParam = searchParams.get("type");

    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    if (!typeParam) {
      return NextResponse.json(
        {
          error: "Type parameter is required (TOP_GAINERS or VOLUME_SHOCKERS)",
        },
        { status: 400 }
      );
    }

    // Validate the type parameter
    const shortlistType = typeParam as ShortlistType;
    if (
      shortlistType !== ShortlistType.TOP_GAINERS &&
      shortlistType !== ShortlistType.VOLUME_SHOCKERS
    ) {
      return NextResponse.json(
        { error: "Invalid type. Must be TOP_GAINERS or VOLUME_SHOCKERS" },
        { status: 400 }
      );
    }

    // Parse the date (expecting format like "2024-01-15" or ISO string)
    const parsedDate = dayjs(dateParam);
    if (!parsedDate.isValid()) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Calculate start and end of day (in UTC to match database timestamps)
    const startOfDay = parsedDate.startOf("day").toDate();
    const endOfDay = parsedDate.endOf("day").toDate();

    // Fetch all snapshots for the requested list type for the entire day
    const snapshots = await prisma.shortlistSnapshot.findMany({
      where: {
        timestamp: {
          gte: startOfDay,
          lte: endOfDay,
        },
        shortlistType: shortlistType,
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    // Find companies that appeared in ALL snapshots
    const companies = findPersistentCompanies(snapshots);

    const response: DailyPersistentCompaniesResponse = {
      date: parsedDate.format("YYYY-MM-DD"),
      type: shortlistType,
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
