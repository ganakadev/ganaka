import { v1_schemas } from "@ganaka/schemas";
import { authenticatedGet } from "../../../../helpers/api-client";
import { createDeveloperUser } from "../../../../helpers/auth-helpers";
import { expect, test } from "../../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../../helpers/test-tracker";

let developerToken: string;
let sharedTracker: TestDataTracker;

test.beforeAll(async () => {
  sharedTracker = new TestDataTracker();
  const dev = await createDeveloperUser(undefined, sharedTracker);
  developerToken = dev.token;
});

test.afterAll(async () => {
  if (sharedTracker) {
    await sharedTracker.cleanup();
  }
});

test.describe("GET /v1/dates", () => {
  test("should return 200 with empty dates array when no snapshots exist", async () => {
    const response = await authenticatedGet("/v1/dates", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Available datetimes fetched successfully");
    expect(body.data.dates).toBeInstanceOf(Array);

    // Validate response matches schema
    const validatedData =
      v1_schemas.v1_dashboard_available_datetimes_schemas.getAvailableDatetimes.response.parse(
        body
      );
    expect(validatedData.data.dates).toBeInstanceOf(Array);
  });
});
