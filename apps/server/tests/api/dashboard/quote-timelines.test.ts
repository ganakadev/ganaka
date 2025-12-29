import { test, expect } from "@playwright/test";
import { authenticatedGet, unauthenticatedGet } from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import { createMultipleQuoteSnapshots, createQuoteSnapshot } from "../../helpers/db-helpers";
import {
  createValidGrowwQuotePayload,
  TEST_DATE,
  TEST_SYMBOL,
  createQuoteTimelineQueryForDashboard,
} from "../../fixtures/test-data";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

let developerToken: string;

test.beforeAll(async () => {
  const dev = await createDeveloperUser();
  developerToken = dev.token;
});

test.describe("GET /v1/dashboard/quote-timelines", () => {
  test("should return 401 when authorization header is missing", async () => {
    const query = createQuoteTimelineQueryForDashboard();
    const queryString = new URLSearchParams(query).toString();
    const response = await unauthenticatedGet(`/v1/dashboard/quote-timelines?${queryString}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = createQuoteTimelineQueryForDashboard();
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/quote-timelines?${queryString}`,
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when symbol is missing", async () => {
    const query = { date: TEST_DATE };
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/quote-timelines?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when date is missing", async () => {
    const query = { symbol: TEST_SYMBOL };
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/quote-timelines?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when date format is invalid", async () => {
    const query = createQuoteTimelineQueryForDashboard(TEST_SYMBOL, "invalid-date");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/quote-timelines?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 200 with empty array when no snapshots exist", async () => {
    const futureDate = "2099-01-01";
    const query = createQuoteTimelineQueryForDashboard(TEST_SYMBOL, futureDate);
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/quote-timelines?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Quote snapshots fetched successfully");
    expect(body.data.quoteTimeline).toBeInstanceOf(Array);
    expect(body.data.quoteTimeline.length).toBe(0);
  });

  test("should return 200 with quote timeline when valid params provided", async () => {
    const snapshotCount = 3;
    await createMultipleQuoteSnapshots(TEST_SYMBOL, TEST_DATE, snapshotCount);

    const query = createQuoteTimelineQueryForDashboard(TEST_SYMBOL, TEST_DATE);
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/quote-timelines?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Quote snapshots fetched successfully");
    expect(body.data.quoteTimeline).toBeInstanceOf(Array);
    expect(body.data.quoteTimeline.length).toBeGreaterThanOrEqual(snapshotCount);
  });

  test("should validate timeline entries structure (id, timestamp, nseSymbol, quoteData, createdAt, updatedAt)", async () => {
    await createMultipleQuoteSnapshots(TEST_SYMBOL, TEST_DATE, 2);

    const query = createQuoteTimelineQueryForDashboard(TEST_SYMBOL, TEST_DATE);
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/quote-timelines?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_quote_timeline_schemas.getQuoteTimeline.response.parse(
        response.data
      );

    if (validatedData.data.quoteTimeline.length > 0) {
      const firstEntry = validatedData.data.quoteTimeline[0];
      expect(firstEntry).toHaveProperty("id");
      expect(firstEntry).toHaveProperty("timestamp");
      expect(firstEntry).toHaveProperty("nseSymbol");
      expect(firstEntry).toHaveProperty("quoteData");
      expect(firstEntry).toHaveProperty("createdAt");
      expect(firstEntry).toHaveProperty("updatedAt");
      expect(typeof firstEntry.id).toBe("string");
      expect(typeof firstEntry.nseSymbol).toBe("string");
    }
  });

  test("should validate quoteData structure matches schema", async () => {
    await createMultipleQuoteSnapshots(TEST_SYMBOL, TEST_DATE, 2);

    const query = createQuoteTimelineQueryForDashboard(TEST_SYMBOL, TEST_DATE);
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/quote-timelines?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_quote_timeline_schemas.getQuoteTimeline.response.parse(
        response.data
      );

    if (validatedData.data.quoteTimeline.length > 0) {
      const firstEntry = validatedData.data.quoteTimeline[0];
      expect(firstEntry.quoteData).toHaveProperty("status");
      expect(firstEntry.quoteData).toHaveProperty("payload");
      expect(["SUCCESS", "FAILURE"]).toContain(firstEntry.quoteData.status);
      expect(firstEntry.quoteData.payload).toHaveProperty("ohlc");
      expect(firstEntry.quoteData.payload).toHaveProperty("depth");
    }
  });

  test("should validate timeline entries are ordered by timestamp ascending", async () => {
    await createMultipleQuoteSnapshots(TEST_SYMBOL, TEST_DATE, 5);

    const query = createQuoteTimelineQueryForDashboard(TEST_SYMBOL, TEST_DATE);
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/quote-timelines?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_quote_timeline_schemas.getQuoteTimeline.response.parse(
        response.data
      );

    // Validate entries are ordered by timestamp ascending
    for (let i = 1; i < validatedData.data.quoteTimeline.length; i++) {
      const prevTimestamp = dayjs(validatedData.data.quoteTimeline[i - 1].timestamp).valueOf();
      const currTimestamp = dayjs(validatedData.data.quoteTimeline[i].timestamp).valueOf();
      expect(currTimestamp).toBeGreaterThanOrEqual(prevTimestamp);
    }
  });

  test("should validate timestamps are within market hours (9:14 AM - 3:31 PM IST)", async () => {
    await createMultipleQuoteSnapshots(TEST_SYMBOL, TEST_DATE, 3);

    const query = createQuoteTimelineQueryForDashboard(TEST_SYMBOL, TEST_DATE);
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/quote-timelines?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_quote_timeline_schemas.getQuoteTimeline.response.parse(
        response.data
      );

    // Market hours: 9:14 AM - 3:31 PM IST
    const marketStart = dayjs.tz(`${TEST_DATE} 09:14:00`, "Asia/Kolkata").utc();
    const marketEnd = dayjs.tz(`${TEST_DATE} 15:31:00`, "Asia/Kolkata").utc();

    validatedData.data.quoteTimeline.forEach((entry) => {
      const entryTime = dayjs(entry.timestamp);
      expect(entryTime.isAfter(marketStart) || entryTime.isSame(marketStart)).toBe(true);
      expect(entryTime.isBefore(marketEnd) || entryTime.isSame(marketEnd)).toBe(true);
    });
  });

  test("should validate exact timestamp values (placeholder for user to fill)", async () => {
    await createMultipleQuoteSnapshots(TEST_SYMBOL, TEST_DATE, 2);

    const query = createQuoteTimelineQueryForDashboard(TEST_SYMBOL, TEST_DATE);
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/quote-timelines?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_quote_timeline_schemas.getQuoteTimeline.response.parse(
        response.data
      );

    if (validatedData.data.quoteTimeline.length > 0) {
      const firstEntry = validatedData.data.quoteTimeline[0];
      expect(firstEntry).toHaveProperty("timestamp");
      expect(firstEntry).toHaveProperty("nseSymbol");

      expect(new Date(firstEntry.timestamp).toISOString()).toBe(
        new Date("2025-12-26T03:51:04.520Z").toISOString()
      );
      expect(firstEntry.nseSymbol).toBe("RELIANCE");
    }
  });

  test("should validate exact quoteData values (placeholder for user to fill)", async () => {
    const testQuoteData = createValidGrowwQuotePayload();
    await createQuoteSnapshot(TEST_SYMBOL, `${TEST_DATE}T10:06:00`, testQuoteData);

    const query = createQuoteTimelineQueryForDashboard(TEST_SYMBOL, TEST_DATE);
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/quote-timelines?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_quote_timeline_schemas.getQuoteTimeline.response.parse(
        response.data
      );

    if (validatedData.data.quoteTimeline.length > 0) {
      const firstEntry = validatedData.data.quoteTimeline[0];
      expect(firstEntry.quoteData).toHaveProperty("status");
      expect(firstEntry.quoteData).toHaveProperty("payload");

      expect(firstEntry.quoteData.status).toBe("SUCCESS");
      expect(firstEntry.quoteData.payload.ohlc.open).toBe(2475.0);
      expect(firstEntry.quoteData.payload.ohlc.high).toBe(2510.0);
      expect(firstEntry.quoteData.payload.ohlc.low).toBe(2470.0);
      expect(firstEntry.quoteData.payload.ohlc.close).toBe(2500.0);
    }
  });
});
