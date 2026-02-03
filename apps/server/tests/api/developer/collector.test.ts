import { test, expect } from "../../helpers/test-fixtures";
import {
  authenticatedGet,
  authenticatedPost,
  unauthenticatedGet,
  unauthenticatedPost,
} from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import {
  createCollectorShortlistRequest,
  createCollectorNiftyRequest,
  createValidGrowwQuotePayload,
  buildQueryString,
} from "../../fixtures/test-data";
import { v1_lists_schemas } from "@ganaka/schemas";
import { TestDataTracker } from "../../helpers/test-tracker";
import { prisma } from "../../../src/utils/prisma";
import { parseDateTimeInTimezone } from "../../../src/utils/timezone";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

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

// ==================== POST /v1/lists ====================

test.describe("POST /v1/lists", () => {
  test("should return 401 when authorization header is missing", async () => {
    const requestBody = createCollectorShortlistRequest();
    const response = await unauthenticatedPost("/v1/lists", requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const requestBody = createCollectorShortlistRequest();
    const response = await authenticatedPost("/v1/lists", "invalid-token-12345", requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });

  test("should return 400 when data is missing", async () => {
    const response = await authenticatedPost(
      "/v1/lists",
      developerToken,
      {},
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when timestamp is missing", async () => {
    const requestBody = {
      data: {
        shortlistType: "TOP_GAINERS",
        entries: [],
      },
    };
    const response = await authenticatedPost("/v1/lists", developerToken, requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when shortlistType is missing", async () => {
    const requestBody = {
      data: {
        timestamp: "2025-12-31T09:15:00",
        entries: [],
      },
    };
    const response = await authenticatedPost("/v1/lists", developerToken, requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when entries is missing", async () => {
    const requestBody = {
      data: {
        timestamp: "2025-12-31T09:15:00",
        shortlistType: "TOP_GAINERS",
      },
    };
    const response = await authenticatedPost("/v1/lists", developerToken, requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when shortlistType is invalid", async () => {
    const requestBody = createCollectorShortlistRequest();
    requestBody.data.shortlistType = "INVALID_TYPE" as any;
    const response = await authenticatedPost("/v1/lists", developerToken, requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when timestamp format is invalid", async () => {
    const requestBody = createCollectorShortlistRequest();
    requestBody.data.timestamp = "invalid-date";
    const response = await authenticatedPost("/v1/lists", developerToken, requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

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

  test("should return 201 with empty entries array", async () => {
    const requestBody = createCollectorShortlistRequest("TOP_GAINERS", []);
    const response = await authenticatedPost("/v1/lists", developerToken, requestBody);

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.data.entriesCount).toBe(0);

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

// ==================== POST /v1/nifty ====================

test.describe("POST /v1/nifty", () => {
  test("should return 401 when authorization header is missing", async () => {
    const requestBody = createCollectorNiftyRequest();
    const response = await unauthenticatedPost("/v1/nifty", requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const requestBody = createCollectorNiftyRequest();
    const response = await authenticatedPost("/v1/nifty", "invalid-token-12345", requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });

  test("should return 400 when data is missing", async () => {
    const response = await authenticatedPost(
      "/v1/nifty",
      developerToken,
      {},
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when timestamp is missing", async () => {
    const requestBody = {
      data: {
        quoteData: createValidGrowwQuotePayload(),
        dayChangePerc: 0.5,
      },
    };
    const response = await authenticatedPost("/v1/nifty", developerToken, requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when quoteData is missing", async () => {
    const requestBody = {
      data: {
        timestamp: "2025-12-31T09:15:00",
        dayChangePerc: 0.5,
      },
    };
    const response = await authenticatedPost("/v1/nifty", developerToken, requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when dayChangePerc is missing", async () => {
    const requestBody = {
      data: {
        timestamp: "2025-12-31T09:15:00",
        quoteData: createValidGrowwQuotePayload(),
      },
    };
    const response = await authenticatedPost("/v1/nifty", developerToken, requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should accept custom timezone parameter", async () => {
    const requestBody = createCollectorNiftyRequest();
    requestBody.data.timezone = "Asia/Kolkata";
    const response = await authenticatedPost("/v1/nifty", developerToken, requestBody);

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.data).toHaveProperty("id");
    expect(body.data).toHaveProperty("timestamp");
    expect(body.data).toHaveProperty("dayChangePerc");

    // Track NIFTY quote for cleanup
    sharedTracker.trackNiftyQuote(body.data.id);
  });

  test("should return 400 when timestamp format is invalid", async () => {
    const requestBody = createCollectorNiftyRequest();
    requestBody.data.timestamp = "invalid-date";
    const response = await authenticatedPost("/v1/nifty", developerToken, requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 201 and create NIFTY quote", async () => {
    const requestBody = createCollectorNiftyRequest();
    const response = await authenticatedPost("/v1/nifty", developerToken, requestBody);

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.message).toBe("NIFTY quote created successfully");
    expect(body.data).toHaveProperty("id");
    expect(body.data).toHaveProperty("timestamp");
    expect(body.data).toHaveProperty("dayChangePerc");
    expect(body.data.dayChangePerc).toBe(0.5);

    // Track NIFTY quote for cleanup
    sharedTracker.trackNiftyQuote(body.data.id);
  });

  test("should return 201 with negative dayChangePerc", async () => {
    const requestBody = createCollectorNiftyRequest(-1.5);
    const response = await authenticatedPost("/v1/nifty", developerToken, requestBody);

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.data.dayChangePerc).toBe(-1.5);

    // Track NIFTY quote for cleanup
    sharedTracker.trackNiftyQuote(body.data.id);
  });

  test("should return 201 with zero dayChangePerc", async () => {
    const requestBody = createCollectorNiftyRequest(0);
    const response = await authenticatedPost("/v1/nifty", developerToken, requestBody);

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.data.dayChangePerc).toBe(0);

    // Track NIFTY quote for cleanup
    sharedTracker.trackNiftyQuote(body.data.id);
  });

  test("should convert Asia/Kolkata timezone to correct UTC time in database", async () => {
    const requestBody = createCollectorNiftyRequest();
    requestBody.data.timestamp = "2025-12-31T09:15:00"; // 9:15 AM IST
    requestBody.data.timezone = "Asia/Kolkata";

    const response = await authenticatedPost("/v1/nifty", developerToken, requestBody);
    expect(response.status).toBe(201);

    // Verify the stored timestamp is converted to UTC (IST is UTC+5:30, so 9:15 AM IST = 3:45 AM UTC)
    const niftyQuote = await prisma.niftyQuote.findUnique({
      where: { id: response.data.data.id },
    });

    expect(niftyQuote).not.toBeNull();
    if (niftyQuote) {
      expect(niftyQuote.timestamp.toISOString()).toBe("2025-12-31T03:45:00.000Z");
      sharedTracker.trackNiftyQuote(niftyQuote.id);
    }
  });

  test("should store UTC timezone unchanged in database", async () => {
    const uniqueTimestamp = "2025-12-31T14:30:00"; // Use a different time to avoid conflicts
    const requestBody = createCollectorNiftyRequest();
    requestBody.data.timestamp = uniqueTimestamp; // 2:30 PM UTC
    requestBody.data.timezone = "Etc/UTC";

    const response = await authenticatedPost("/v1/nifty", developerToken, requestBody);
    expect(response.status).toBe(201);

    // Verify the stored timestamp remains the same (no conversion needed)
    const niftyQuote = await prisma.niftyQuote.findUnique({
      where: { id: response.data.data.id },
    });

    expect(niftyQuote).not.toBeNull();
    if (niftyQuote) {
      expect(niftyQuote.timestamp.toISOString()).toBe("2025-12-31T14:30:00.000Z");
      sharedTracker.trackNiftyQuote(niftyQuote.id);
    }
  });
});

// ==================== GET /v1/lists ====================

test.describe("GET /v1/lists", () => {
  test("should return 401 when authorization header is missing", async () => {
    const query = { type: "top-gainers" };
    const queryString = buildQueryString(query);
    const response = await unauthenticatedGet(`/v1/lists?${queryString}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = { type: "top-gainers" };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/lists?${queryString}`, "invalid-token-12345", {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });

  test("should return 400 when type parameter is missing", async () => {
    const response = await authenticatedGet("/v1/lists", developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when type is invalid enum value", async () => {
    const query = { type: "invalid-type" };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/lists?${queryString}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when datetime format is invalid", async () => {
    const query = { type: "top-gainers", datetime: "invalid-datetime" };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/lists?${queryString}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return null data when snapshot is not found", async () => {
    const futureDatetime = "2099-01-01T10:30:00";
    const query = { type: "top-gainers", datetime: futureDatetime };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/lists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Shortlist snapshot not found");
    expect(body.data).toBeNull();
  });

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
