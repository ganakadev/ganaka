import { test, expect } from "../../../helpers/test-fixtures";
import {
  authenticatedGet,
  authenticatedPost,
  unauthenticatedGet,
  unauthenticatedPost,
} from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import {
  createCollectorQuotesRequest,
  createCollectorShortlistRequest,
  buildQueryString,
} from "../../../fixtures/test-data";
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

test.describe("POST /v1/lists", () => {
  test("should return 401 when authorization header is missing", async () => {
    const requestBody = createCollectorShortlistRequest();
    const response = await unauthenticatedPost("/v1/lists", requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const requestBody = createCollectorShortlistRequest();
    const response = await authenticatedPost("/v1/lists", "invalid-token-12345", requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });
});

test.describe("POST /v1/developer/collector/quotes", () => {
  test("should return 401 when authorization header is missing", async () => {
    const requestBody = createCollectorQuotesRequest();
    const response = await unauthenticatedPost("/v1/developer/collector/quotes", requestBody, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const requestBody = createCollectorQuotesRequest();
    const response = await authenticatedPost(
      "/v1/developer/collector/quotes",
      "invalid-token-12345",
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });
});

test.describe("GET /v1/lists", () => {
  test("should return 401 when authorization header is missing", async () => {
    const query = { type: "top-gainers" };
    const queryString = buildQueryString(query);
    const response = await unauthenticatedGet(`/v1/lists?${queryString}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = { type: "top-gainers" };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/lists?${queryString}`, "invalid-token-12345", {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });
});
