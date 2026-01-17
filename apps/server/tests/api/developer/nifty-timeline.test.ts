import { v1_developer_groww_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  createNiftyQuoteTimelineQuery,
  generateUniqueTestDate,
  buildQueryString,
} from "../../fixtures/test-data";
import {
  authenticatedGet,
  authenticatedGetWithRunContext,
  unauthenticatedGet,
} from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import {
  createMultipleNiftyQuoteSnapshots,
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

test.describe("GET /v1/developer/nifty-timeline", () => {
  test("should return 401 when authorization header is missing", async () => {
    const query = createNiftyQuoteTimelineQuery();
    const queryString = buildQueryString(query);
    const response = await unauthenticatedGet(`/v1/developer/nifty-timeline?${queryString}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = createNiftyQuoteTimelineQuery();
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/nifty-timeline?${queryString}`,
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when end_datetime is missing", async () => {
    const queryWithoutEndDatetime = {};
    const queryString = buildQueryString(queryWithoutEndDatetime);
    const response = await authenticatedGet(
      `/v1/developer/nifty-timeline?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return empty array when no snapshots exist", async () => {
    const futureDatetime = "2099-01-01T15:30:00";
    const query = createNiftyQuoteTimelineQuery(futureDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/nifty-timeline?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("NIFTY timeline fetched successfully");
    expect(body.data.niftyTimeline).toBeInstanceOf(Array);
    expect(body.data.niftyTimeline.length).toBe(0);
  });

  test("should return timeline array for valid date with multiple snapshots", async ({ tracker }) => {
    const testDate = generateUniqueTestDate();
    const testEndDatetime = `${testDate}T15:30:00`;
    const snapshotCount = 5;

    // Create multiple snapshots for the date
    await createMultipleNiftyQuoteSnapshots(testDate, snapshotCount, tracker);

    const query = createNiftyQuoteTimelineQuery(testEndDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/nifty-timeline?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("NIFTY timeline fetched successfully");

    // Validate response matches schema
    const validatedData = v1_developer_groww_schemas.getGrowwNiftyQuoteTimeline.response.parse(body);
    expect(validatedData.data.niftyTimeline).toBeInstanceOf(Array);
    expect(validatedData.data.niftyTimeline.length).toBeGreaterThanOrEqual(snapshotCount);

    // Validate each timeline entry structure (only first 6 entries)
    validatedData.data.niftyTimeline.slice(0, 6).forEach((entry, index) => {
      expect(entry).toHaveProperty("id");
      expect(entry).toHaveProperty("timestamp");
      expect(entry).toHaveProperty("quoteData");
      expect(entry).toHaveProperty("createdAt");
      expect(entry).toHaveProperty("updatedAt");

      // Validate quoteData structure
      expect(["SUCCESS", "FAILURE"]).toContain(entry.quoteData.status);
      expect(entry.quoteData.payload).toHaveProperty("ohlc");
      expect(entry.quoteData.payload).toHaveProperty("depth");
      expect(entry.quoteData.payload.ohlc).toHaveProperty("open");
      expect(entry.quoteData.payload.ohlc).toHaveProperty("high");
      expect(entry.quoteData.payload.ohlc).toHaveProperty("low");
      expect(entry.quoteData.payload.ohlc).toHaveProperty("close");
    });

    // Validate exact values for first entry
    const timeline = validatedData.data.niftyTimeline;
    if (timeline.length >= 1) {
      expect(dayjs.utc(timeline[0].timestamp).format("YYYY-MM-DD")).toBe(testDate);
      expect(timeline[0].quoteData.status).toBe("SUCCESS");
      expect(timeline[0].quoteData.payload.ohlc?.low).toBe(23700);
      expect(timeline[0].quoteData.payload.ohlc?.high).toBe(24100);
      expect(timeline[0].quoteData.payload.ohlc?.open).toBe(23750);
      expect(timeline[0].quoteData.payload.ohlc?.close).toBe(24000);
      expect(timeline[0].quoteData.payload.depth?.buy).toEqual([{ price: 24000, quantity: 1000 }]);
      expect(timeline[0].quoteData.payload.depth?.sell).toEqual([{ price: 24001, quantity: 1000 }]);
    }

    // Validate timeline entries are ordered by timestamp (ascending)
    for (let i = 1; i < validatedData.data.niftyTimeline.length; i++) {
      const prevTimestamp = dayjs.utc(validatedData.data.niftyTimeline[i - 1].timestamp).valueOf();
      const currTimestamp = dayjs.utc(validatedData.data.niftyTimeline[i].timestamp).valueOf();
      expect(currTimestamp).toBeGreaterThanOrEqual(prevTimestamp);
    }
  });

  test("should allow request with end_datetime < currentTimestamp when headers are present", async ({
    tracker,
  }) => {
    const testDate = generateUniqueTestDate();
    const testEndDatetime = `${testDate}T15:30:00`;
    await createMultipleNiftyQuoteSnapshots(testDate, 3, tracker);

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

    const query = createNiftyQuoteTimelineQuery(testEndDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGetWithRunContext(
      `/v1/developer/nifty-timeline?${queryString}`,
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
    const testEndDatetime = `${testDate}T11:30:00`;
    await createMultipleNiftyQuoteSnapshots(testDate, 10, tracker);

    const query = createNiftyQuoteTimelineQuery(testEndDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/nifty-timeline?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("NIFTY timeline fetched successfully");
    expect(body.data.niftyTimeline).toBeInstanceOf(Array);
    // Should return snapshots before 11:30:00
    expect(body.data.niftyTimeline.length).toBeLessThanOrEqual(3);
    // Verify all returned snapshots are before end_datetime
    body.data.niftyTimeline.forEach((entry) => {
      const entryTimestamp = dayjs.utc(entry.timestamp);
      const endTimestamp = dayjs.tz(testEndDatetime, "Asia/Kolkata").utc();
      expect(entryTimestamp.isBefore(endTimestamp)).toBe(true);
    });
  });

  test("should allow request without headers", async ({ tracker }) => {
    const testDate = generateUniqueTestDate();
    const testEndDatetime = `${testDate}T15:30:00`;
    await createMultipleNiftyQuoteSnapshots(testDate, 3, tracker);

    const query = createNiftyQuoteTimelineQuery(testEndDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/nifty-timeline?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
  });

  test("should return 403 when end_datetime >= currentTimestamp", async ({ tracker }) => {
    const testDate = generateUniqueTestDate();
    const testEndDatetime = `${testDate}T15:30:00`;
    await createMultipleNiftyQuoteSnapshots(testDate, 3, tracker);

    // Set currentTimestamp before end_datetime
    const currentTimestamp = dayjs.tz(`${testDate} 14:00:00`, "Asia/Kolkata").toDate();
    const run = await createRun(
      developerId,
      `${testDate} 09:15:00`,
      currentTimestamp.toISOString(),
      tracker
    );

    const query = createNiftyQuoteTimelineQuery(testEndDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGetWithRunContext(
      `/v1/developer/nifty-timeline?${queryString}`,
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
    const testEndDatetime = `${testDate}T15:30:00`;
    await createMultipleNiftyQuoteSnapshots(testDate, 3, tracker);

    const query = createNiftyQuoteTimelineQuery(testEndDatetime, "Asia/Kolkata");
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/nifty-timeline?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("NIFTY timeline fetched successfully");
    expect(body.data.niftyTimeline).toBeInstanceOf(Array);
  });
});