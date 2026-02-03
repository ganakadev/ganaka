import { test, expect } from "../../../helpers/test-fixtures";
import { authenticatedGet } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { createRun } from "../../../helpers/db-helpers";
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

test.describe("GET /v1/dashboard/runs", () => {
  test("should return 200 with empty object when no runs exist", async () => {
    const response = await authenticatedGet("/v1/dashboard/runs", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Runs fetched successfully");
    expect(typeof body.data).toBe("object");
    expect(Object.keys(body.data).length).toBe(0);
  });
});

test.describe("GET /v1/dashboard/runs/:runId/orders", () => {
  test("should return 200 with empty array when no orders exist", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await authenticatedGet(`/v1/dashboard/runs/${run.id}/orders`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Orders fetched successfully");
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBe(0);
  });
});
