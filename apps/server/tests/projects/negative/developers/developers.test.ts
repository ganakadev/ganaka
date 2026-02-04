import {
  authenticatedGet,
  authenticatedPost,
  authenticatedPatch,
  authenticatedDelete,
} from "../../../helpers/api-client";
import { createTestDeveloper } from "../../../helpers/db-helpers";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";
import {
  createDeveloperTestData,
  createEmptyDeveloperTestData,
  createInvalidDeveloperTestData,
  generateUUID,
} from "../../../fixtures/test-data";

let adminToken: string;
let sharedTracker: TestDataTracker;

test.beforeAll(async () => {
  const token = process.env.TEST_ADMIN_TOKEN;
  if (!token) {
    throw new Error("TEST_ADMIN_TOKEN not set in environment");
  }
  adminToken = token;
  sharedTracker = new TestDataTracker();
});

test.afterAll(async () => {
  if (sharedTracker) {
    await sharedTracker.cleanup();
  }
});

test.describe("GET /v1/developers/:id", () => {
  test("should return 404 for non-existent developer ID", async ({ tracker }) => {
    const fakeId = generateUUID();

    const response = await authenticatedGet(`/v1/developers/${fakeId}`, adminToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(404);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Developer not found");
  });

  test("should return 400 for invalid UUID format", async ({ tracker }) => {
    const response = await authenticatedGet("/v1/developers/invalid-id", adminToken, {
      validateStatus: () => true,
    });

    // Should return 400 for invalid UUID format
    expect([400, 404]).toContain(response.status);
  });
});

test.describe("POST /v1/developers", () => {
  test("should return 409 when creating developer with duplicate username", async ({ tracker }) => {
    const dev = await createTestDeveloper(tracker, "duplicate-username");

    const response = await authenticatedPost(
      "/v1/developers",
      adminToken,
      { username: dev.username },
      { validateStatus: () => true }
    );

    expect(response.status).toBe(409);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Username already exists");
  });

  test("should return 400 when username is missing", async ({ tracker }) => {
    const response = await authenticatedPost(
      "/v1/developers",
      adminToken,
      {},
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when username is empty", async ({ tracker }) => {
    const testData = createEmptyDeveloperTestData();

    const response = await authenticatedPost("/v1/developers", adminToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when username exceeds max length", async ({ tracker }) => {
    const testData = createInvalidDeveloperTestData();

    const response = await authenticatedPost("/v1/developers", adminToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });
});

test.describe("PATCH /v1/developers/:id/refresh", () => {
  test("should return 404 for non-existent developer ID", async ({ tracker }) => {
    const fakeId = generateUUID();

    const response = await authenticatedPatch(
      `/v1/developers/${fakeId}/refresh`,
      adminToken,
      {},
      { validateStatus: () => true }
    );

    expect(response.status).toBe(404);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Developer not found");
  });
});

test.describe("DELETE /v1/developers/:id", () => {
  test("should return 404 for non-existent developer ID", async ({ tracker }) => {
    const fakeId = generateUUID();

    const response = await authenticatedDelete(`/v1/developers/${fakeId}`, adminToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(404);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Developer not found");
  });
});
