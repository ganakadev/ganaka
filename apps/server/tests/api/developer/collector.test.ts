import { test, expect } from "../../helpers/test-fixtures";
import {
  authenticatedGet,
  authenticatedPost,
  unauthenticatedGet,
  unauthenticatedPost,
} from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import {
  createCollectorQuotesRequest,
  createCollectorShortlistRequest,
  createCollectorNiftyRequest,
  createValidGrowwQuotePayload,
  buildQueryString,
} from "../../fixtures/test-data";
import { v1_developer_collector_schemas, v1_developer_lists_schemas } from "@ganaka/schemas";
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

/**
 * Helper function to query and track quote snapshots created at a specific timestamp
 * This is needed because createMany() doesn't return IDs, so we need to query by timestamp
 */
async function trackQuoteSnapshotsByTimestamp(
  timestamp: string,
  timezone: string,
  tracker: TestDataTracker,
  bufferSeconds: number = 5
): Promise<void> {
  const utcTimestamp = parseDateTimeInTimezone(timestamp, timezone);
  const bufferMs = bufferSeconds * 1000;

  const storedQuotes = await prisma.quoteSnapshot.findMany({
    where: {
      timestamp: {
        gte: dayjs.utc(utcTimestamp).subtract(bufferMs, "milliseconds").toDate(),
        lte: dayjs.utc(utcTimestamp).add(bufferMs, "milliseconds").toDate(),
      },
    },
  });

  storedQuotes.forEach((quote) => {
    tracker.trackQuoteSnapshot(quote.id);
  });
}

// ==================== POST /v1/developer/collector/lists ====================

test.describe("POST /v1/developer/collector/lists", () => {
  test("should return 401 when authorization header is missing", async () => {
    const requestBody = createCollectorShortlistRequest();
    const response = await unauthenticatedPost("/v1/developer/collector/lists", requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const requestBody = createCollectorShortlistRequest();
    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
      "invalid-token-12345",
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when data is missing", async () => {
    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
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
    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when shortlistType is missing", async () => {
    const requestBody = {
      data: {
        timestamp: "2025-12-31T09:15:00",
        entries: [],
      },
    };
    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when entries is missing", async () => {
    const requestBody = {
      data: {
        timestamp: "2025-12-31T09:15:00",
        shortlistType: "TOP_GAINERS",
      },
    };
    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when shortlistType is invalid", async () => {
    const requestBody = createCollectorShortlistRequest();
    requestBody.data.shortlistType = "INVALID_TYPE" as any;
    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when timestamp format is invalid", async () => {
    const requestBody = createCollectorShortlistRequest();
    requestBody.data.timestamp = "invalid-date";
    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 201 and create shortlist snapshot for TOP_GAINERS", async () => {
    const requestBody = createCollectorShortlistRequest("TOP_GAINERS");
    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
      developerToken,
      requestBody
    );

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
    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
      developerToken,
      requestBody
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.data.shortlistType).toBe("VOLUME_SHOCKERS");

    // Track shortlist snapshot for cleanup
    sharedTracker.trackShortlistSnapshot(body.data.id);
  });

  test("should return 201 with empty entries array", async () => {
    const requestBody = createCollectorShortlistRequest("TOP_GAINERS", []);
    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
      developerToken,
      requestBody
    );

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

    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
      developerToken,
      requestBody
    );
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

    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
      developerToken,
      requestBody
    );
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

// ==================== POST /v1/developer/collector/quotes ====================

