import { v1_developer_groww_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { parseDateTimeInTimezone } from "../../../src/utils/timezone";
import {
  createGrowwQuoteQuery,
  createValidGrowwQuotePayload,
  generateUniqueTestDatetime,
  TEST_SYMBOL,
  buildQueryString,
} from "../../fixtures/test-data";
import {
  authenticatedGet,
  authenticatedGetWithRunContext,
  unauthenticatedGet,
} from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import {
  createQuoteSnapshot,
  createRun,
} from "../../helpers/db-helpers";
import { expect, test } from "../../helpers/test-fixtures";
import { TestDataTracker } from "../../helpers/test-tracker";

dayjs.extend(utc);
dayjs.extend(timezone);

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

test.describe("GET /v1/quote", () => {
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet("/v1/quote?symbol=RELIANCE");

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const response = await authenticatedGet(
      "/v1/quote?symbol=RELIANCE",
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when symbol is missing", async () => {
    const response = await authenticatedGet("/v1/quote", developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when datetime format is invalid", async () => {
    const response = await authenticatedGet(
      `/v1/quote?symbol=${TEST_SYMBOL}&datetime=invalid-date`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return snapshot data when valid datetime and symbol are provided", async ({
    tracker,
  }) => {
    const testQuoteData = createValidGrowwQuotePayload();
    const testDatetime = generateUniqueTestDatetime();
    await createQuoteSnapshot(TEST_SYMBOL, testDatetime, testQuoteData, tracker);

    const query = createGrowwQuoteQuery(TEST_SYMBOL, testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/quote?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Quote fetched successfully");
    expect(body.data).not.toBeNull();

    // Validate response matches schema
    const validatedData = v1_developer_groww_schemas.getGrowwQuote.response.parse(body);
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
      expect(validatedData.data.payload.depth?.buy[0]).toEqual({ price: 2500, quantity: 100 });
      expect(validatedData.data.payload.depth?.buy[1]).toEqual({ price: 2499.5, quantity: 200 });
      expect(validatedData.data.payload.depth?.buy[2]).toEqual({ price: 2499, quantity: 150 });

      // Depth sell array
      expect(validatedData.data.payload.depth?.sell).toHaveLength(3);
      expect(validatedData.data.payload.depth?.sell[0]).toEqual({ price: 2501, quantity: 100 });
      expect(validatedData.data.payload.depth?.sell[1]).toEqual({ price: 2501.5, quantity: 200 });
      expect(validatedData.data.payload.depth?.sell[2]).toEqual({ price: 2502, quantity: 150 });

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
    const query = createGrowwQuoteQuery(TEST_SYMBOL, futureDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/quote?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Quote snapshot not found");
    expect(body.data).toBeNull();
  });

  test("should allow request with datetime < currentTimestamp when headers are present", async ({
    tracker,
  }) => {
    const testDatetime = generateUniqueTestDatetime();
    const testSymbol = TEST_SYMBOL;
    await createQuoteSnapshot(testSymbol, testDatetime, createValidGrowwQuotePayload(), tracker);

    // Create a run and set currentTimestamp to 1 hour after testDatetime
    const currentTimestamp = parseDateTimeInTimezone(testDatetime, "Asia/Kolkata");
    currentTimestamp.setHours(currentTimestamp.getHours() + 1);
    const run = await createRun(developerId, testDatetime, currentTimestamp.toISOString(), tracker);

    const query = createGrowwQuoteQuery(testSymbol, testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGetWithRunContext(
      `/v1/quote?${queryString}`,
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
    const testSymbol = TEST_SYMBOL;
    await createQuoteSnapshot(testSymbol, testDatetime, createValidGrowwQuotePayload(), tracker);

    const currentTimestamp = parseDateTimeInTimezone(testDatetime, "Asia/Kolkata");
    const run = await createRun(
      developerId,
      testDatetime,
      dayjs.tz(testDatetime, "Asia/Kolkata").add(1, "hour").format("YYYY-MM-DDTHH:mm:ss"),
      tracker
    );

    const query = createGrowwQuoteQuery(testSymbol, testDatetime);
    const queryString = buildQueryString(query);

    const response = await authenticatedGetWithRunContext(
      `/v1/quote?${queryString}`,
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
    const testSymbol = TEST_SYMBOL;
    await createQuoteSnapshot(testSymbol, testDatetime, createValidGrowwQuotePayload(), tracker);

    const currentTimestamp = parseDateTimeInTimezone(testDatetime, "Asia/Kolkata");
    currentTimestamp.setHours(currentTimestamp.getHours() - 1); // currentTimestamp is 1 hour before testDatetime
    const run = await createRun(developerId, testDatetime, currentTimestamp.toISOString(), tracker);

    const query = createGrowwQuoteQuery(testSymbol, testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGetWithRunContext(
      `/v1/quote?${queryString}`,
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
    const testSymbol = TEST_SYMBOL;
    await createQuoteSnapshot(testSymbol, testDatetime, createValidGrowwQuotePayload(), tracker);

    const query = createGrowwQuoteQuery(testSymbol, testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/quote?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
  });
});