import { test, expect } from "../../../helpers/test-fixtures";
import { authenticatedGet, authenticatedGetWithRunContext } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { createNiftyQuoteSnapshot, createRun } from "../../../helpers/db-helpers";
import {
  createGrowwNiftyQuoteQuery,
  createValidGrowwQuotePayload,
  generateUniqueTestDatetime,
} from "../../../fixtures/test-data";
import { parseDateTimeInTimezone } from "../../../../src/utils/timezone";
import { TestDataTracker } from "../../../helpers/test-tracker";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

function buildQueryString(query: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      params.append(key, value);
    }
  }
  return params.toString();
}

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

test.describe("GET /v1/developer/nifty", () => {
  test("should return 400 when datetime format is invalid", async () => {
    const response = await authenticatedGet(
      "/v1/developer/nifty?datetime=invalid-date",
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when datetime is missing", async () => {
    const response = await authenticatedGet("/v1/developer/nifty", developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
    const body = response.data;
    expect(body.message).toContain("datetime parameter is required");
  });

  test("should return 403 when datetime equals currentTimestamp", async ({ tracker }) => {
    const testDatetime = generateUniqueTestDatetime();
    await createNiftyQuoteSnapshot(testDatetime, createValidGrowwQuotePayload(), tracker);

    const currentTimestamp = parseDateTimeInTimezone(testDatetime, "Asia/Kolkata");
    const run = await createRun(
      developerId,
      testDatetime,
      dayjs.tz(testDatetime, "Asia/Kolkata").add(1, "hour").format("YYYY-MM-DDTHH:mm:ss"),
      tracker
    );

    const query = createGrowwNiftyQuoteQuery(testDatetime);
    const queryString = buildQueryString(query);

    const response = await authenticatedGetWithRunContext(
      `/v1/developer/nifty?${queryString}`,
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
    await createNiftyQuoteSnapshot(testDatetime, createValidGrowwQuotePayload(), tracker);

    const currentTimestamp = parseDateTimeInTimezone(testDatetime, "Asia/Kolkata");
    currentTimestamp.setHours(currentTimestamp.getHours() - 1); // currentTimestamp is 1 hour before testDatetime
    const run = await createRun(developerId, testDatetime, currentTimestamp.toISOString(), tracker);

    const query = createGrowwNiftyQuoteQuery(testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGetWithRunContext(
      `/v1/developer/nifty?${queryString}`,
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
});
