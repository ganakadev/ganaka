import { v1_developer_groww_schemas } from "@ganaka/schemas";
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

test.describe("GET /v1/groww/token", () => {
  test("should return token successfully with valid developer token", async () => {
    const response = await authenticatedGet("/v1/groww/token", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Token fetched successfully");
    expect(typeof body.data).toBe("string");
    expect(body.data.length).toBeGreaterThan(0);

    // Validate response matches schema
    const validatedData = v1_developer_groww_schemas.getGrowwToken.response.parse(body);
    expect(validatedData.data).toBe(body.data);
  });
});
