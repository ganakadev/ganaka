import { v1_developer_groww_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  createQuoteTimelineQuery,
  generateUniqueTestDate,
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
  createMultipleQuoteSnapshots,
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

test.describe("GET /v1/developer/quote-timeline", () => {
  test("should return 401 when authorization header is missing", async () => {
    const query = createQuoteTimelineQuery();
    const queryString = buildQueryString(query);
    const response = await unauthenticatedGet(`/v1/developer/quote-timeline?${queryString}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = createQuoteTimelineQuery();
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/quote-timeline?${queryString}`,
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when symbol is missing", async () => {
    const query = createQuoteTimelineQuery();
    const queryWithoutSymbol = {
      end_datetime: query.end_datetime,
    };
    const queryString = buildQueryString(queryWithoutSymbol);
    const response = await authenticatedGet(
      `/v1/developer/quote-timeline?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when end_datetime is missing", async () => {
    const query = createQuoteTimelineQuery();
    const queryWithoutEndDatetime = {
      symbol: query.symbol,
    };
    const queryString = buildQueryString(queryWithoutEndDatetime);
    const response = await authenticatedGet(
      `/v1/developer/quote-timeline?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return empty array when no snapshots exist", async () => {
    const futureDatetime = "2099-01-01T15:30:00";
    const query = createQuoteTimelineQuery(TEST_SYMBOL, futureDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/quote-timeline?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Quote timeline fetched successfully");
    expect(body.data.quoteTimeline).toBeInstanceOf(Array);
    expect(body.data.quoteTimeline.length).toBe(0);
  });

  test("should return timeline array for valid date with known symbol", async ({ tracker }) => {
    const testSymbol = TEST_SYMBOL;
    const testDate = generateUniqueTestDate();
    const testEndDatetime = `${testDate}T15:30:00`;
    const snapshotCount = 5;

    // Create multiple snapshots for the date
    await createMultipleQuoteSnapshots(testSymbol, testDate, snapshotCount, tracker);

    const query = createQuoteTimelineQuery(testSymbol, testEndDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/quote-timeline?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Quote timeline fetched successfully");

    // Validate response matches schema
    const validatedData = v1_developer_groww_schemas.getGrowwQuoteTimeline.response.parse(body);
    expect(validatedData.data.quoteTimeline).toBeInstanceOf(Array);
    expect(validatedData.data.quoteTimeline.length).toBeGreaterThanOrEqual(snapshotCount);

    // Validate each timeline entry structure (only first 6 entries)
    validatedData.data.quoteTimeline.slice(0, 6).forEach((entry, index) => {
      expect(entry).toHaveProperty("id");
      expect(entry).toHaveProperty("timestamp");
      expect(entry).toHaveProperty("nseSymbol");
      expect(entry).toHaveProperty("quoteData");
      expect(entry).toHaveProperty("createdAt");
      expect(entry).toHaveProperty("updatedAt");

      expect(entry.nseSymbol).toBe(testSymbol);

      // Validate quoteData structure
      expect(["SUCCESS", "FAILURE"]).toContain(entry.quoteData.status);
      expect(entry.quoteData.payload).toHaveProperty("ohlc");
      expect(entry.quoteData.payload).toHaveProperty("depth");
      expect(entry.quoteData.payload.ohlc).toHaveProperty("open");
      expect(entry.quoteData.payload.ohlc).toHaveProperty("high");
      expect(entry.quoteData.payload.ohlc).toHaveProperty("low");
      expect(entry.quoteData.payload.ohlc).toHaveProperty("close");
    });

    // Validate exact values for first 6 entries
    const timeline = validatedData.data.quoteTimeline;
    if (timeline.length >= 1) {
      // First entry
      expect(dayjs.utc(timeline[0].timestamp).format("YYYY-MM-DD")).toBe(testDate);
      expect(timeline[0].nseSymbol).toBe(testSymbol);
      expect(timeline[0].quoteData.status).toBe("SUCCESS");
      expect(timeline[0].quoteData.payload.ohlc?.low).toBe(2470);
      expect(timeline[0].quoteData.payload.ohlc?.high).toBe(2510);
      expect(timeline[0].quoteData.payload.ohlc?.open).toBe(2475);
      expect(timeline[0].quoteData.payload.ohlc?.close).toBe(2500);
      expect(timeline[0].quoteData.payload.depth?.buy).toEqual([{ price: 2500, quantity: 100 }]);
      expect(timeline[0].quoteData.payload.depth?.sell).toEqual([{ price: 2501, quantity: 100 }]);
    }

    // Validate timeline entries are ordered by timestamp (ascending)
    for (let i = 1; i < validatedData.data.quoteTimeline.length; i++) {
      const prevTimestamp = dayjs.utc(validatedData.data.quoteTimeline[i - 1].timestamp).valueOf();
      const currTimestamp = dayjs.utc(validatedData.data.quoteTimeline[i].timestamp).valueOf();
      expect(currTimestamp).toBeGreaterThanOrEqual(prevTimestamp);
    }
  });

  test("should allow request with end_datetime < currentTimestamp when headers are present", async ({
    tracker,
  }) => {
    const testDate = generateUniqueTestDate();
    const testSymbol = TEST_SYMBOL;
    const testEndDatetime = `${testDate}T15:30:00`;
    await createMultipleQuoteSnapshots(testSymbol, testDate, 3, tracker);

    // Set currentTimestamp to next day
    const currentTimestamp = dayjs
      .tz(`${testDate} 15:31:00`, "Asia/Kolkata")
      .add(1, "day")
      .toDate();
    const run = await createRun(
      developerId,
      `${testDate} 09:15:00`,
      currentTimestamp.toISOString(),
      tracker
    );

    const query = createQuoteTimelineQuery(testSymbol, testEndDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGetWithRunContext(
      `/v1/developer/quote-timeline?${queryString}`,
      developerToken,
      run.id,
      currentTimestamp
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
  });

  test("should return only snapshots before end_datetime", async ({ tracker }) => {
    const testDate = generateUniqueTestDate();
    const testSymbol = TEST_SYMBOL;
    const testEndDatetime = `${testDate}T11:30:00`;
    await createMultipleQuoteSnapshots(testSymbol, testDate, 10, tracker);

    const query = createQuoteTimelineQuery(testSymbol, testEndDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/quote-timeline?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Quote timeline fetched successfully");
    expect(body.data.quoteTimeline).toBeInstanceOf(Array);
    // Should return snapshots before 11:30:00
    expect(body.data.quoteTimeline.length).toBeLessThanOrEqual(3);
    // Verify all returned snapshots are before end_datetime
    body.data.quoteTimeline.forEach((entry) => {
      const entryTimestamp = dayjs.utc(entry.timestamp);
      const endTimestamp = dayjs.tz(testEndDatetime, "Asia/Kolkata").utc();
      expect(entryTimestamp.isBefore(endTimestamp)).toBe(true);
    });
  });

  test("should allow request without headers", async ({ tracker }) => {
    const testDate = generateUniqueTestDate();
    const testSymbol = TEST_SYMBOL;
    const testEndDatetime = `${testDate}T15:30:00`;
    await createMultipleQuoteSnapshots(testSymbol, testDate, 3, tracker);

    const query = createQuoteTimelineQuery(testSymbol, testEndDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/quote-timeline?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
  });

  test("should return 403 when end_datetime >= currentTimestamp", async ({ tracker }) => {
    const testDate = generateUniqueTestDate();
    const testSymbol = TEST_SYMBOL;
    const testEndDatetime = `${testDate}T15:30:00`;
    await createMultipleQuoteSnapshots(testSymbol, testDate, 3, tracker);

    // Set currentTimestamp before end_datetime
    const currentTimestamp = dayjs.tz(`${testDate} 14:00:00`, "Asia/Kolkata").toDate();
    const run = await createRun(
      developerId,
      `${testDate} 09:15:00`,
      currentTimestamp.toISOString(),
      tracker
    );

    const query = createQuoteTimelineQuery(testSymbol, testEndDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGetWithRunContext(
      `/v1/developer/quote-timeline?${queryString}`,
      developerToken,
      run.id,
      currentTimestamp,
      "Asia/Kolkata",
      { validateStatus: () => true }
    );

    expect(response.status).toBe(403);
    const body = response.data;
    expect(body.message).toContain("before current execution timestamp");
  });

  test("should work with timezone parameter", async ({ tracker }) => {
    const testDate = generateUniqueTestDate();
    const testSymbol = TEST_SYMBOL;
    const testEndDatetime = `${testDate}T15:30:00`;
    await createMultipleQuoteSnapshots(testSymbol, testDate, 3, tracker);

    const query = createQuoteTimelineQuery(testSymbol, testEndDatetime, "Asia/Kolkata");
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/quote-timeline?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Quote timeline fetched successfully");
    expect(body.data.quoteTimeline).toBeInstanceOf(Array);
  });
});