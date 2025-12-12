import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ShortlistType } from "@prisma/client";
import { GroupedShortlist, ShortlistSnapshotData } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get("date");
    const typeParam = searchParams.get("type");

    // Get the latest date if no date is provided
    let targetDate: Date | null = null;
    let latestDate: string | null = null;

    if (dateParam) {
      targetDate = new Date(dateParam);
      targetDate.setHours(0, 0, 0, 0);
    } else {
      // Get the latest date from the database
      const latestSnapshot = await prisma.shortlistSnapshot.findFirst({
        orderBy: { timestamp: "desc" },
        select: { timestamp: true },
      });

      if (latestSnapshot) {
        targetDate = new Date(latestSnapshot.timestamp);
        targetDate.setHours(0, 0, 0, 0);
        latestDate = targetDate.toISOString().split("T")[0];
      }
    }

    if (!targetDate) {
      return NextResponse.json({
        groupedShortlists: [],
        latestDate: null,
      });
    }

    // Calculate date range (start and end of the day)
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Build where clause
    const where: any = {
      timestamp: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    if (
      typeParam &&
      (typeParam === "TOP_GAINERS" || typeParam === "VOLUME_SHOCKERS")
    ) {
      where.shortlistType = typeParam as ShortlistType;
    }

    // Fetch shortlists
    const shortlists = await prisma.shortlistSnapshot.findMany({
      where,
      orderBy: { timestamp: "asc" },
    });

    // Group by date and time
    const groupedMap = new Map<string, Map<string, ShortlistSnapshotData[]>>();

    shortlists.forEach((snapshot) => {
      const dateKey = snapshot.timestamp.toISOString().split("T")[0];
      const timeKey = snapshot.timestamp.toISOString();

      if (!groupedMap.has(dateKey)) {
        groupedMap.set(dateKey, new Map());
      }

      const dateMap = groupedMap.get(dateKey)!;
      if (!dateMap.has(timeKey)) {
        dateMap.set(timeKey, []);
      }

      dateMap.get(timeKey)!.push({
        id: snapshot.id,
        timestamp: snapshot.timestamp,
        shortlistType: snapshot.shortlistType,
        entries: snapshot.entries as any,
        createdAt: snapshot.createdAt,
      });
    });

    // Convert to response format
    const groupedShortlists: GroupedShortlist[] = Array.from(
      groupedMap.entries()
    ).map(([date, timestampsMap]) => ({
      date,
      timestamps: Array.from(timestampsMap.entries()).map(
        ([timestamp, shortlists]) => ({
          timestamp: new Date(timestamp),
          shortlists,
        })
      ),
    }));

    // Sort timestamps within each date
    groupedShortlists.forEach((group) => {
      group.timestamps.sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
      );
    });

    return NextResponse.json({
      groupedShortlists,
      latestDate: latestDate || targetDate.toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Error fetching shortlists:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch shortlists";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
