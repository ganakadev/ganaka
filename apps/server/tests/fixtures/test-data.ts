/// <reference types="node" />
import { faker } from "@faker-js/faker";
import {
  v1_developer_groww_schemas,
  v1_developer_lists_schemas,
  v1_developer_collector_schemas,
  v1_dashboard_schemas,
  growwQuoteSchema,
} from "@ganaka/schemas";
import type { z } from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Generates a random username for testing
 */
export function generateUsername(): string {
  return `test-user-${faker.string.alphanumeric(8)}`;
}

/**
 * Generates a valid UUID for testing
 */
export function generateUUID(): string {
  /**
   * Requirements for a valid UUID:
   * • the 3rd group starts with 4 (version 4),
   * • the 4th group starts with a (variant 8/9/a/b).
   */
  return "dddddddd-dddd-4ddd-addd-dddddddddddd";
}

/**
 * Creates test data for creating a developer
 */
export function createDeveloperTestData() {
  return {
    username: generateUsername(),
  };
}

/**
 * Creates test data with invalid username (too long)
 */
export function createInvalidDeveloperTestData() {
  return {
    username: "a".repeat(256), // Exceeds max length of 255
  };
}

/**
 * Creates test data with empty username
 */
export function createEmptyDeveloperTestData() {
  return {
    username: "",
  };
}

// ==================== Developer API Test Data ====================

/**
 * Known test symbol for consistent testing
 */
export const TEST_SYMBOL = "RELIANCE";

/**
 * Known test datetime in format (YYYY-MM-DDTHH:mm:ss)
 */
export const TEST_DATETIME = "2025-12-26T10:06:00";

/**
 * Known test date in format (YYYY-MM-DD)
 */
export const TEST_DATE = "2025-12-26";

/**
 * Suite-specific test dates for test isolation
 */
export const DAILY_PERSISTENT_COMPANIES_TEST_DATE = "2025-12-27";
export const DAILY_UNIQUE_COMPANIES_TEST_DATE = "2025-12-28";
export const CANDLES_TEST_DATE = "2025-12-29";
export const QUOTE_TIMELINES_TEST_DATE = "2025-12-30";

// ==================== Unique Timestamp Generators ====================

/**
 * Counter to ensure uniqueness across parallel test executions
 */
let testDatetimeCounter = 0;
let testDateCounter = 0;

/**
 * Generates a unique datetime string per test execution
 * Uses base date + counter + process ID + timestamp to ensure uniqueness across parallel workers
 * Creates significant gaps (5 minutes) between datetimes to ensure complete isolation between tests
 * Tests that need multiple snapshots in same minute window must override this behavior explicitly
 * @param baseDate Base date in YYYY-MM-DD format (default: "2025-12-26")
 * @returns Unique datetime string in YYYY-MM-DDTHH:mm:ss format
 */
export function generateUniqueTestDatetime(baseDate = "2025-12-26"): string {
  const counter = ++testDatetimeCounter;
  const now = Date.now();
  // Use process ID to create worker-specific offset (0-65535, modulo to reasonable range)
  const processId = (process.pid || 0) % 100;
  // Create significant gaps: counter * 300000 ensures at least 5 minutes between sequential calls
  // Add process ID * 60 for worker-specific offset (0-5900 seconds)
  // Add timestamp component (0-999 milliseconds) for additional uniqueness
  // This ensures datetimes are completely isolated between different tests
  const offsetMs = counter * 300000 + processId * 60 * 1000 + (now % 1000);
  const base = dayjs.tz(`${baseDate}T00:00:00`, "Asia/Kolkata");
  return base.add(offsetMs, "millisecond").format("YYYY-MM-DDTHH:mm:ss");
}

/**
 * Generates a unique date string per test execution
 * Uses base date + counter + process ID + timestamp to ensure uniqueness across parallel workers
 * Creates large gaps (1000+ days) between dates to prevent overlap even with wide query ranges
 * @param baseDate Base date in YYYY-MM-DD format (default: "2025-12-26")
 * @returns Unique date string in YYYY-MM-DD format
 */
