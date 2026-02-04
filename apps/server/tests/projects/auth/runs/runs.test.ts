import { test, expect } from "../../../helpers/test-fixtures";
import {
  authenticatedGet,
  authenticatedPost,
  authenticatedPatch,
  authenticatedDelete,
  unauthenticatedGet,
  unauthenticatedPost,
  unauthenticatedPatch,
  unauthenticatedDelete,
} from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { createRun } from "../../../helpers/db-helpers";
import { createOrderTestData, createRunTestData } from "../../../fixtures/test-data";
import { TestDataTracker } from "../../../helpers/test-tracker";

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

test.describe("GET /v1/runs", () => {
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet("/v1/runs");

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const response = await authenticatedGet("/v1/runs", "invalid-token-12345", {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });
});

test.describe("POST /v1/runs", () => {
  test("should return 401 when authorization header is missing", async () => {
    const testData = createRunTestData();
    const response = await unauthenticatedPost("/v1/runs", testData);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const testData = createRunTestData();
    const response = await authenticatedPost("/v1/runs", "invalid-token-12345", testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });
});

test.describe("PATCH /v1/runs/:runId", () => {
  test("should return 401 when authorization header is missing", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await unauthenticatedPatch(`/v1/runs/${run.id}`, {
      completed: true,
    });

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await authenticatedPatch(
      `/v1/runs/${run.id}`,
      "invalid-token-12345",
      { completed: true },
      { validateStatus: () => true }
    );

    expect(response.status).toBe(401);
  });
});

test.describe("DELETE /v1/runs/:runId", () => {
  test("should return 401 when authorization header is missing", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await unauthenticatedDelete(`/v1/runs/${run.id}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await authenticatedDelete(`/v1/runs/${run.id}`, "invalid-token-12345", {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });
});

test.describe("GET /v1/runs/:runId/orders", () => {
  test("should return 401 when authorization header is missing", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await unauthenticatedGet(`/v1/runs/${run.id}/orders`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await authenticatedGet(`/v1/runs/${run.id}/orders`, "invalid-token-12345", {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });
});

test.describe("POST /v1/runs/:runId/orders", () => {
  test("should return 401 when authorization header is missing", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    const response = await unauthenticatedPost(`/v1/runs/${run.id}/orders`, orderData);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    const response = await authenticatedPost(
      `/v1/runs/${run.id}/orders`,
      "invalid-token-12345",
      orderData,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(401);
  });
});
