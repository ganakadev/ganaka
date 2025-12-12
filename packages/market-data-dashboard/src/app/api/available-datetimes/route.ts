import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AvailableDatetimesResponse } from "@/types";

export async function GET() {
  try {
    // Get all unique timestamps from ShortlistSnapshot
    const snapshots = await prisma.shortlistSnapshot.findMany({
      select: {
        timestamp: true,
      },
      distinct: ["timestamp"],
      orderBy: {
        timestamp: "asc",
      },
    });

    // Group timestamps by date
    const dateMap = new Map<string, string[]>();

    snapshots.forEach((snapshot) => {
      const dateKey = snapshot.timestamp.toISOString().split("T")[0];
      const timestampISO = snapshot.timestamp.toISOString();

      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }

      dateMap.get(dateKey)!.push(timestampISO);
    });

    // Convert to response format
    const dates = Array.from(dateMap.entries()).map(([date, timestamps]) => ({
      date,
      timestamps,
    }));

    return NextResponse.json<AvailableDatetimesResponse>({
      dates,
    });
  } catch (error) {
    console.error("Error fetching available datetimes:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch available datetimes";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