test.describe("POST /v1/developer/collector/quotes", () => {
  test("should return 401 when authorization header is missing", async () => {
    const requestBody = createCollectorQuotesRequest();
    const response = await unauthenticatedPost("/v1/developer/collector/quotes", requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const requestBody = createCollectorQuotesRequest();
    const response = await authenticatedPost(
      "/v1/developer/collector/quotes",
      "invalid-token-12345",
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when data is missing", async () => {
    const response = await authenticatedPost(
      "/v1/developer/collector/quotes",
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
        quotes: [
          {
            nseSymbol: "RELIANCE",
            quoteData: createValidGrowwQuotePayload(),
          },
        ],
      },
    };
    const response = await authenticatedPost(
      "/v1/developer/collector/quotes",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when quotes is missing", async () => {
    const requestBody = {
      data: {
        timestamp: "2025-12-31T09:15:00",
        timezone: "Asia/Kolkata",
      },
    };
    const response = await authenticatedPost(
      "/v1/developer/collector/quotes",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

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

  test("should return 400 when timestamp format is invalid", async () => {
    const requestBody = createCollectorQuotesRequest();
    requestBody.data.timestamp = "invalid-date";
    const response = await authenticatedPost(
      "/v1/developer/collector/quotes",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
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
    const validatedData = v1_developer_collector_schemas.createQuoteSnapshots.response.parse(body);
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

  test("should return 201 with empty quotes array", async () => {
    const requestBody = createCollectorQuotesRequest([]);
    const response = await authenticatedPost(
      "/v1/developer/collector/quotes",
      developerToken,
      requestBody
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.data.count).toBe(0);
  });

  test("should convert Asia/Kolkata timezone to correct UTC time in database", async () => {
    const requestBody = createCollectorQuotesRequest();
    requestBody.data.timestamp = "2025-12-31T09:15:00"; // 9:15 AM IST
    requestBody.data.timezone = "Asia/Kolkata";

    const response = await authenticatedPost(
      "/v1/developer/collector/quotes",
      developerToken,
      requestBody
    );
    expect(response.status).toBe(201);

    // Verify the stored timestamps are converted to UTC (IST is UTC+5:30, so 9:15 AM IST = 3:45 AM UTC)
    const storedQuotes = await prisma.quoteSnapshot.findMany({
      where: {
        timestamp: {
          gte: dayjs.utc("2025-12-31T03:40:00").toDate(),
          lte: dayjs.utc("2025-12-31T03:50:00").toDate(),
        },
      },
    });

    expect(storedQuotes.length).toBeGreaterThan(0);
    storedQuotes.forEach((quote) => {
      expect(quote.timestamp.toISOString()).toBe("2025-12-31T03:45:00.000Z");
      // Track quote snapshots for cleanup
      sharedTracker.trackQuoteSnapshot(quote.id);
    });
  });

  test("should store UTC timezone unchanged in database", async () => {
    const uniqueTimestamp = "2025-12-31T14:30:00"; // Use a different time to avoid conflicts
    const requestBody = createCollectorQuotesRequest();
    requestBody.data.timestamp = uniqueTimestamp; // 2:30 PM UTC
    requestBody.data.timezone = "Etc/UTC";

    const response = await authenticatedPost(
      "/v1/developer/collector/quotes",
      developerToken,
      requestBody
    );
    expect(response.status).toBe(201);

    // Verify the stored timestamps remain the same (no conversion needed)
    const storedQuotes = await prisma.quoteSnapshot.findMany({
      where: {
        timestamp: {
          gte: dayjs.utc("2025-12-31T14:25:00").toDate(),
          lte: dayjs.utc("2025-12-31T14:35:00").toDate(),
        },
      },
    });

    expect(storedQuotes.length).toBeGreaterThan(0);
    storedQuotes.forEach((quote) => {
      expect(quote.timestamp.toISOString()).toBe("2025-12-31T14:30:00.000Z");
      // Track quote snapshots for cleanup
      sharedTracker.trackQuoteSnapshot(quote.id);
    });
  });
});

// ==================== POST /v1/developer/collector/nifty ====================

test.describe("POST /v1/developer/collector/nifty", () => {
  test("should return 401 when authorization header is missing", async () => {
    const requestBody = createCollectorNiftyRequest();
    const response = await unauthenticatedPost("/v1/developer/collector/nifty", requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const requestBody = createCollectorNiftyRequest();
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      "invalid-token-12345",
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when data is missing", async () => {
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
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
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when quoteData is missing", async () => {
    const requestBody = {
      data: {
        timestamp: "2025-12-31T09:15:00",
        dayChangePerc: 0.5,
      },
    };
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when dayChangePerc is missing", async () => {
    const requestBody = {
      data: {
        timestamp: "2025-12-31T09:15:00",
        quoteData: createValidGrowwQuotePayload(),
      },
    };
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should accept custom timezone parameter", async () => {
    const requestBody = createCollectorNiftyRequest();
    requestBody.data.timezone = "Asia/Kolkata";
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody
    );

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
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 201 and create NIFTY quote", async () => {
    const requestBody = createCollectorNiftyRequest();
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody
    );

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
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.data.dayChangePerc).toBe(-1.5);

    // Track NIFTY quote for cleanup
    sharedTracker.trackNiftyQuote(body.data.id);
  });

  test("should return 201 with zero dayChangePerc", async () => {
    const requestBody = createCollectorNiftyRequest(0);
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody
    );

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

    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody
    );
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

    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody
    );
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

// ==================== GET /v1/developer/collector/lists ====================

test.describe("GET /v1/developer/collector/lists", () => {
  test("should return 401 when authorization header is missing", async () => {
    const query = { type: "top-gainers" };
    const queryString = buildQueryString(query);
    const response = await unauthenticatedGet(`/v1/developer/collector/lists?${queryString}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = { type: "top-gainers" };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/collector/lists?${queryString}`,
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when type parameter is missing", async () => {
    const response = await authenticatedGet("/v1/developer/collector/lists", developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when type is invalid enum value", async () => {
    const query = { type: "invalid-type" };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/collector/lists?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when datetime format is invalid", async () => {
    const query = { type: "top-gainers", datetime: "invalid-datetime" };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/collector/lists?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return null data when snapshot is not found", async () => {
    const futureDatetime = "2099-01-01T10:30:00";
    const query = { type: "top-gainers", datetime: futureDatetime };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/collector/lists?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Shortlist snapshot not found");
    expect(body.data).toBeNull();
  });

  test("should return 200 with shortlist data when snapshot exists", async ({ tracker }) => {
    // Create a shortlist snapshot first
    const shortlistRequest = createCollectorShortlistRequest("TOP_GAINERS");
    const createResponse = await authenticatedPost(
      "/v1/developer/collector/lists",
      developerToken,
      shortlistRequest
    );
    const shortlistId = createResponse.data.data.id;
    tracker.trackShortlistSnapshot(shortlistId);

    // Fetch the shortlist
    const query = {
      type: "top-gainers",
      datetime: shortlistRequest.data.timestamp,
      timezone: shortlistRequest.data.timezone,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/collector/lists?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Lists fetched successfully");
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeGreaterThan(0);

    // Validate response matches schema
    const validatedData = v1_developer_lists_schemas.getLists.response.parse(body);
    expect(validatedData.data).toBeInstanceOf(Array);
  });

  test("should handle live fetch when no datetime is provided", async () => {
    // This test may fail if external API is unavailable, but structure validation should still work
    const query = { type: "top-gainers" };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/collector/lists?${queryString}`,
      developerToken
    );

    // Should return 200 with either data or empty array
    expect([200]).toContain(response.status);
    if (response.status === 200) {
      const body = response.data;
      expect(body.statusCode).toBe(200);
      expect(body.data).toBeInstanceOf(Array);
    }
  });
});
