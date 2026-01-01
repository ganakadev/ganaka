import { test, expect } from "../../../helpers/test-fixtures";
import { authenticatedPost, unauthenticatedPost } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import {
  createCollectorNiftyRequest,
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
        timezone: "etc/UTC",
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
    const requestBody = createCollectorNiftyRequest(0.75);
    requestBody.data.timezone = "Asia/Kolkata";
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.data.dayChangePerc).toBe(0.75);
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
    const dayChangePerc = 0.75;
    const requestBody = createCollectorNiftyRequest(dayChangePerc);
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.message).toBe("NIFTY quote created successfully");
    expect(body.data.id).toBeDefined();
    expect(body.data.timestamp).toBe("2025-12-26T10:06:00");
    expect(body.data.dayChangePerc).toBe(dayChangePerc);

    // Validate response matches schema
    const validatedData = v1_developer_collector_schemas.createNiftyQuote.response.parse(body);
    expect(validatedData.data.id).toBe(body.data.id);
    expect(validatedData.data.dayChangePerc).toBe(dayChangePerc);
  });

  test("should return 201 with negative dayChangePerc", async () => {
    const dayChangePerc = -0.25;
    const requestBody = createCollectorNiftyRequest(dayChangePerc);
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.data.dayChangePerc).toBe(dayChangePerc);
  });

  test("should return 201 with zero dayChangePerc", async () => {
    const dayChangePerc = 0;
    const requestBody = createCollectorNiftyRequest(dayChangePerc);
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.data.dayChangePerc).toBe(dayChangePerc);
  });

  test("should convert Asia/Kolkata timezone to correct UTC time in database", async () => {
    const requestBody = createCollectorNiftyRequest(0.75);
    requestBody.data.timestamp = "2025-12-31T09:15:00"; // 9:15 AM IST
    requestBody.data.timezone = "Asia/Kolkata";

    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody
    );
    expect(response.status).toBe(201);

    // Verify the stored timestamp is converted to UTC (IST is UTC+5:30, so 9:15 AM IST = 3:45 AM UTC)
    const storedNifty = await prisma.niftyQuote.findUnique({
      where: { id: response.data.data.id },
    });

    expect(storedNifty).toBeDefined();
    expect(storedNifty!.timestamp.toISOString()).toBe("2025-12-31T03:45:00.000Z");
  });

  test("should store UTC timezone unchanged in database", async () => {
    const uniqueTimestamp = "2025-12-31T16:45:00"; // Use a different time to avoid conflicts
    const requestBody = createCollectorNiftyRequest(0.5);
    requestBody.data.timestamp = uniqueTimestamp; // 4:45 PM UTC
    requestBody.data.timezone = "Etc/UTC";

    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody
    );
    expect(response.status).toBe(201);

    // Verify the stored timestamp remains the same (no conversion needed)
    const storedNifty = await prisma.niftyQuote.findUnique({
      where: { id: response.data.data.id },
    });

    expect(storedNifty).toBeDefined();
    expect(storedNifty!.timestamp.toISOString()).toBe("2025-12-31T16:45:00.000Z");
  });
});
