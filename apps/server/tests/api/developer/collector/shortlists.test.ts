import { test, expect } from "../../../helpers/test-fixtures";
import { authenticatedPost, unauthenticatedPost } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import {
  createCollectorShortlistRequest,
  createValidShortlistEntries,
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

test.describe("POST /v1/developer/collector/shortlists", () => {
  test("should return 401 when authorization header is missing", async () => {
    const requestBody = createCollectorShortlistRequest();
    const response = await unauthenticatedPost("/v1/developer/collector/shortlists", requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const requestBody = createCollectorShortlistRequest();
    const response = await authenticatedPost(
      "/v1/developer/collector/shortlists",
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
      "/v1/developer/collector/shortlists",
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
        shortlistType: "TOP_GAINERS" as const,
        entries: createValidShortlistEntries(),
      },
    };
    const response = await authenticatedPost(
      "/v1/developer/collector/shortlists",
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
        entries: createValidShortlistEntries(),
      },
    };
    const response = await authenticatedPost(
      "/v1/developer/collector/shortlists",
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
        timezone: "UTC",
        shortlistType: "TOP_GAINERS" as const,
      },
    };
    const response = await authenticatedPost(
      "/v1/developer/collector/shortlists",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should accept custom timezone parameter", async () => {
    const requestBody = createCollectorShortlistRequest("TOP_GAINERS");
    requestBody.data.timezone = "Asia/Kolkata";
    const response = await authenticatedPost(
      "/v1/developer/collector/shortlists",
      developerToken,
      requestBody
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.data.shortlistType).toBe("TOP_GAINERS");
  });

  test("should return 400 when timestamp format is invalid", async () => {
    const requestBody = createCollectorShortlistRequest();
    requestBody.data.timestamp = "invalid-date";
    const response = await authenticatedPost(
      "/v1/developer/collector/shortlists",
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
      "/v1/developer/collector/shortlists",
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
      "/v1/developer/collector/shortlists",
      developerToken,
      requestBody
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.message).toBe("Shortlist snapshot created successfully");
    expect(body.data.id).toBeDefined();
    expect(body.data.timestamp).toBe("2025-12-31T09:15:00.000Z");
    expect(body.data.shortlistType).toBe("TOP_GAINERS");
    expect(body.data.entriesCount).toBe(5);

    // Validate response matches schema
    const validatedData =
      v1_developer_collector_schemas.createShortlistSnapshot.response.parse(body);
    expect(validatedData.data.id).toBe(body.data.id);
    expect(validatedData.data.shortlistType).toBe("TOP_GAINERS");
  });

  test("should return 201 and create shortlist snapshot for VOLUME_SHOCKERS", async () => {
    const requestBody = createCollectorShortlistRequest("VOLUME_SHOCKERS");
    const response = await authenticatedPost(
      "/v1/developer/collector/shortlists",
      developerToken,
      requestBody
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.message).toBe("Shortlist snapshot created successfully");
    expect(body.data.id).toBeDefined();
    expect(body.data.timestamp).toBe("2025-12-31T09:15:00.000Z");
    expect(body.data.shortlistType).toBe("VOLUME_SHOCKERS");
    expect(body.data.entriesCount).toBe(5);

    // Validate response matches schema
    const validatedData =
      v1_developer_collector_schemas.createShortlistSnapshot.response.parse(body);
    expect(validatedData.data.id).toBe(body.data.id);
    expect(validatedData.data.shortlistType).toBe("VOLUME_SHOCKERS");
  });

  test("should return 201 with empty entries array", async () => {
    const requestBody = createCollectorShortlistRequest("TOP_GAINERS", []);
    const response = await authenticatedPost(
      "/v1/developer/collector/shortlists",
      developerToken,
      requestBody
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.data.entriesCount).toBe(0);
  });

  test("should convert Asia/Kolkata timezone to correct UTC time in database", async () => {
    const requestBody = createCollectorShortlistRequest("TOP_GAINERS");
    requestBody.data.timestamp = "2025-12-31T09:15:00"; // 9:15 AM IST
    requestBody.data.timezone = "Asia/Kolkata";

    const response = await authenticatedPost(
      "/v1/developer/collector/shortlists",
      developerToken,
      requestBody
    );
    expect(response.status).toBe(201);

    // Verify the stored timestamp is converted to UTC (IST is UTC+5:30, so 9:15 AM IST = 3:45 AM UTC)
    const storedShortlist = await prisma.shortlistSnapshot.findUnique({
      where: { id: response.data.data.id },
    });

    expect(storedShortlist).toBeDefined();
    expect(storedShortlist!.timestamp.toISOString()).toBe("2025-12-31T03:45:00.000Z");
  });

  test("should store UTC timezone unchanged in database", async () => {
    const requestBody = createCollectorShortlistRequest("VOLUME_SHOCKERS");
    requestBody.data.timestamp = "2025-12-31T09:15:00"; // 9:15 AM UTC
    requestBody.data.timezone = "Etc/UTC";

    const response = await authenticatedPost(
      "/v1/developer/collector/shortlists",
      developerToken,
      requestBody
    );
    expect(response.status).toBe(201);

    // Verify the stored timestamp remains the same (no conversion needed)
    const storedShortlist = await prisma.shortlistSnapshot.findUnique({
      where: { id: response.data.data.id },
    });

    expect(storedShortlist).toBeDefined();
    expect(storedShortlist!.timestamp.toISOString()).toBe("2025-12-31T09:15:00.000Z");
  });
});
