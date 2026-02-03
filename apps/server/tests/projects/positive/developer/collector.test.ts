import { test, expect } from "../../../helpers/test-fixtures";
import { authenticatedPost, authenticatedGet } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import {
  createCollectorQuotesRequest,
  createCollectorShortlistRequest,
  buildQueryString,
} from "../../../fixtures/test-data";
import { v1_schemas, v1_lists_schemas } from "@ganaka/schemas";
import { TestDataTracker } from "../../../helpers/test-tracker";
import { prisma } from "../../../../src/utils/prisma";

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

async function trackQuoteSnapshotsByTimestamp(
  timestamp: string,
  timezone: string,
  tracker: TestDataTracker,
  bufferSeconds: number = 5
) {
  const { parseDateTimeInTimezone } = await import("../../../../src/utils/timezone");
  const parsedTime = parseDateTimeInTimezone(timestamp, timezone);
  const startTime = new Date(parsedTime.getTime() - bufferSeconds * 1000);
  const endTime = new Date(parsedTime.getTime() + bufferSeconds * 1000);

  const snapshots = await prisma.quoteSnapshot.findMany({
    where: {
      timestamp: {
        gte: startTime,
        lte: endTime,
      },
    },
  });

  snapshots.forEach((snapshot) => {
    tracker.trackQuoteSnapshot(snapshot.id);
  });
}

test.describe("POST /v1/lists", () => {
  test("should return 201 and create shortlist snapshot for TOP_GAINERS", async () => {
    const requestBody = createCollectorShortlistRequest("TOP_GAINERS");
    const response = await authenticatedPost("/v1/lists", developerToken, requestBody);

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.message).toBe("Shortlist snapshot created successfully");
    expect(body.data).toHaveProperty("id");
    expect(body.data).toHaveProperty("timestamp");
    expect(body.data.shortlistType).toBe("TOP_GAINERS");
    expect(body.data.entriesCount).toBe(5);

    // Track shortlist snapshot for cleanup
    sharedTracker.trackShortlistSnapshot(body.data.id);
  });

  test("should return 201 and create shortlist snapshot for VOLUME_SHOCKERS", async () => {
    const requestBody = createCollectorShortlistRequest("VOLUME_SHOCKERS");
    const response = await authenticatedPost("/v1/lists", developerToken, requestBody);

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.data.shortlistType).toBe("VOLUME_SHOCKERS");

    // Track shortlist snapshot for cleanup
    sharedTracker.trackShortlistSnapshot(body.data.id);
  });

  test("should convert Asia/Kolkata timezone to correct UTC time in database", async () => {
    const requestBody = createCollectorShortlistRequest();
    requestBody.data.timestamp = "2025-12-31T09:15:00"; // 9:15 AM IST
    requestBody.data.timezone = "Asia/Kolkata";

    const response = await authenticatedPost("/v1/lists", developerToken, requestBody);
    expect(response.status).toBe(201);

    // Verify the stored timestamp is converted to UTC (IST is UTC+5:30, so 9:15 AM IST = 3:45 AM UTC)
    const shortlist = await prisma.shortlistSnapshot.findUnique({
      where: { id: response.data.data.id },
    });

    expect(shortlist).not.toBeNull();
    if (shortlist) {
      expect(shortlist.timestamp.toISOString()).toBe("2025-12-31T03:45:00.000Z");
      sharedTracker.trackShortlistSnapshot(shortlist.id);
    }
  });

  test("should store UTC timezone unchanged in database", async () => {
    const uniqueTimestamp = "2025-12-31T14:30:00"; // Use a different time to avoid conflicts
    const requestBody = createCollectorShortlistRequest();
    requestBody.data.timestamp = uniqueTimestamp; // 2:30 PM UTC
    requestBody.data.timezone = "Etc/UTC";

    const response = await authenticatedPost("/v1/lists", developerToken, requestBody);
    expect(response.status).toBe(201);

    // Verify the stored timestamp remains the same (no conversion needed)
    const shortlist = await prisma.shortlistSnapshot.findUnique({
      where: { id: response.data.data.id },
    });

    expect(shortlist).not.toBeNull();
    if (shortlist) {
      expect(shortlist.timestamp.toISOString()).toBe("2025-12-31T14:30:00.000Z");
      sharedTracker.trackShortlistSnapshot(shortlist.id);
    }
  });
});

test.describe("POST /v1/developer/collector/quotes", () => {
  test("should accept custom timezone parameter", async () => {
    const requestBody = createCollectorQuotesRequest();
    requestBody.data.timezone = "Asia/Kolkata";
    const response = await authenticatedPost(
      "/v1/developer/collector/quotes",
      developerToken,
      requestBody
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.data.count).toBe(2);

    // Track quote snapshots for cleanup
    await trackQuoteSnapshotsByTimestamp(
      requestBody.data.timestamp,
      requestBody.data.timezone,
      sharedTracker
    );
  });

  test("should return 201 and create quote snapshots", async () => {
    const requestBody = createCollectorQuotesRequest();
    const response = await authenticatedPost(
      "/v1/developer/collector/quotes",
      developerToken,
      requestBody
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.message).toBe("Quote snapshots created successfully");
    expect(body.data.count).toBe(2);
    expect(body.data.timestamp).toBe("2025-12-26T10:06:00");

    // Validate response matches schema
    const validatedData = v1_schemas.createQuoteSnapshots.response.parse(body);
    expect(validatedData.data.count).toBe(2);

    // Track quote snapshots for cleanup
    await trackQuoteSnapshotsByTimestamp(
      requestBody.data.timestamp,
      requestBody.data.timezone || "Asia/Kolkata",
      sharedTracker
    );
  });

  test("should return 201 with single quote", async () => {
    const quotes = [
      {
        nseSymbol: "RELIANCE",
        quoteData: createValidGrowwQuotePayload(),
      },
    ];
    const requestBody = createCollectorQuotesRequest(quotes);
    const response = await authenticatedPost(
      "/v1/developer/collector/quotes",
      developerToken,
      requestBody
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.data.count).toBe(1);

    // Track quote snapshots for cleanup
    await trackQuoteSnapshotsByTimestamp(
      requestBody.data.timestamp,
      requestBody.data.timezone || "Asia/Kolkata",
      sharedTracker
    );
  });
});

test.describe("GET /v1/lists", () => {
  test("should return 200 with shortlist data when snapshot exists", async ({ tracker }) => {
    // Create a shortlist snapshot first
    const shortlistRequest = createCollectorShortlistRequest("TOP_GAINERS");
    const createResponse = await authenticatedPost("/v1/lists", developerToken, shortlistRequest);
    const shortlistId = createResponse.data.data.id;
    tracker.trackShortlistSnapshot(shortlistId);

    // Fetch the shortlist
    const query = {
      type: "top-gainers",
      datetime: shortlistRequest.data.timestamp,
      timezone: shortlistRequest.data.timezone,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/lists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Lists fetched successfully");
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeGreaterThan(0);

    // Validate response matches schema
    const validatedData = v1_lists_schemas.getLists.response.parse(body);
    expect(validatedData.data).toBeInstanceOf(Array);
  });

  test("should handle live fetch when no datetime is provided", async () => {
    // This test may fail if external API is unavailable, but structure validation should still work
    const query = { type: "top-gainers" };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/lists?${queryString}`, developerToken);

    // Should return 200 with either data or empty array
    expect([200]).toContain(response.status);
    if (response.status === 200) {
      const body = response.data;
      expect(body.statusCode).toBe(200);
      expect(body.data).toBeInstanceOf(Array);
    }
  });
});
