import { v1_developer_groww_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { parseDateTimeInTimezone } from "../../../../../src/utils/timezone";
import {
  createGrowwQuoteQuery,
  createValidGrowwQuotePayload,
  generateUniqueTestDatetime,
  TEST_SYMBOL,
  buildQueryString,
} from "../../../../fixtures/test-data";
import { authenticatedGet, authenticatedGetWithRunContext } from "../../../../helpers/api-client";
import { createDeveloperUser } from "../../../../helpers/auth-helpers";
import { createQuoteSnapshot, createRun } from "../../../../helpers/db-helpers";
import { expect, test } from "../../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../../helpers/test-tracker";

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
  test("should return snapshot data when valid datetime and symbol are provided", async ({
    tracker,
  }) => {
    const testQuoteData = createValidGrowwQuotePayload();
    const testDatetime = generateUniqueTestDatetime();
    await createQuoteSnapshot(TEST_SYMBOL, testDatetime, testQuoteData, tracker);

    const query = createGrowwQuoteQuery(TEST_SYMBOL, testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/quote?${queryString}`, developerToken);

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
    }
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

  test("should allow request without headers (backward compatibility)", async ({ tracker }) => {
    const testDatetime = generateUniqueTestDatetime();
    const testSymbol = TEST_SYMBOL;
    await createQuoteSnapshot(testSymbol, testDatetime, createValidGrowwQuotePayload(), tracker);

    const query = createGrowwQuoteQuery(testSymbol, testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/quote?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
  });
});
