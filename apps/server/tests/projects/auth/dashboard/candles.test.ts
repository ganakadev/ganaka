import { authenticatedGet, unauthenticatedGet } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";
import { createCandlesQuery, buildQueryString } from "../../../fixtures/test-data";

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

test.describe("GET /v1/candles", () => {
  test("should return 401 when authorization header is missing", async () => {
    const query = createCandlesQuery();
    const queryString = buildQueryString(query);
    const response = await unauthenticatedGet(`/v1/candles?${queryString}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = createCandlesQuery();
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/candles?${queryString}`,
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });
});
