import { prisma } from "@/lib/prisma";
import { formatZodError, shortlistsQuerySchema } from "@/lib/validation";
import {
  BuyerControlMethod,
  QuoteData as BuyerControlQuoteData,
  calculateBuyerControlPercentage,
  isQuoteData,
} from "@/utils/buyerControl";
import {
  QuoteData,
  ShortlistEntry,
  ShortlistSnapshot,
  ShortlistType,
} from "@ganaka/db";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { NextRequest, NextResponse } from "next/server";

dayjs.extend(utc);
dayjs.extend(timezone);

export interface ApiShortlistsResponse {
  shortlist:
    | (Omit<ShortlistSnapshot, "entries"> & {
        entries: (ShortlistEntry & {
          quoteData: QuoteData;
          buyerControlPercentage: number;
        })[];
      })
    | null;
}

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

    const shortlistFromDb = shortlists[0];
    const shortlistEntries = shortlistFromDb.entries as ShortlistEntry[] | null;
    let entries: NonNullable<ApiShortlistsResponse["shortlist"]>["entries"] =
      [];

    if (shortlistEntries) {
      entries = shortlistEntries.flatMap((entry) => {
        const quoteSnapshot = quoteSnapshots.find(
          (quoteSnapshot) => quoteSnapshot.nseSymbol === entry.nseSymbol
        );
        const quoteData = quoteSnapshot?.quoteData;

        // Calculate buyer control percentage
        let buyerControlPercentage: number = 0;

        // Safely cast quoteData if it's valid
        const validQuoteData: BuyerControlQuoteData | null =
          quoteData && isQuoteData(quoteData) ? quoteData : null;

        // If method is specified, calculate on-the-fly
        // Otherwise, use stored value if available
        if (methodParam !== null) {
          buyerControlPercentage =
            calculateBuyerControlPercentage(validQuoteData, method) ?? 0;
        } else {
          // Use stored value from database if available
          buyerControlPercentage =
            calculateBuyerControlPercentage(
              validQuoteData,
              "hybrid" // Default to hybrid if no stored value
            ) ?? 0;
        }

        if (quoteData) {
          const data: NonNullable<
            ApiShortlistsResponse["shortlist"]
          >["entries"][0] = {
            nseSymbol: entry.nseSymbol,
            name: entry.name,
            price: entry.price,
            quoteData: quoteData as unknown as QuoteData,
            buyerControlPercentage: buyerControlPercentage,
          };

          return data;
        }

        return [];
      });
    }

    return NextResponse.json<ApiShortlistsResponse>({
      shortlist: {
        ...shortlistFromDb,
        entries,
      },
    });
  } catch (error) {
    console.error("Error fetching shortlists:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch shortlists";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
