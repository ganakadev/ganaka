import {
  v1_candles_schemas,
  v1_quote_schemas,
  v1_lists_schemas,
  v1_dates_schemas,
  v1_holidays_schemas,
} from "@ganaka/schemas";
import { z } from "zod";
import { fetchCandles } from "./callbacks/fetchCandles";
import { fetchQuote } from "./callbacks/fetchQuote";
import { fetchList } from "./callbacks/fetchShortlist";
import { fetchListPersistence } from "./callbacks/fetchShortlistPersistence";
import { fetchDates } from "./callbacks/fetchDates";
import { fetchHolidays } from "./callbacks/fetchHolidays";

export interface GanakaClientConfig {
  /**
   * Developer token for API authentication.
   * If not provided, will be read from DEVELOPER_KEY environment variable.
   */
  developerToken?: string;
  /**
   * API domain base URL.
   * If not provided, defaults to "https://api.ganaka.live".
   * Can also be set via API_DOMAIN environment variable.
   */
  apiDomain?: string;
}

/**
 * GanakaClient provides standalone access to Ganaka API methods without requiring a run context.
 * This allows you to fetch data (candles, quotes, shortlists, etc.) without setting up a full ganaka run.
 *
 * @example
 * ```typescript
 * import { GanakaClient } from "@ganaka/sdk";
 *
 * const client = new GanakaClient();
 * const candles = await client.fetchCandles({
 *   symbol: "RELIANCE",
 *   interval: "1minute",
 *   start_datetime: "2026-01-20T09:15:00",
 *   end_datetime: "2026-01-20T15:30:00",
 * });
 * ```
 */
export class GanakaClient {
  private developerToken: string;
  private apiDomain: string;

  constructor(config?: GanakaClientConfig) {
    this.developerToken = config?.developerToken || process.env.DEVELOPER_KEY || "";
    this.apiDomain = config?.apiDomain || process.env.API_DOMAIN || "https://api.ganaka.live";

    if (!this.developerToken) {
      throw new Error(
        "Developer token not found. Please provide developerToken in constructor or set DEVELOPER_KEY environment variable."
      );
    }
  }

  /**
   * Fetch historical candles for a symbol.
   *
   * @param params - Query parameters for fetching candles
   * @param params.symbol - The symbol to fetch candles for
   * @param params.interval - The interval for candles (e.g., "1minute", "5minute", "1day")
   * @param params.start_datetime - Start datetime in IST string format (YYYY-MM-DDTHH:mm:ss)
   * @param params.end_datetime - End datetime in IST string format (YYYY-MM-DDTHH:mm:ss)
   * @param params.ignoreDb - Optional boolean to force fetching from broker instead of database
   * @returns Promise resolving to candle data
   */
  async fetchCandles(
    params: z.infer<typeof v1_candles_schemas.getDeveloperCandles.query>
  ): Promise<z.infer<typeof v1_candles_schemas.getDeveloperCandles.response>["data"]> {
    const callback = fetchCandles({
      developerToken: this.developerToken,
      apiDomain: this.apiDomain,
      runId: null,
      currentTimestamp: "",
      currentTimezone: "Asia/Kolkata",
    });
    return callback(params);
  }

  /**
   * Fetch quote for a symbol at a specific datetime.
   *
   * @param params - Query parameters for fetching quote
   * @param params.symbol - The symbol to fetch quote for
   * @param params.datetime - Datetime in IST string format (YYYY-MM-DDTHH:mm:ss)
   * @returns Promise resolving to quote data or null
   */
  async fetchQuote(
    params: z.infer<typeof v1_quote_schemas.getGrowwQuote.query>
  ): Promise<z.infer<typeof v1_quote_schemas.getGrowwQuote.response>["data"] | null> {
    const callback = fetchQuote({
      developerToken: this.developerToken,
      apiDomain: this.apiDomain,
      runId: null,
    });
    return callback(params);
  }

  /**
   * Fetch shortlist for a specific type and datetime.
   *
   * @param queryParams - Query parameters for fetching shortlist
   * @param queryParams.type - The type of shortlist (e.g., "TOP_GAINERS", "VOLUME_SHOCKERS")
   * @param queryParams.datetime - Datetime in IST string format (YYYY-MM-DDTHH:mm:ss)
   * @returns Promise resolving to shortlist data or null
   */
  async fetchShortlist(
    queryParams: z.infer<typeof v1_lists_schemas.getLists.query>
  ): Promise<z.infer<typeof v1_lists_schemas.getLists.response>["data"] | null> {
    const callback = fetchList({
      developerToken: this.developerToken,
      apiDomain: this.apiDomain,
      runId: null,
      currentTimestamp: "",
      currentTimezone: "Asia/Kolkata",
    });
    return callback(queryParams);
  }

  /**
   * Fetch shortlist persistence.
   * Given a shortlist type and a start and end datetime,
   * returns the list of instruments that appeared in the shortlist during the time range
   * in descending order of appearance count.
   *
   * This helps identify the stocks that have been consistently appearing in the shortlist
   * over a given period of time.
   *
   * @param queryParams - Query parameters for fetching shortlist persistence
   * @param queryParams.type - The type of shortlist (e.g., "TOP_GAINERS", "VOLUME_SHOCKERS")
   * @param queryParams.start_datetime - Start datetime in IST string format (YYYY-MM-DDTHH:mm:ss)
   * @param queryParams.end_datetime - End datetime in IST string format (YYYY-MM-DDTHH:mm:ss)
   * @returns Promise resolving to shortlist persistence data or null
   */
  async fetchListPersistence(
    queryParams: z.infer<typeof v1_lists_schemas.getListPersistence.query>
  ): Promise<z.infer<typeof v1_lists_schemas.getListPersistence.response>["data"] | null> {
    const callback = fetchListPersistence({
      developerToken: this.developerToken,
      apiDomain: this.apiDomain,
      runId: null,
      currentTimestamp: "",
      currentTimezone: "Asia/Kolkata",
    });
    return callback(queryParams);
  }

  /**
   * Fetch dates with data.
   * Returns which dates have data available, grouped by date with all timestamps for each date.
   *
   * @returns Promise resolving to dates data with dates and timestamps
   */
  async fetchDates(): Promise<z.infer<typeof v1_dates_schemas.getDates.response>["data"]> {
    const callback = fetchDates({
      developerToken: this.developerToken,
      apiDomain: this.apiDomain,
      runId: null,
      currentTimestamp: "",
      currentTimezone: "Asia/Kolkata",
    });
    return callback();
  }

  /**
   * Fetch market holidays.
   * Returns all dates marked as market holidays.
   *
   * @returns Promise resolving to holidays data
   */
  async fetchHolidays(): Promise<z.infer<typeof v1_holidays_schemas.getHolidays.response>["data"]> {
    const callback = fetchHolidays({
      developerToken: this.developerToken,
      apiDomain: this.apiDomain,
      runId: null,
      currentTimestamp: "",
      currentTimezone: "Asia/Kolkata",
    });
    return callback();
  }
}