export function generateUniqueTestDate(baseDate = "2025-12-26"): string {
  const counter = ++testDateCounter;
  const now = Date.now();
  // Use process ID to create worker-specific offset (0-65535, modulo to reasonable range)
  const processId = (process.pid || 0) % 100;
  // Create large gaps: counter * 1000 ensures at least 1000 days between sequential calls
  // Add process ID * 10 for worker-specific offset (0-990 days)
  // Add timestamp component (0-999 days) for additional uniqueness
  // This ensures dates are at least 1000 days apart, preventing any overlap
  const dayOffset = counter * 1000 + processId * 10 + (now % 1000);
  const base = dayjs.utc(baseDate);
  return base.add(dayOffset, "day").format("YYYY-MM-DD");
}

/**
 * Creates a valid Groww quote payload matching growwQuoteSchema
 */
export function createValidGrowwQuotePayload(): z.infer<typeof growwQuoteSchema> {
  return {
    status: "SUCCESS",
    payload: {
      average_price: 2500.5,
      bid_quantity: 100,
      bid_price: 2501.0,
      day_change: 25.5,
      day_change_perc: 1.03,
      upper_circuit_limit: 2750.0,
      lower_circuit_limit: 2250.0,
      ohlc: {
        open: 2475.0,
        high: 2510.0,
        low: 2470.0,
        close: 2500.0,
      },
      depth: {
        buy: [
          { price: 2500.0, quantity: 100 },
          { price: 2499.5, quantity: 200 },
          { price: 2499.0, quantity: 150 },
        ],
        sell: [
          { price: 2501.0, quantity: 100 },
          { price: 2501.5, quantity: 200 },
          { price: 2502.0, quantity: 150 },
        ],
      },
      high_trade_range: null,
      implied_volatility: null,
      last_trade_quantity: 50,
      last_trade_time: 1705312200000,
      low_trade_range: null,
      last_price: 2500.0,
      market_cap: null,
      offer_price: null,
      offer_quantity: null,
      oi_day_change: 0,
      oi_day_change_percentage: 0,
      open_interest: null,
      previous_open_interest: null,
      total_buy_quantity: 1000,
      total_sell_quantity: 1200,
      volume: 50000,
      week_52_high: 2800.0,
      week_52_low: 2200.0,
    },
  };
}

/**
 * Creates valid shortlist entries array matching listSchema[]
 */
export function createValidShortlistEntries(): z.infer<
  typeof v1_developer_lists_schemas.listSchema
>[] {
  return [
    { name: "Reliance Industries Ltd", price: 2500.0, nseSymbol: "RELIANCE" },
    { name: "Tata Consultancy Services", price: 3500.0, nseSymbol: "TCS" },
    { name: "HDFC Bank Ltd", price: 1600.0, nseSymbol: "HDFCBANK" },
    { name: "Infosys Ltd", price: 1400.0, nseSymbol: "INFY" },
    { name: "ICICI Bank Ltd", price: 950.0, nseSymbol: "ICICIBANK" },
  ];
}

/**
 * Creates quote snapshot test data matching growwQuoteSchema
 */
export function createQuoteSnapshotTestData(): z.infer<typeof growwQuoteSchema> {
  return createValidGrowwQuotePayload();
}

/**
 * Creates shortlist snapshot test data matching listSchema[]
 */
export function createShortlistSnapshotTestData(): z.infer<
  typeof v1_developer_lists_schemas.listSchema
>[] {
  return createValidShortlistEntries();
}

/**
 * Creates collector shortlist snapshot request body
 */
export function createCollectorShortlistRequest(
  shortlistType: "TOP_GAINERS" | "VOLUME_SHOCKERS" = "TOP_GAINERS",
  entries?: z.infer<typeof v1_developer_lists_schemas.listSchema>[]
): z.infer<typeof v1_developer_collector_schemas.createShortlistSnapshot.body> {
  return {
    data: {
      timestamp: TEST_DATETIME,
      timezone: "Asia/Kolkata",
      shortlistType,
      entries: entries || createValidShortlistEntries(),
    },
  };
}

