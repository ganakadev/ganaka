import { test, expect } from "../../../helpers/test-fixtures";
import { authenticatedPost, unauthenticatedPost } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import {
  createCollectorQuotesRequest,
  createValidGrowwQuotePayload,
} from "../../../fixtures/test-data";
import { v1_developer_collector_schemas } from "@ganaka/schemas";
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
        timezone: "UTC",
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
    expect(body.data.timestamp).toBe("2025-12-31T09:15:00.000Z");

    // Validate response matches schema
    const validatedData = v1_developer_collector_schemas.createQuoteSnapshots.response.parse(body);
    expect(validatedData.data.count).toBe(2);
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
          gte: new Date("2025-12-31T03:40:00.000Z"),
          lte: new Date("2025-12-31T03:50:00.000Z"),
        },
      },
    });

    expect(storedQuotes.length).toBeGreaterThan(0);
    storedQuotes.forEach((quote) => {
      expect(quote.timestamp.toISOString()).toBe("2025-12-31T03:45:00.000Z");
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
          gte: new Date("2025-12-31T14:25:00.000Z"),
          lte: new Date("2025-12-31T14:35:00.000Z"),
        },
      },
    });

    expect(storedQuotes.length).toBeGreaterThan(0);
    storedQuotes.forEach((quote) => {
      expect(quote.timestamp.toISOString()).toBe("2025-12-31T14:30:00.000Z");
    });
  });
});
