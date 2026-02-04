import { test, expect } from "../../../../helpers/test-fixtures";
import { authenticatedGet, authenticatedGetWithRunContext } from "../../../../helpers/api-client";
import { createDeveloperUser } from "../../../../helpers/auth-helpers";
import { createQuoteSnapshot, createRun } from "../../../../helpers/db-helpers";
import {
  createGrowwQuoteQuery,
  createValidGrowwQuotePayload,
  generateUniqueTestDatetime,
  TEST_SYMBOL,
  buildQueryString,
} from "../../../fixtures/test-data";
import { parseDateTimeInTimezone } from "../../../../src/utils/timezone";
import { TestDataTracker } from "../../../../helpers/test-tracker";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

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
  test("should return 400 when symbol is missing", async () => {
    const response = await authenticatedGet("/v1/quote", developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when datetime format is invalid", async () => {
    const response = await authenticatedGet(
      `/v1/quote?symbol=${TEST_SYMBOL}&datetime=invalid-date`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 403 when datetime equals currentTimestamp", async ({ tracker }) => {
    const testDatetime = generateUniqueTestDatetime();
    const testSymbol = TEST_SYMBOL;
    await createQuoteSnapshot(testSymbol, testDatetime, createValidGrowwQuotePayload(), tracker);

    const currentTimestamp = parseDateTimeInTimezone(testDatetime, "Asia/Kolkata");
    const run = await createRun(
      developerId,
      testDatetime,
      dayjs.tz(testDatetime, "Asia/Kolkata").add(1, "hour").format("YYYY-MM-DDTHH:mm:ss"),
      tracker
    );

    const query = createGrowwQuoteQuery(testSymbol, testDatetime);
    const queryString = buildQueryString(query);

    const response = await authenticatedGetWithRunContext(
      `/v1/quote?${queryString}`,
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
    const testSymbol = TEST_SYMBOL;
    await createQuoteSnapshot(testSymbol, testDatetime, createValidGrowwQuotePayload(), tracker);

    const currentTimestamp = parseDateTimeInTimezone(testDatetime, "Asia/Kolkata");
    currentTimestamp.setHours(currentTimestamp.getHours() - 1); // currentTimestamp is 1 hour before testDatetime
    const run = await createRun(developerId, testDatetime, currentTimestamp.toISOString(), tracker);

    const query = createGrowwQuoteQuery(testSymbol, testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGetWithRunContext(
      `/v1/quote?${queryString}`,
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
