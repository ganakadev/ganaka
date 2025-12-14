import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError, AxiosResponse } from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { response } from "./dummyData";

dayjs.extend(utc);
dayjs.extend(timezone);

// In-memory cache for access token
let cachedToken: string | null = null;

interface GrowwCandles {
  status: "SUCCESS" | "FAILURE";
  payload: {
    // [timestamp, open, high, low, close, volume, turnover]
    candles: [string, number, number, number, number, number, number][];
    closing_price: number | null;
    start_time: string;
    end_time: string;
    interval_in_minutes: number;
  };
}

interface CandleData {
  time: number; // Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
}

async function getGrowwAccessToken(): Promise<string> {
  // Return cached token if available
  if (cachedToken) {
    return cachedToken;
  }

  const apiKey = process.env.GROWW_API_KEY;
  const apiSecret = process.env.GROWW_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("GROWW_API_KEY and GROWW_API_SECRET are required");
  }

  try {
    const response = (await axios.post(
      "https://groww-access-token-generator.onrender.com",
      {
        api_key: apiKey,
        api_secret: apiSecret,
      }
    )) as AxiosResponse<{ access_token: string }>;

    // Cache the token
    cachedToken = response.data.access_token;
    return cachedToken;
  } catch (error) {
    console.error("Failed to get access token:", error);
    throw error;
  }
}

function invalidateGrowwAccessTokenCache() {
  cachedToken = null;
}

async function growwApiRequest<T = any>(config: {
  method?: string;
  url: string;
  params?: Record<string, any>;
}): Promise<T> {
  const maxAttempts = 2;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const accessToken = await getGrowwAccessToken();
      if (!accessToken) {
        throw new Error("Failed to get access token");
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axios({
        ...config,
        headers,
      });

      return response.data;
    } catch (error) {
      lastError = error;

      // Check if it's a 401 Unauthorized error
      const isUnauthorized =
        axios.isAxiosError(error) &&
        (error as AxiosError).response?.status === 401;

      if (isUnauthorized && attempt < maxAttempts) {
        invalidateGrowwAccessTokenCache();
        continue;
      }

      // Log the error response for debugging
      if (axios.isAxiosError(error) && error.response) {
        console.error("Groww API Error:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          config: {
            url: error.config?.url,
            params: error.config?.params,
          },
        });
      }

      throw error;
    }
  }

  throw lastError;
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
    // const response = await growwApiRequest<GrowwCandles>({
    //   method: "get",
    //   url: "https://api.groww.in/v1/historical/candles",
    //   params: {
    //     candle_interval: interval,
    //     start_time: start_time,
    //     end_time: end_time,
    //     exchange: "NSE",
    //     segment: "CASH",
    //     groww_symbol: encodeURIComponent(`NSE-${symbol}`),
    //   },
    // });

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

    return NextResponse.json({
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
