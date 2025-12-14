import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ShortlistType } from "@prisma/client";
import { QuoteData, ShortlistEntry, ShortlistSnapshot } from "@/types";
import { JsonValue } from "@prisma/client/runtime/library";
import {
  calculateBuyerControlPercentage,
  isQuoteData,
  BuyerControlMethod,
  QuoteData as BuyerControlQuoteData,
} from "@/utils/buyerControl";
import { shortlistsQuerySchema, formatZodError } from "@/lib/validation";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build query object from search params
    const queryParams = {
      date: searchParams.get("date") || undefined,
      type: searchParams.get("type") || undefined,
      method: searchParams.get("method") || undefined,
    };

    // Validate query parameters using Zod
    const validationResult = shortlistsQuerySchema.safeParse(queryParams);

    if (!validationResult.success) {
      const errorResponse = formatZodError(validationResult.error);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const {
      date: dateParam,
      type: typeParam,
      method: methodParam,
    } = validationResult.data;

    // Date is required for the query, even though it's optional in the schema
    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const selectedDateTime = dayjs(dateParam);

    // Set method to provided value or default to "hybrid"
    const method: BuyerControlMethod = methodParam || "hybrid";

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
          const quoteData = quoteSnapshot?.quoteData as QuoteData | null;

          // Calculate buyer control percentage
          let buyerControlPercentage: number | null = null;

          // Safely cast quoteData if it's valid
          const validQuoteData: BuyerControlQuoteData | null =
            quoteData && isQuoteData(quoteData) ? quoteData : null;

          // If method is specified, calculate on-the-fly
          // Otherwise, use stored value if available
          if (methodParam !== null) {
            buyerControlPercentage = calculateBuyerControlPercentage(
              validQuoteData,
              method
            );
          } else {
            // Use stored value from database if available
            buyerControlPercentage =
              quoteSnapshot?.buyerControlPercentage !== null &&
              quoteSnapshot?.buyerControlPercentage !== undefined
                ? Number(quoteSnapshot.buyerControlPercentage)
                : calculateBuyerControlPercentage(
                    validQuoteData,
                    "hybrid" // Default to hybrid if no stored value
                  );
          }

          const data: ShortlistEntry = {
            ...entry,
            quoteData,
            buyerControlPercentage,
          };

          return data as unknown as JsonValue;
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
