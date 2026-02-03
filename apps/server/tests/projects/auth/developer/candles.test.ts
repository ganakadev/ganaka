import { authenticatedGet, unauthenticatedGet } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";
import { createHistoricalCandlesQuery, buildQueryString } from "../../../fixtures/test-data";

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

test.describe("GET /v1/developer/candles", () => {
  test("should return 401 when authorization header is missing", async () => {
    const query = createHistoricalCandlesQuery();
    const queryString = buildQueryString(query);
    const response = await unauthenticatedGet(`/v1/developer/candles?${queryString}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = createHistoricalCandlesQuery();
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/candles?${queryString}`,
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });
});
