import { v1_developer_available_dates_schemas } from "@ganaka/schemas";
import { authenticatedGet } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";

let developerToken: string;
let adminToken: string;
let sharedTracker: TestDataTracker;

test.beforeAll(async () => {
  sharedTracker = new TestDataTracker();
  const dev = await createDeveloperUser(undefined, sharedTracker);
  developerToken = dev.token;

  const token = process.env.TEST_ADMIN_TOKEN;
  if (!token) {
    throw new Error("TEST_ADMIN_TOKEN not set in environment");
  }
  adminToken = token;
});

test.afterAll(async () => {
  if (sharedTracker) {
    await sharedTracker.cleanup();
  }
});

test.describe("GET /v1/developer/dates", () => {
  test.describe.configure({ mode: "serial" });

  test("should return 200 with empty dates array when no snapshots exist", async () => {
    const response = await authenticatedGet("/v1/developer/dates", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Available dates fetched successfully");
    expect(body.data.dates).toBeInstanceOf(Array);

    // Validate response matches schema
    const validatedData =
      v1_developer_available_dates_schemas.getAvailableDates.response.parse(body);
    expect(validatedData.data.dates).toBeInstanceOf(Array);
  });
});