/**
 * Creates collector quote snapshots request body
 */
export function createCollectorQuotesRequest(
  quotes?: z.infer<typeof v1_developer_collector_schemas.quoteSnapshotDataSchema>[]
): z.infer<typeof v1_developer_collector_schemas.createQuoteSnapshots.body> {
  const defaultQuotes: z.infer<typeof v1_developer_collector_schemas.quoteSnapshotDataSchema>[] = [
    {
      nseSymbol: "RELIANCE",
      quoteData: createValidGrowwQuotePayload(),
    },
    {
      nseSymbol: "TCS",
      quoteData: createValidGrowwQuotePayload(),
    },
  ];

  return {
    data: {
      timestamp: TEST_DATETIME,
      timezone: "Etc/UTC",
      quotes: quotes || defaultQuotes,
    },
  };
}

/**
 * Creates collector NIFTY quote request body
 */
export function createCollectorNiftyRequest(
  dayChangePerc: number = 0.5
): z.infer<typeof v1_developer_collector_schemas.createNiftyQuote.body> {
  return {
    data: {
      timestamp: TEST_DATETIME,
      timezone: "Etc/UTC",
      quoteData: createValidGrowwQuotePayload(),
      dayChangePerc,
    },
  };
}

/**
 * Creates valid quote query parameters
 */
export function createGrowwQuoteQuery(
  symbol?: string,
  datetime?: string,
  timezone?: string
): z.infer<typeof v1_developer_groww_schemas.getGrowwQuote.query> {
  return {
    symbol: symbol || TEST_SYMBOL,
    timezone: timezone || "Asia/Kolkata",
    ...(datetime && { datetime }),
  };
}

/**
 * Creates valid NIFTY quote query parameters
 */
export function createGrowwNiftyQuoteQuery(
  datetime?: string,
  timezone?: string
): z.infer<typeof v1_developer_groww_schemas.getGrowwNiftyQuote.query> {
  return {
    timezone: timezone || "Asia/Kolkata",
    ...(datetime && { datetime }),
  };
}

/**
 * Creates valid historical candles query parameters
 */
export function createHistoricalCandlesQuery(
  symbol?: string,
  interval?: z.infer<typeof v1_developer_groww_schemas.getGrowwHistoricalCandles.query>["interval"],
  startTime?: string,
  endTime?: string,
  timezone?: string
): z.infer<typeof v1_developer_groww_schemas.getGrowwHistoricalCandles.query> {
  return {
    symbol: symbol || TEST_SYMBOL,
    interval: interval || "5minute",
    start_datetime: startTime || "2025-12-26T09:15:00",
    end_datetime: endTime || "2025-12-26T10:00:00",
    timezone: timezone || "Asia/Kolkata",
  };
}

/**
 * Creates valid quote timeline query parameters
 */
export function createQuoteTimelineQuery(
  symbol?: string,
  end_datetime?: string,
  timezone?: string
): z.infer<typeof v1_developer_groww_schemas.getGrowwQuoteTimeline.query> {
  return {
    symbol: symbol || TEST_SYMBOL,
    end_datetime: end_datetime || `${TEST_DATE}T15:30:00`,
    ...(timezone && { timezone }),
  };
}

/**
 * Creates valid NIFTY quote timeline query parameters
 */
export function createNiftyQuoteTimelineQuery(
  end_datetime?: string,
  timezone?: string
): z.infer<typeof v1_developer_groww_schemas.getGrowwNiftyQuoteTimeline.query> {
  return {
    end_datetime: end_datetime || `${TEST_DATE}T15:30:00`,
    ...(timezone && { timezone }),
  };
}

/**
 * Creates valid lists query parameters
 */
export function createListsQuery(
  type?: "top-gainers" | "volume-shockers",
  datetime?: string,
  timezone?: string,
  scope?: "FULL" | "TOP_5"
): z.infer<typeof v1_developer_lists_schemas.getLists.query> {
  return {
    type: type || "top-gainers",
    timezone: timezone || "Asia/Kolkata",
    ...(datetime && { datetime }),
    ...(scope && { scope }),
  };
}

