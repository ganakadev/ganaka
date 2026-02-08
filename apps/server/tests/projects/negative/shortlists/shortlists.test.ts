import {
  buildQueryString,
  TEST_DATETIME,
  createShortlistsQuery,
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

test.describe("GET /v1/shortlists", () => {
  test("should return 400 when date is missing", async () => {
    const query = createShortlistsQuery({ type: "TOP_GAINERS" });
    // @ts-ignore
    delete query.datetime;
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when type is missing", async () => {
    const query = createShortlistsQuery({ datetime: TEST_DATETIME });
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when date format is invalid", async () => {
    const query = createShortlistsQuery({ datetime: "invalid-date" });
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when type is invalid enum value", async () => {
    const query = createShortlistsQuery({ type: "invalid-type" as any });
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when scope is invalid", async () => {
    const query = createShortlistsQuery({});
    const queryString = buildQueryString({
      ...query,
      scope: "INVALID_SCOPE" as any,
    });
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });
});
