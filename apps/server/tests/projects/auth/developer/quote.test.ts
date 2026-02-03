import { authenticatedGet, unauthenticatedGet } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { expect, test } from "../../../helpers/test-fixtures";
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

test.describe("GET /v1/quote", () => {
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet("/v1/quote?symbol=RELIANCE");

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const response = await authenticatedGet(
      "/v1/quote?symbol=RELIANCE",
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });
});
