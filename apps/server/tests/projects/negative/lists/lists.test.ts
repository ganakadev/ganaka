import {
  buildQueryString,
  TEST_DATETIME,
  createShortlistsQuery,
  createListsQuery,
} from "../../../fixtures/test-data";
import { authenticatedGet } from "../../../helpers/api-client";
import { expect, test } from "../../../helpers/test-fixtures";
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

test.describe("GET /v1/lists", () => {
  test("should return 400 when date is missing", async () => {
    const query = createListsQuery("TOP_GAINERS", undefined);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/lists?${queryString}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when type is missing", async () => {
    const query = createListsQuery(undefined, TEST_DATETIME);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/lists?${queryString}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when date format is invalid", async () => {
    const query = createShortlistsQuery("invalid-date", "TOP_GAINERS");
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/lists?${queryString}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when type is invalid enum value", async () => {
    const query = createListsQuery(undefined, TEST_DATETIME, undefined, "invalid-type" as any);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/lists?${queryString}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when takeProfitPercentage is invalid (negative)", async () => {
    const query = createShortlistsQuery();
    const queryString = new URLSearchParams({
      ...query,
      takeProfitPercentage: "-1",
      stopLossPercentage: "1.5",
    }).toString();

    const response = await authenticatedGet(`/v1/lists?${queryString}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when stopLossPercentage is invalid (greater than 100)", async () => {
    const query = createShortlistsQuery();
    const queryString = new URLSearchParams({
      ...query,
      takeProfitPercentage: "2",
      stopLossPercentage: "150",
    }).toString();

    const response = await authenticatedGet(`/v1/lists?${queryString}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when scope is invalid", async () => {
    const query = createShortlistsQuery();
    const queryString = buildQueryString({
      ...query,
      scope: "INVALID_SCOPE" as any,
    });
    const response = await authenticatedGet(`/v1/lists?${queryString}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });
});
