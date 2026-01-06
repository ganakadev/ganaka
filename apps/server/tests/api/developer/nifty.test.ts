import { v1_developer_groww_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { parseDateTimeInTimezone } from "../../../src/utils/timezone";
import {
  createGrowwNiftyQuoteQuery,
  createValidGrowwQuotePayload,
  generateUniqueTestDatetime,
} from "../../fixtures/test-data";
import {
  authenticatedGet,
  authenticatedGetWithRunContext,
  unauthenticatedGet,
} from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import { createNiftyQuoteSnapshot, createRun } from "../../helpers/db-helpers";
import { expect, test } from "../../helpers/test-fixtures";
import { TestDataTracker } from "../../helpers/test-tracker";

dayjs.extend(utc);
dayjs.extend(timezone);

// Helper function to convert query object to URLSearchParams-compatible format
function buildQueryString(query: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      params.append(key, value);
    }
  }
  return params.toString();
}

let developerToken: string;
let developerId: string;
let sharedTracker: TestDataTracker;

test.beforeAll(async () => {
  sharedTracker = new TestDataTracker();
  const dev = await createDeveloperUser(undefined, sharedTracker);
  developerToken = dev.token;
  developerId = dev.id;
});

test.afterAll(async () => {
  if (sharedTracker) {
    await sharedTracker.cleanup();
  }
});

