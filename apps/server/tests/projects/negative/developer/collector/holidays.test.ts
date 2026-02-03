import { authenticatedGet } from "../../../../helpers/api-client";
import { createDeveloperUser } from "../../../../helpers/auth-helpers";
import { expect, test } from "../../../../helpers/test-fixtures";
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

test.describe("GET /v1/developer/collector/holidays/check", () => {
  test("should return 400 when date query parameter is missing", async () => {
    const response = await authenticatedGet(
      "/v1/developer/collector/holidays/check",
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when date format is invalid", async () => {
    const response = await authenticatedGet(
      "/v1/developer/collector/holidays/check?date=invalid-date",
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when date is not a valid date", async () => {
    const response = await authenticatedGet(
      "/v1/developer/collector/holidays/check?date=2025-13-45",
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });
});