// ==================== Dashboard API Test Data ====================

/**
 * Creates test data for creating a run
 */
export function createRunTestData(
  startTime?: string,
  endTime?: string
): z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.createRun.body> {
  const defaultStart = "2025-12-26T09:15:00";
  const defaultEnd = "2025-12-26T15:30:00";
  return {
    start_datetime: startTime || defaultStart,
    end_datetime: endTime || defaultEnd,
    timezone: "Asia/Kolkata",
  };
}

/**
 * Creates test data for creating an order
 */
export function createOrderTestData(
  nseSymbol?: string,
  entryPrice?: number,
  stopLossPrice?: number,
  takeProfitPrice?: number,
  timestamp?: string
): z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.createOrder.body> {
  const defaultTimestamp = "2025-12-26T10:00:00";
  return {
    nseSymbol: nseSymbol || TEST_SYMBOL,
    entryPrice: entryPrice || 2500.0,
    stopLossPrice: stopLossPrice || 2400.0,
    takeProfitPrice: takeProfitPrice || 2600.0,
    datetime: timestamp || defaultTimestamp,
  };
}

/**
 * Creates valid shortlists query parameters for dashboard
 */
export function createShortlistsQuery(
  datetime?: string,
  type?: "TOP_GAINERS" | "VOLUME_SHOCKERS",
  timezone?: string,
  takeProfitPercentage?: number,
  stopLossPercentage?: number,
  scope?: "FULL" | "TOP_5"
): z.infer<typeof v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.query> {
  const result: any = {
    datetime: datetime || TEST_DATETIME,
    timezone: timezone || "Asia/Kolkata",
    type: type || "TOP_GAINERS",
  };

  if (takeProfitPercentage !== undefined) {
    result.takeProfitPercentage = takeProfitPercentage;
  }

  if (stopLossPercentage !== undefined) {
    result.stopLossPercentage = stopLossPercentage;
  }

  if (scope !== undefined) {
    result.scope = scope;
  }

  return result;
}

/**
 * Creates valid candles query parameters for dashboard
 */
export function createCandlesQuery(
  symbol?: string,
  date?: string,
  interval?: z.infer<
    typeof v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.query
  >["interval"],
  timezone?: string
): z.infer<typeof v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.query> {
  return {
    symbol: symbol || TEST_SYMBOL,
    date: date || TEST_DATE,
    ...(interval && { interval }),
  };
}

/**
 * Creates valid quote timeline query parameters for dashboard
 */
export function createQuoteTimelineQueryForDashboard(
  symbol?: string,
  date?: string,
  timezone?: string
): z.infer<typeof v1_dashboard_schemas.v1_dashboard_quote_timeline_schemas.getQuoteTimeline.query> {
  return {
    symbol: symbol || TEST_SYMBOL,
    date: date || TEST_DATE,
  };
}

/**
 * Creates valid daily persistent companies query parameters
 */
export function createDailyPersistentCompaniesQuery(
  date?: string,
  type?: "TOP_GAINERS" | "VOLUME_SHOCKERS",
  timezone?: string
): z.infer<
  typeof v1_dashboard_schemas.v1_dashboard_daily_persistent_companies_schemas.getDailyPersistentCompanies.query
> {
  return {
    date: date || TEST_DATE,
    type: type || "TOP_GAINERS",
  };
}

/**
 * Creates valid daily unique companies query parameters
 */
export function createDailyUniqueCompaniesQuery(
  date?: string,
  type?: "TOP_GAINERS" | "VOLUME_SHOCKERS",
  timezone?: string
): z.infer<
  typeof v1_dashboard_schemas.v1_dashboard_daily_unique_companies_schemas.getDailyUniqueCompanies.query
> {
  return {
    date: date || TEST_DATE,
    type: type || "TOP_GAINERS",
  };
}

/**
 * Helper function to convert query object to URLSearchParams-compatible format
 * Converts all primitive values to strings and filters out undefined values
 */
export function buildQueryString(query: Record<string, string | number | boolean | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      params.append(key, String(value));
    }
  }
  return params.toString();
}