test.describe("GET /v1/developer/groww/nifty", () => {
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet(
      "/v1/developer/groww/nifty?datetime=2025-12-26T10:06:00"
    );

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const response = await authenticatedGet(
      "/v1/developer/groww/nifty?datetime=2025-12-26T10:06:00",
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when datetime format is invalid", async () => {
    const response = await authenticatedGet(
      "/v1/developer/groww/nifty?datetime=invalid-date",
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return snapshot data when valid datetime is provided", async ({ tracker }) => {
    const testQuoteData = createValidGrowwQuotePayload();
    const testDatetime = generateUniqueTestDatetime();
    await createNiftyQuoteSnapshot(testDatetime, testQuoteData, tracker);

    const query = createGrowwNiftyQuoteQuery(testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/groww/nifty?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("NIFTY quote fetched successfully");
    expect(body.data).not.toBeNull();

    // Validate response matches schema
    const validatedData = v1_developer_groww_schemas.getGrowwNiftyQuote.response.parse(body);
    expect(validatedData.data).not.toBeNull();

    // Validate data structure matches stored snapshot
    if (validatedData.data) {
      expect(validatedData.data.status).toBe("SUCCESS");
      expect(validatedData.data.payload.ohlc).toHaveProperty("open");
      expect(typeof validatedData.data.payload.ohlc?.open).toBe("number");
      expect(validatedData.data.payload.ohlc).toHaveProperty("high");
      expect(validatedData.data.payload.ohlc).toHaveProperty("low");
      expect(validatedData.data.payload.ohlc).toHaveProperty("close");
      expect(validatedData.data.payload.depth?.buy).toBeInstanceOf(Array);
      expect(validatedData.data.payload.depth?.sell).toBeInstanceOf(Array);
      expect(typeof validatedData.data.payload.day_change).toBe("number");
      expect(typeof validatedData.data.payload.day_change_perc).toBe("number");
      expect(typeof validatedData.data.payload.volume).toBe("number");

      // Validate exact snapshot data values
      // OHLC values
      expect(validatedData.data.payload.ohlc?.open).toBe(2475);
      expect(validatedData.data.payload.ohlc?.high).toBe(2510);
      expect(validatedData.data.payload.ohlc?.low).toBe(2470);
      expect(validatedData.data.payload.ohlc?.close).toBe(2500);

      // Depth buy array
      expect(validatedData.data.payload.depth?.buy).toHaveLength(3);
      expect(validatedData.data.payload.depth?.buy[0]).toEqual({ price: 2500.0, quantity: 100 });
      expect(validatedData.data.payload.depth?.buy[1]).toEqual({ price: 2499.5, quantity: 200 });
      expect(validatedData.data.payload.depth?.buy[2]).toEqual({ price: 2499.0, quantity: 150 });

      // Depth sell array
      expect(validatedData.data.payload.depth?.sell).toHaveLength(3);
      expect(validatedData.data.payload.depth?.sell[0]).toEqual({ price: 2501.0, quantity: 100 });
      expect(validatedData.data.payload.depth?.sell[1]).toEqual({ price: 2501.5, quantity: 200 });
      expect(validatedData.data.payload.depth?.sell[2]).toEqual({ price: 2502.0, quantity: 150 });

      // Numeric fields
      expect(validatedData.data.payload.volume).toBe(50000);
      expect(validatedData.data.payload.bid_price).toBe(2501);
      expect(validatedData.data.payload.day_change).toBe(25.5);
      expect(validatedData.data.payload.last_price).toBe(2500);
      expect(validatedData.data.payload.day_change_perc).toBe(1.03);
      expect(validatedData.data.payload.bid_quantity).toBe(100);
      expect(validatedData.data.payload.week_52_high).toBe(2800);
      expect(validatedData.data.payload.week_52_low).toBe(2200);
      expect(validatedData.data.payload.average_price).toBe(2500.5);
      expect(validatedData.data.payload.oi_day_change).toBe(0);
      expect(validatedData.data.payload.total_buy_quantity).toBe(1000);
      expect(validatedData.data.payload.last_trade_quantity).toBe(50);
      expect(validatedData.data.payload.lower_circuit_limit).toBe(2250);
      expect(validatedData.data.payload.total_sell_quantity).toBe(1200);
      expect(validatedData.data.payload.upper_circuit_limit).toBe(2750);
      expect(validatedData.data.payload.oi_day_change_percentage).toBe(0);
      expect(validatedData.data.payload.last_trade_time).toBe(1705312200000);

      // Nullable fields
      expect(validatedData.data.payload.market_cap).toBeNull();
      expect(validatedData.data.payload.offer_price).toBeNull();
      expect(validatedData.data.payload.offer_quantity).toBeNull();
      expect(validatedData.data.payload.open_interest).toBeNull();
      expect(validatedData.data.payload.previous_open_interest).toBeNull();
      expect(validatedData.data.payload.low_trade_range).toBeNull();
      expect(validatedData.data.payload.high_trade_range).toBeNull();
      expect(validatedData.data.payload.implied_volatility).toBeNull();
    }
  });

  test("should return null data when snapshot is not found", async () => {
    const futureDatetime = "2099-01-01T10:30:00";
    const query = createGrowwNiftyQuoteQuery(futureDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/groww/nifty?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("NIFTY quote snapshot not found");
    expect(body.data).toBeNull();
  });

  test("should handle multiple snapshots in same minute window (return most recent)", async ({
    tracker,
  }) => {
    const testDatetime = generateUniqueTestDatetime();
    const testQuoteData1 = createValidGrowwQuotePayload();
    const testQuoteData2 = createValidGrowwQuotePayload();
    testQuoteData2.payload.last_price = 2600.0; // Different price to distinguish

    // Create two snapshots within the same minute window
    const timestamp1 = parseDateTimeInTimezone(testDatetime, "Asia/Kolkata");
    const timestamp2 = new Date(timestamp1.getTime() + 30 * 1000); // 30 seconds later

    await createNiftyQuoteSnapshot(
      dayjs.utc(timestamp1).tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss"),
      testQuoteData1,
      tracker
    );
    await createNiftyQuoteSnapshot(
      dayjs.utc(timestamp2).tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss"),
      testQuoteData2,
      tracker
    );

    const query = createGrowwNiftyQuoteQuery(testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/groww/nifty?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.data).not.toBeNull();
    // Should return the most recent one (timestamp2)
    expect(body.data?.payload.last_price).toBe(2600.0);
  });

  test("should allow request with datetime < currentTimestamp when headers are present", async ({
    tracker,
  }) => {
    const testDatetime = generateUniqueTestDatetime();
    await createNiftyQuoteSnapshot(testDatetime, createValidGrowwQuotePayload(), tracker);

    // Create a run and set currentTimestamp to 1 hour after testDatetime
    const currentTimestamp = parseDateTimeInTimezone(testDatetime, "Asia/Kolkata");
    currentTimestamp.setHours(currentTimestamp.getHours() + 1);
    const run = await createRun(developerId, testDatetime, currentTimestamp.toISOString(), tracker);

    const query = createGrowwNiftyQuoteQuery(testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGetWithRunContext(
      `/v1/developer/groww/nifty?${queryString}`,
      developerToken,
      run.id,
      currentTimestamp
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.data).not.toBeNull();
  });

  test("should return 403 when datetime equals currentTimestamp", async ({ tracker }) => {
    const testDatetime = generateUniqueTestDatetime();
    await createNiftyQuoteSnapshot(testDatetime, createValidGrowwQuotePayload(), tracker);

    const currentTimestamp = parseDateTimeInTimezone(testDatetime, "Asia/Kolkata");
    const run = await createRun(
      developerId,
      testDatetime,
      dayjs.tz(testDatetime, "Asia/Kolkata").add(1, "hour").format("YYYY-MM-DDTHH:mm:ss"),
      tracker
    );

    const query = createGrowwNiftyQuoteQuery(testDatetime);
    const queryString = buildQueryString(query);

    const response = await authenticatedGetWithRunContext(
      `/v1/developer/groww/nifty?${queryString}`,
      developerToken,
      run.id,
      currentTimestamp,
      "Asia/Kolkata",
      { validateStatus: () => true }
    );

    expect(response.status).toBe(403);
    const body = response.data;
    expect(body.statusCode).toBe(403);
    expect(body.message).toContain("Cannot access data");
    expect(body.message).toContain("before current execution timestamp");
  });

  test("should return 403 when datetime > currentTimestamp", async ({ tracker }) => {
    const testDatetime = generateUniqueTestDatetime();
    await createNiftyQuoteSnapshot(testDatetime, createValidGrowwQuotePayload(), tracker);

    const currentTimestamp = parseDateTimeInTimezone(testDatetime, "Asia/Kolkata");
    currentTimestamp.setHours(currentTimestamp.getHours() - 1); // currentTimestamp is 1 hour before testDatetime
    const run = await createRun(developerId, testDatetime, currentTimestamp.toISOString(), tracker);

    const query = createGrowwNiftyQuoteQuery(testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGetWithRunContext(
      `/v1/developer/groww/nifty?${queryString}`,
      developerToken,
      run.id,
      currentTimestamp,
      "Asia/Kolkata",
      { validateStatus: () => true }
    );

    expect(response.status).toBe(403);
    const body = response.data;
    expect(body.statusCode).toBe(403);
    expect(body.message).toContain("Cannot access data");
  });

  test("should allow request without headers (backward compatibility)", async ({ tracker }) => {
    const testDatetime = generateUniqueTestDatetime();
    await createNiftyQuoteSnapshot(testDatetime, createValidGrowwQuotePayload(), tracker);

    const query = createGrowwNiftyQuoteQuery(testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/groww/nifty?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
  });

  test("should return 400 when datetime is missing", async () => {
    const response = await authenticatedGet("/v1/developer/groww/nifty", developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
    const body = response.data;
    expect(body.message).toContain("datetime parameter is required");
  });
});
