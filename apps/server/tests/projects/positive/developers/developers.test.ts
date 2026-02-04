import {
  authenticatedGet,
  authenticatedPost,
  authenticatedPatch,
  authenticatedDelete,
} from "../../../../helpers/api-client";
import { createDeveloperUser } from "../../../../helpers/auth-helpers";
import { createTestDeveloper, getDeveloperById } from "../../../../helpers/db-helpers";
import { expect, test } from "../../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../../helpers/test-tracker";
import { createDeveloperTestData } from "../../../../fixtures/test-data";

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
  test("should return developer by valid ID", async ({ tracker }) => {
    const dev = await createTestDeveloper(tracker, "test-get-dev");

    const response = await authenticatedGet(`/v1/developers/${dev.id}`, adminToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Developer fetched successfully");
    expect(body.data.id).toBe(dev.id);
    expect(body.data.username).toBe(dev.username);
    expect(body.data.token).toBe(dev.token);
  });
});

test.describe("POST /v1/developers", () => {
  test("should create a new developer successfully", async ({ tracker }) => {
    const testData = createDeveloperTestData();

    const response = await authenticatedPost("/v1/developers", adminToken, testData);

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.message).toBe("Developer created successfully");
    expect(body.data).toHaveProperty("id");
    expect(body.data).toHaveProperty("username", testData.username);
    expect(body.data).toHaveProperty("token");
    expect(body.data.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

    // Track the developer created via API
    tracker.trackDeveloper(body.data.id);
  });
});

test.describe("PATCH /v1/developers/:id/refresh-key", () => {
  test("should refresh developer key successfully", async ({ tracker }) => {
    const dev = await createTestDeveloper(tracker, "test-refresh-dev");
    const oldToken = dev.token;

    const response = await authenticatedPatch(
      `/v1/developers/${dev.id}/refresh-key`,
      adminToken,
      {}
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Developer key refreshed successfully");
    expect(body.data.id).toBe(dev.id);
    expect(body.data.username).toBe(dev.username);
    expect(body.data.token).not.toBe(oldToken);

    // Verify old token no longer works
    // Verify new token works by checking the developer in DB
    const updatedDev = await getDeveloperById(dev.id);
    expect(updatedDev?.token).toBe(body.data.token);
    expect(updatedDev?.token).not.toBe(oldToken);
  });
});

test.describe("DELETE /v1/developers/:id", () => {
  test("should delete developer successfully", async ({ tracker }) => {
    const dev = await createTestDeveloper(tracker, "test-delete-dev");
    const response = await authenticatedDelete(`/v1/developers/${dev.id}`, adminToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Developer deleted successfully");
    expect(body.data.id).toBe(dev.id);
    expect(body.data.deleted).toBe(true);

    // Verify developer is actually deleted
    const deletedDev = await getDeveloperById(dev.id);
    expect(deletedDev).toBeNull();

    // Note: Developer is already deleted by API, so no need to track for cleanup
  });
});
