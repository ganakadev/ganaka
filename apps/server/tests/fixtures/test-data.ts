import { faker } from "@faker-js/faker";
import { v1_developer_groww_schemas } from "@ganaka/schemas";
import type { z } from "zod";

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
export const TEST_SYMBOL_FOR_QUOTE_TIMELINE = "TARC";

/**
 * Known test datetime in format (YYYY-MM-DDTHH:mm:ss)
 */
export const TEST_DATETIME = "2025-12-26T10:06:00";

/**
 * Known test date in format (YYYY-MM-DD)
 */
export const TEST_DATE = "2025-12-26";
export const TEST_DATE_FOR_DAILY_PERSISTENT_COMPANIES = "2025-12-27";

/**
 * Creates a valid Groww quote payload matching growwQuoteSchema
 */
export function createValidGrowwQuotePayload(): z.infer<
  typeof v1_developer_groww_schemas.growwQuoteSchema
> {
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
export function createValidShortlistEntries(): Array<{
  name: string;
  price: number;
  nseSymbol: string;
}> {
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
export function createQuoteSnapshotTestData(): z.infer<
  typeof v1_developer_groww_schemas.growwQuoteSchema
> {
  return createValidGrowwQuotePayload();
}

/**
 * Creates shortlist snapshot test data matching listSchema[]
 */
export function createShortlistSnapshotTestData(): Array<{
  name: string;
  price: number;
  nseSymbol: string;
}> {
  return createValidShortlistEntries();
}

/**
 * Creates valid quote query parameters
 */
export function createGrowwQuoteQuery(symbol?: string, datetime?: string, timezone?: string) {
  return {
    symbol: symbol || TEST_SYMBOL,
    timezone: timezone || "Asia/Kolkata",
    ...(datetime && { datetime }),
  };
}

/**
 * Creates valid historical candles query parameters
 */
export function createHistoricalCandlesQuery(
  symbol?: string,
  interval?: string,
  startTime?: string,
  endTime?: string,
  timezone?: string
) {
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
export function createQuoteTimelineQuery(symbol?: string, date?: string, timezone?: string) {
  return {
    symbol: symbol || TEST_SYMBOL,
    date: date || TEST_DATE,
    timezone: timezone || "Asia/Kolkata",
  };
}

/**
 * Creates valid lists query parameters
 */
export function createListsQuery(
  type?: "top-gainers" | "volume-shockers",
  datetime?: string,
  timezone?: string
) {
  return {
    type: type || "top-gainers",
    timezone: timezone || "Asia/Kolkata",
    ...(datetime && { datetime }),
  };
}

// ==================== Dashboard API Test Data ====================

/**
 * Creates test data for creating a run
 */
export function createRunTestData(startTime?: string, endTime?: string) {
  const defaultStart = new Date("2025-12-26T09:15:00Z").toISOString();
  const defaultEnd = new Date("2025-12-26T15:30:00Z").toISOString();
  return {
    startTime: startTime || defaultStart,
    endTime: endTime || defaultEnd,
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
) {
  const defaultTimestamp = new Date("2025-12-26T10:00:00Z").toISOString();
  return {
    nseSymbol: nseSymbol || TEST_SYMBOL,
    entryPrice: entryPrice || 2500.0,
    stopLossPrice: stopLossPrice || 2400.0,
    takeProfitPrice: takeProfitPrice || 2600.0,
    timestamp: timestamp || defaultTimestamp,
  };
}

/**
 * Creates valid shortlists query parameters for dashboard
 */
export function createShortlistsQuery(
  date?: string,
  type?: "TOP_GAINERS" | "VOLUME_SHOCKERS",
  method?: string,
  timezone?: string
) {
  return {
    date: date || TEST_DATE,
    timezone: timezone || "Asia/Kolkata",
    type: type || "TOP_GAINERS",
    ...(method && { method }),
  };
}

/**
 * Creates valid candles query parameters for dashboard
 */
export function createCandlesQuery(
  symbol?: string,
  date?: string,
  interval?: string,
  timezone?: string
) {
  return {
    symbol: symbol || TEST_SYMBOL,
    date: date || TEST_DATE,
    timezone: timezone || "Asia/Kolkata",
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
) {
  return {
    symbol: symbol || TEST_SYMBOL,
    date: date || TEST_DATE,
    timezone: timezone || "Asia/Kolkata",
  };
}

/**
 * Creates valid daily persistent companies query parameters
 */
export function createDailyPersistentCompaniesQuery(
  date?: string,
  type?: "TOP_GAINERS" | "VOLUME_SHOCKERS",
  timezone?: string
) {
  return {
    date: date || TEST_DATE,
    timezone: timezone || "Asia/Kolkata",
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
) {
  return {
    date: date || TEST_DATE,
    timezone: timezone || "Asia/Kolkata",
    type: type || "TOP_GAINERS",
  };
}

/**
 * Helper function to convert query object to URLSearchParams-compatible format
 * Filters out undefined values to avoid adding them to the query string
 */
export function buildQueryString(query: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      params.append(key, value);
    }
  }
  return params.toString();
}
