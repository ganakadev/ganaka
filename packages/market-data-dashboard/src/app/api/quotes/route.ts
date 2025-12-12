import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ShortlistType } from "@prisma/client";
import { QuoteSnapshotData } from "@/types";
import dayjs from "dayjs";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const nseSymbol = searchParams.get("nseSymbol");
    const timestampParam = searchParams.get("timestamp");
    const shortlistTypeParam = searchParams.get("shortlistType");

    if (!nseSymbol || !timestampParam || !shortlistTypeParam) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: nseSymbol, timestamp, shortlistType",
        },
        { status: 400 }
      );
    }

    const timestamp = new Date(timestampParam);
    const shortlistType = shortlistTypeParam as ShortlistType;

    // Find quote snapshot
    const quoteSnapshot = await prisma.quoteSnapshot.findFirst({
      where: {
        nseSymbol,
        timestamp: {
          gte: dayjs(timestamp).toDate(),
          lte: dayjs(timestamp).add(1, "s").toDate(),
        },
        shortlistType,
      },
    });

    if (!quoteSnapshot) {
      return NextResponse.json({ quote: null });
    }

    const quote: QuoteSnapshotData = {
      id: quoteSnapshot.id,
      timestamp: quoteSnapshot.timestamp,
      nseSymbol: quoteSnapshot.nseSymbol,
      shortlistType: quoteSnapshot.shortlistType,
      quoteData: quoteSnapshot.quoteData as any,
      buyerControlPercentage: quoteSnapshot.buyerControlPercentage
        ? Number(quoteSnapshot.buyerControlPercentage)
        : null,
      createdAt: quoteSnapshot.createdAt,
    };

    return NextResponse.json({ quote });
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 500 }
    );
  }
}
