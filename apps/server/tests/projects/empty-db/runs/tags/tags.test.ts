import { expect, test } from "../../../../helpers/test-fixtures";
import { authenticatedGet } from "../../../../helpers/api-client";
import { createDeveloperUser } from "../../../../helpers/auth-helpers";
import { createRun } from "../../../../helpers/db-helpers";
import { TestDataTracker } from "../../../../helpers/test-tracker";

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

test.describe("GET /v1/runs/tags", () => {
  test("should return 200 with empty array when no runs exist", async () => {
    const response = await authenticatedGet("/v1/runs/tags", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Tags fetched successfully");
    expect(body.data).toEqual([]);
  });

  test("should return empty array when all runs have no tags", async ({ tracker }) => {
    // Create runs without tags
    await createRun(developerId, "2025-01-01T09:15:00", "2025-01-01T15:30:00", tracker);
    await createRun(developerId, "2025-01-02T09:15:00", "2025-01-02T15:30:00", tracker);

    const response = await authenticatedGet("/v1/runs/tags", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.data).toEqual([]);
  });
});
