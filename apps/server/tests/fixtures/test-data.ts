/// <reference types="node" />
import { faker } from "@faker-js/faker";
import {
  growwQuoteSchema,
  shortlistEntrySchema,
  v1_candles_schemas,
  v1_lists_schemas,
  v1_runs_schemas,
} from "@ganaka/schemas";
import type { z } from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import crypto from "crypto";

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
 * Creates valid shortlist entries array matching listSchema[]
 */
export function createValidShortlistEntries(): z.infer<typeof shortlistEntrySchema>[] {
  return [
    { name: "Reliance Industries Ltd", price: 2500.0, nseSymbol: "RELIANCE" },
    { name: "Tata Consultancy Services", price: 3500.0, nseSymbol: "TCS" },
    { name: "HDFC Bank Ltd", price: 1600.0, nseSymbol: "HDFCBANK" },
    { name: "Infosys Ltd", price: 1400.0, nseSymbol: "INFY" },
    { name: "ICICI Bank Ltd", price: 950.0, nseSymbol: "ICICIBANK" },
  ];
}

/**
 * Creates shortlist snapshot test data matching listSchema[]
 */
export function createShortlistSnapshotTestData(): z.infer<(typeof shortlistEntrySchema)[]>[] {
  return createValidShortlistEntries();
}

/**
 * Creates collector shortlist snapshot request body
 */
export function createCollectorShortlistRequest(
  shortlistType: "TOP_GAINERS" | "VOLUME_SHOCKERS" = "TOP_GAINERS",
  entries?: z.infer<typeof shortlistEntrySchema>[]
): z.infer<typeof v1_lists_schemas.createShortlistSnapshot.body> {
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
 * Creates valid developer candles query parameters
 */
export function createDeveloperCandlesQuery(
  symbol?: string,
  interval?: z.infer<typeof v1_candles_schemas.getDeveloperCandles.query>["interval"],
  startTime?: string,
  endTime?: string,
  timezone?: string,
  ignoreDb?: boolean
): Partial<z.infer<typeof v1_candles_schemas.getDeveloperCandles.query>> {
  return {
    symbol: symbol,
    interval: interval,
    start_datetime: startTime,
    end_datetime: endTime,
    timezone: timezone,
    ...(ignoreDb ? { ignoreDb: true } : {}),
  };
}

/**
 * Creates valid lists query parameters
 */
export function createListsQuery(
  type?: z.infer<typeof v1_lists_schemas.getLists.query>["type"],
  datetime?: string,
  timezone?: string,
  scope?: "FULL" | "TOP_5"
): z.infer<typeof v1_lists_schemas.getLists.query> {
  return {
    type: type || ("top-gainers" as z.infer<typeof v1_lists_schemas.getLists.query>["type"]),
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
): z.infer<typeof v1_runs_schemas.createRun.body> {
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
): z.infer<typeof v1_runs_schemas.createOrder.body> {
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
): z.infer<typeof v1_lists_schemas.getShortlists.query> {
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
 * Creates valid Groww quote query parameters (symbol and optional datetime)
 */
export function createGrowwQuoteQuery(symbol: string): { symbol: string } {
  return { symbol };
}

/**
 * Creates valid candles query parameters for dashboard
 */
export function createCandlesQuery({
  symbol = TEST_SYMBOL,
  date = TEST_DATE,
  interval,
  ignoreDb = false,
}: {
  symbol?: string;
  date?: string;
  interval?: z.infer<typeof v1_candles_schemas.getDashboardCandles.query>["interval"];
  timezone?: string;
  ignoreDb?: boolean;
}): z.infer<typeof v1_candles_schemas.getDashboardCandles.query> {
  return {
    symbol: symbol || TEST_SYMBOL,
    date: date || TEST_DATE,
    ...(ignoreDb ? { ignoreDb: true } : {}),
    ...(interval ? { interval } : {}),
  };
}

/**
 * Helper function to convert query object to URLSearchParams-compatible format
 * Converts all primitive values to strings and filters out undefined values
 */
export function buildQueryString(
  query:
    | Partial<z.infer<typeof v1_lists_schemas.getLists.query>>
    | Partial<z.infer<typeof v1_lists_schemas.getShortlists.query>>
    | Partial<z.infer<typeof v1_candles_schemas.getDashboardCandles.query>>
    | Partial<z.infer<typeof v1_runs_schemas.createRun.body>>
    | Partial<z.infer<typeof v1_runs_schemas.createOrder.body>>
    | ReturnType<typeof createGrowwQuoteQuery>
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      params.append(key, String(value));
    }
  }
  return params.toString();
}

// ==================== Groww Credentials Test Data ====================

/**
 * Creates valid Groww credentials for testing
 */
export function createValidGrowwCredentials() {
  return {
    growwApiKey: `test-api-key-${Date.now()}-${crypto.randomBytes(8).toString("hex")}`,
    growwApiSecret: `test-api-secret-${Date.now()}-${crypto.randomBytes(8).toString("hex")}`,
  };
}

/**
 * Creates invalid Groww credentials (empty strings) for testing validation
 */
export function createInvalidGrowwCredentials() {
  return {
    growwApiKey: "",
    growwApiSecret: "",
  };
}
