import { v1_developer_groww_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { parseDateTimeInTimezone } from "../../../../src/utils/timezone";
import {
  createGrowwNiftyQuoteQuery,
  createValidGrowwQuotePayload,
  generateUniqueTestDatetime,
} from "../../../fixtures/test-data";
import { authenticatedGet, authenticatedGetWithRunContext } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { createNiftyQuoteSnapshot, createRun } from "../../../helpers/db-helpers";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";

dayjs.extend(utc);
dayjs.extend(timezone);

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

test.describe("GET /v1/developer/nifty", () => {
  test("should return snapshot data when valid datetime is provided", async ({ tracker }) => {
    const testQuoteData = createValidGrowwQuotePayload();
    const testDatetime = generateUniqueTestDatetime();
    await createNiftyQuoteSnapshot(testDatetime, testQuoteData, tracker);

    const query = createGrowwNiftyQuoteQuery(testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/developer/nifty?${queryString}`, developerToken);

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
    }
  });

  test("should handle multiple snapshots in same minute window (return most recent)", async ({
    tracker,
  }) => {
    // Use a fixed datetime for this test to ensure snapshots are within the same minute window
    const baseDatetime = "2025-12-26T12:00:00"; // Fixed datetime for this specific test
    const testQuoteData1 = createValidGrowwQuotePayload();
    const testQuoteData2 = createValidGrowwQuotePayload();
    testQuoteData2.payload.last_price = 2600.0; // Different price to distinguish

    // Create two snapshots within the same minute window
    await createNiftyQuoteSnapshot(
      baseDatetime, // First snapshot at exact minute
      testQuoteData1,
      tracker
    );
    await createNiftyQuoteSnapshot(
      dayjs.tz(baseDatetime, "Asia/Kolkata").add(30, "seconds").format("YYYY-MM-DDTHH:mm:ss"), // 30 seconds later, same minute
      testQuoteData2,
      tracker
    );

    const query = createGrowwNiftyQuoteQuery(baseDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/developer/nifty?${queryString}`, developerToken);

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
      `/v1/developer/nifty?${queryString}`,
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
    await createNiftyQuoteSnapshot(testDatetime, createValidGrowwQuotePayload(), tracker);

    const query = createGrowwNiftyQuoteQuery(testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/developer/nifty?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
  });
});
