import { test, expect } from "../../../helpers/test-fixtures";
import { authenticatedGet, authenticatedGetWithRunContext } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import {
  createListsQuery,
  buildQueryString,
  generateUniqueTestDatetime,
  createValidShortlistEntries,
} from "../../../fixtures/test-data";
import { createShortlistSnapshot, createRun } from "../../../helpers/db-helpers";
import { TestDataTracker } from "../../../helpers/test-tracker";
import { parseDateTimeInTimezone } from "../../../../src/utils/timezone";

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

test.describe("GET /v1/developer/lists", () => {
  test("should return 400 when type parameter is missing", async () => {
    const response = await authenticatedGet("/v1/developer/lists", developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when type is invalid enum value", async () => {
    const response = await authenticatedGet(
      "/v1/developer/lists?type=invalid-type",
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when datetime format is invalid", async () => {
    const query = createListsQuery("top-gainers", "invalid-datetime");
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/developer/lists?${queryString}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 403 when datetime equals currentTimestamp", async ({ tracker }) => {
    const testDatetime = generateUniqueTestDatetime();
    const testEntries = createValidShortlistEntries();
    await createShortlistSnapshot("top-gainers", testDatetime, testEntries, tracker);

    const currentTimestamp = parseDateTimeInTimezone(testDatetime, "Asia/Kolkata");
    const run = await createRun(developerId, testDatetime, currentTimestamp.toISOString(), tracker);

    const query = createListsQuery("top-gainers", testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGetWithRunContext(
      `/v1/developer/lists?${queryString}`,
      developerToken,
      run.id,
      currentTimestamp,
      "Asia/Kolkata",
      { validateStatus: () => true }
    );

    expect(response.status).toBe(403);
    const body = response.data;
    expect(body.statusCode).toBe(403);
    expect(body.message).toContain("Cannot access data");
    expect(body.message).toContain("before current execution timestamp");
  });

  test("should return 403 when datetime > currentTimestamp", async ({ tracker }) => {
    const testDatetime = generateUniqueTestDatetime();
    const testEntries = createValidShortlistEntries();
    await createShortlistSnapshot("top-gainers", testDatetime, testEntries, tracker);

    const currentTimestamp = parseDateTimeInTimezone(testDatetime, "Asia/Kolkata");
    currentTimestamp.setHours(currentTimestamp.getHours() - 1); // currentTimestamp is 1 hour before testDatetime
    const run = await createRun(developerId, testDatetime, currentTimestamp.toISOString(), tracker);

    const query = createListsQuery("top-gainers", testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGetWithRunContext(
      `/v1/developer/lists?${queryString}`,
      developerToken,
      run.id,
      currentTimestamp,
      "Asia/Kolkata",
      { validateStatus: () => true }
    );

    expect(response.status).toBe(403);
    const body = response.data;
    expect(body.statusCode).toBe(403);
    expect(body.message).toContain("Cannot access data");
  });

  test("should return 400 when scope is invalid enum value", async () => {
    const query = createListsQuery("top-gainers");
    const queryString = new URLSearchParams({
      ...query,
      scope: "INVALID_SCOPE",
    }).toString();
    const response = await authenticatedGet(`/v1/developer/lists?${queryString}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });
});
