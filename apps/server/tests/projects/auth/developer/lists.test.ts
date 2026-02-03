import { test, expect } from "../../../helpers/test-fixtures";
import { authenticatedGet, unauthenticatedGet } from "../../../helpers/api-client";
import { createListsQuery, buildQueryString } from "../../../fixtures/test-data";
import { TestDataTracker } from "../../../helpers/test-tracker";

let developerToken: string;
let developerId: string;
let sharedTracker: TestDataTracker;

test.beforeAll(async () => {
  sharedTracker = new TestDataTracker();
  const { createDeveloperUser } = await import("../../../helpers/auth-helpers");
  const dev = await createDeveloperUser(undefined, sharedTracker);
  developerToken = dev.token;
  developerId = dev.id;
});

test.afterAll(async () => {
  if (sharedTracker) {
    await sharedTracker.cleanup();
  }
});

test.describe("GET /v1/developer/lists", () => {
  test("should return 401 when authorization header is missing", async () => {
    const query = createListsQuery("top-gainers");
    const queryString = buildQueryString(query);
    const response = await unauthenticatedGet(`/v1/developer/lists?${queryString}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = createListsQuery("top-gainers");
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/lists?${queryString}`,
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });
});
