import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { NextRequest, NextResponse } from "next/server";
import { dummyCandleResponse } from "./dummyData";
import { getGrowwHistoricalCandles } from "@ganaka/groww";

dayjs.extend(utc);
dayjs.extend(timezone);

export interface CandlesResponse {
  candles: CandleData[];
  start_time: string;
  end_time: string;
  interval_in_minutes: number;
}

interface CandleData {
  time: number; // Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get("symbol");
    const dateParam = searchParams.get("date");
    const interval = searchParams.get("interval") || "1minute";

    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol parameter is required" },
        { status: 400 }
      );
    }

    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    // Validate interval
    const validIntervals = [
      "5minute",
      "15minute",
      "30minute",
      "1hour",
      "4hour",
    ];
    if (!validIntervals.includes(interval)) {
      return NextResponse.json(
        {
          error: `Invalid interval. Must be one of: ${validIntervals.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Parse the selected date (it comes in as UTC ISO string)
    const selectedDate = dayjs(dateParam);
    if (!selectedDate.isValid()) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Get the date in IST timezone and set market hours (9:15 AM - 3:30 PM IST)
    // Extract just the date part (YYYY-MM-DD) and create new dayjs object in IST
    const dateStr = selectedDate.format("YYYY-MM-DD");
    const marketStart = dayjs.tz(`${dateStr} 09:15:00`, "Asia/Kolkata");
    const marketEnd = dayjs.tz(`${dateStr} 15:30:00`, "Asia/Kolkata");

    // Convert to format expected by Groww API: YYYY-MM-DDTHH:mm:ss (no milliseconds, no Z)
    // The API expects times in IST format without timezone suffix
    const start_time = marketStart.format("YYYY-MM-DDTHH:mm:ss");
    const end_time = marketEnd.format("YYYY-MM-DDTHH:mm:ss");

    // Make API request
    const response = false
      ? dummyCandleResponse
      : await getGrowwHistoricalCandles({
          symbol,
          start_time,
          end_time,
          interval: interval as
            | "5minute"
            | "15minute"
            | "30minute"
            | "1hour"
            | "4hour",
        });

    // Convert candles to lightweight-charts format
    // TODO: Remove this once the API is working again
    const candleData: CandleData[] = response.payload.candles.flatMap(
      ([timestamp, open, high, low, close]) => {
        // Convert timestamp string to Unix timestamp
        const time = dayjs.utc(timestamp).unix() as number;
        if (
          !open ||
          !high ||
          !low ||
          !close ||
          typeof open !== "number" ||
          typeof high !== "number" ||
          typeof low !== "number" ||
          typeof close !== "number"
        ) {
          return [];
        }
        return {
          time,
          open: open,
          high: high,
          low: low,
          close: close,
        };
      }
    );

    return NextResponse.json<CandlesResponse>({
      candles: candleData,
      start_time: response.payload.start_time,
      end_time: response.payload.end_time,
      interval_in_minutes: response.payload.interval_in_minutes,
    });
  } catch (error) {
    console.error("Error fetching candles:", error);

    // Provide more detailed error information
    let errorMessage = "Failed to fetch candles";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // API responded with error
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `API Error: ${error.response.status} ${error.response.statusText}`;
        console.error("API Error Details:", error.response.data);
      } else if (error.request) {
        errorMessage = "No response from API";
      } else {
        errorMessage = error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
