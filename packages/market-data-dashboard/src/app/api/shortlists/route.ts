import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ShortlistType } from "@prisma/client";
import { ShortlistEntry, ShortlistSnapshot } from "@/types";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get("date");
    const typeParam = searchParams.get("type");
    const selectedDateTime = dayjs(dateParam);

    const shortlists = await prisma.shortlistSnapshot.findMany({
      where: {
        timestamp: {
          gte: selectedDateTime.toDate(),
          lte: selectedDateTime.add(1, "s").toDate(),
        },
        shortlistType: typeParam as ShortlistType,
      },
    });
    const quoteSnapshots = await prisma.quoteSnapshot.findMany({
      where: {
        timestamp: {
          gte: selectedDateTime.toDate(),
          lte: selectedDateTime.add(1, "s").toDate(),
        },
      },
    });

    if (shortlists.length === 0) {
      return NextResponse.json({
        shortlist: null,
      });
    }

    let shortlist = shortlists[0];
    const shortlistEntries = shortlist.entries as ShortlistEntry[] | null;

    if (shortlistEntries) {
      shortlist = {
        ...shortlist,
        entries: shortlistEntries.map((entry) => {
          const quoteSnapshot = quoteSnapshots.find(
            (quoteSnapshot) => quoteSnapshot.nseSymbol === entry.nseSymbol
          );
          return {
            ...entry,
            quoteData: quoteSnapshot?.quoteData,
          };
        }),
      };
    }

    return NextResponse.json({
      shortlist,
    });
  } catch (error) {
    console.error("Error fetching shortlists:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch shortlists";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
