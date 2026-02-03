import { test, expect } from "../../../helpers/test-fixtures";
import { authenticatedGet, authenticatedGetWithRunContext } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { createRun } from "../../../helpers/db-helpers";
import {
  createHistoricalCandlesQuery,
  TEST_SYMBOL,
  buildQueryString,
  generateUniqueTestDatetime,
} from "../../../fixtures/test-data";
import { parseDateTimeInTimezone } from "../../../../src/utils/timezone";
import { TestDataTracker } from "../../../helpers/test-tracker";
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

test.describe("GET /v1/candles", () => {
  test("should return 400 when symbol is missing", async () => {
    const query = createHistoricalCandlesQuery();
    const queryWithoutSymbol = {
      interval: query.interval,
      start_datetime: query.start_datetime,
      end_datetime: query.end_datetime,
      timezone: query.timezone,
    };
    const queryString = buildQueryString(queryWithoutSymbol);
    const response = await authenticatedGet(
      `/v1/candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when interval is missing", async () => {
    const query = createHistoricalCandlesQuery();
    const queryWithoutInterval = {
      symbol: query.symbol,
      start_datetime: query.start_datetime,
      end_datetime: query.end_datetime,
      timezone: query.timezone,
    };
    const queryString = buildQueryString(queryWithoutInterval);
    const response = await authenticatedGet(
      `/v1/candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when start_time is missing", async () => {
    const query = createHistoricalCandlesQuery();
    const queryWithoutStartTime = {
      symbol: query.symbol,
      interval: query.interval,
      end_datetime: query.end_datetime,
      timezone: query.timezone,
    };
    const queryString = buildQueryString(queryWithoutStartTime);
    const response = await authenticatedGet(
      `/v1/candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when end_time is missing", async () => {
    const query = createHistoricalCandlesQuery();
    const queryWithoutEndTime = {
      symbol: query.symbol,
      interval: query.interval,
      start_datetime: query.start_datetime,
      timezone: query.timezone,
    };
    const queryString = buildQueryString(queryWithoutEndTime);
    const response = await authenticatedGet(
      `/v1/candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when interval is invalid", async () => {
    const query = createHistoricalCandlesQuery();
    const queryWithInvalidInterval = {
      symbol: query.symbol,
      start_datetime: query.start_datetime,
      end_datetime: query.end_datetime,
      timezone: query.timezone,
      interval: "invalid-interval",
    };
    const queryString = buildQueryString(queryWithInvalidInterval);
    const response = await authenticatedGet(
      `/v1/candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 403 when end_datetime equals currentTimestamp", async ({ tracker }) => {
    const startDatetime = generateUniqueTestDatetime();
    const endDatetime = dayjs
      .tz(startDatetime, "Asia/Kolkata")
      .add(1, "hour")
      .format("YYYY-MM-DDTHH:mm:ss");
    const currentTimestamp = parseDateTimeInTimezone(endDatetime, "Asia/Kolkata");
    const run = await createRun(
      developerId,
      startDatetime,
      currentTimestamp.toISOString(),
      tracker
    );

    const query = createHistoricalCandlesQuery(TEST_SYMBOL, "5minute", startDatetime, endDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGetWithRunContext(
      `/v1/candles?${queryString}`,
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

  test("should return 403 when end_datetime > currentTimestamp", async ({ tracker }) => {
    const startDatetime = generateUniqueTestDatetime();
    const endDatetime = dayjs
      .tz(startDatetime, "Asia/Kolkata")
      .add(1, "hour")
      .format("YYYY-MM-DDTHH:mm:ss");
    const currentTimestamp = parseDateTimeInTimezone(startDatetime, "Asia/Kolkata");
    currentTimestamp.setMinutes(currentTimestamp.getMinutes() + 30); // currentTimestamp is 30 min after start, but end is 1 hour after
    const run = await createRun(
      developerId,
      startDatetime,
      currentTimestamp.toISOString(),
      tracker
    );

    const query = createHistoricalCandlesQuery(TEST_SYMBOL, "5minute", startDatetime, endDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGetWithRunContext(
      `/v1/candles?${queryString}`,
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
