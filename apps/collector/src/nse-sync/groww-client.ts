import axios, { AxiosError } from "axios";
import { getGrowwToken, invalidateToken } from "../utils/token-manager";

export interface GrowwCandle {
  timestamp: string; // ISO timestamp string
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface GrowwCandlesResponse {
  status: "SUCCESS" | "FAILURE";
  payload: {
    candles: Array<[string, number, number, number, number, number, number | null]>;
    closing_price: number | null;
    start_time: string;
    end_time: string;
    interval_in_minutes: number;
  };
}

/**
 * Fetch historical candles from Groww API
 * @param growwSymbol - Groww symbol (e.g., "NSE-RELIANCE")
 * @param startTime - Start time in IST format: YYYY-MM-DDTHH:mm:ss
 * @param endTime - End time in IST format: YYYY-MM-DDTHH:mm:ss
 * @param maxRetries - Maximum number of retry attempts (default: 5)
 */
export async function fetchHistoricalCandles({
  growwSymbol,
  startTime,
  endTime,
  maxRetries = 5,
  accessToken,
}: {
  growwSymbol: string;
  startTime: string;
  endTime: string;
  maxRetries: number;
  accessToken: string;
}): Promise<GrowwCandle[]> {
  const url = "https://api.groww.in/v1/historical/candles";
  const params = {
    candle_interval: "1minute",
    start_time: startTime,
    end_time: endTime,
    exchange: "NSE",
    segment: "CASH",
    groww_symbol: growwSymbol,
  };

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.get<GrowwCandlesResponse>(url, {
        params,
        timeout: 30000, // 30 second timeout
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "PostmanRuntime/7.32.3",
          "Accept-Encoding": "gzip, deflate, br",
          Accept: "application/json",
        },
      });

      if (response.data.status === "FAILURE") {
        throw new Error(`Groww API returned FAILURE status for ${growwSymbol}`);
      }

      // Transform response to GrowwCandle format
      const candles: GrowwCandle[] = response.data.payload.candles.map((candle) => {
        // candle format: [timestamp, open, high, low, close, volume, turnover]
        const [timestamp, open, high, low, close, volume] = candle;
        return {
          timestamp: timestamp as string,
          open: open as number,
          high: high as number,
          low: low as number,
          close: close as number,
          volume: volume as number,
        };
      });

      return candles;
    } catch (error) {
      lastError = error;

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        // Handle 401 (Unauthorized) - invalidate token and retry with new token
        if (axiosError.response?.status === 401 && attempt < maxRetries) {
          console.warn(
            `Unauthorized for ${growwSymbol}, invalidating token and retrying (attempt ${attempt}/${maxRetries})`
          );
          invalidateToken();
          continue; // Retry with new token
        }

        // Handle 429 (Rate Limit) with exponential backoff
        if (axiosError.response?.status === 429 && attempt < maxRetries) {
          const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Max 10 seconds
          console.warn(
            `Rate limited for ${growwSymbol}, attempt ${attempt}/${maxRetries}, retrying in ${backoffDelay}ms`
          );
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
          continue;
        }

        // Handle 500 errors with retry
        if (axiosError.response?.status === 500 && attempt < maxRetries) {
          const backoffDelay = 1000 * attempt; // Linear backoff for 500 errors
          console.warn(
            `Server error for ${growwSymbol}, attempt ${attempt}/${maxRetries}, retrying in ${backoffDelay}ms`
          );
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
          continue;
        }

        // Don't retry on 4xx errors (except 401 and 429)
        if (
          axiosError.response?.status &&
          axiosError.response.status >= 400 &&
          axiosError.response.status < 500 &&
          axiosError.response.status !== 401 &&
          axiosError.response.status !== 429
        ) {
          throw new Error(
            `Groww API error ${axiosError.response.status} for ${growwSymbol}: ${axiosError.response.statusText}`
          );
        }
      }

      // If it's the last attempt, throw the error
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Otherwise, wait and retry
      const backoffDelay = 1000 * attempt;
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
    }
  }

  throw lastError;
}
