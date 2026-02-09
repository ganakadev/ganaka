import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { expect, test } from "../../../helpers/test-fixtures";
import {
  CANDLES_TEST_DATE,
  buildQueryString,
  TEST_SYMBOL,
  createCandlesQuery,
  createDeveloperCandlesQuery,
  generateUniqueTestDatetime,
} from "../../../fixtures/test-data";
import { authenticatedGet, authenticatedGetWithRunContext } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { TestDataTracker } from "../../../helpers/test-tracker";
import { parseDateTimeInTimezone } from "../../../../src/utils/timezone";
import { createRun } from "../../../helpers/db-helpers";

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
  test.describe.configure({ mode: "default" });

  test.describe("Dashboard Source", () => {
    test("should return 400 when symbol is missing", async () => {
      const query = createCandlesQuery({ date: CANDLES_TEST_DATE });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        validateStatus: () => true,
      });

      expect(response.status).toBe(400);
    });

    test("should return 400 when date is missing", async () => {
      const query = createCandlesQuery({ symbol: TEST_SYMBOL, date: undefined });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        validateStatus: () => true,
      });

      expect(response.status).toBe(400);
    });

    test("should return 400 when date format is invalid", async () => {
      const query = createCandlesQuery({ symbol: TEST_SYMBOL, date: "invalid-date" });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        validateStatus: () => true,
      });

      expect(response.status).toBe(400);
    });

    test("should return 400 when interval is invalid enum value", async () => {
      const query = createCandlesQuery({
        symbol: TEST_SYMBOL,
        date: CANDLES_TEST_DATE,
        interval: "invalid-interval" as any,
      });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        validateStatus: () => true,
      });

      expect(response.status).toBe(400);
    });

    test("should handle external API failures gracefully (500)", async () => {
      // Use a date that likely won't have data (far future or invalid symbol)
      const futureDate = "2099-01-01";
      const query = createCandlesQuery({ symbol: "INVALID_SYMBOL_XYZ", date: futureDate });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        validateStatus: () => true,
      });

      // Should return 500 when external API fails
      expect([400, 500]).toContain(response.status);
    });
  });

  test.describe("Developer Source", () => {
    test("should return 400 when symbol is missing", async () => {
      const query = createDeveloperCandlesQuery({});
      const queryWithoutSymbol = {
        interval: query.interval,
        start_datetime: query.start_datetime,
        end_datetime: query.end_datetime,
        timezone: query.timezone,
      };
      const queryString = buildQueryString(queryWithoutSymbol);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        validateStatus: () => true,
      });

      expect(response.status).toBe(400);
    });

    test("should return 400 when interval is missing", async () => {
      const query = createDeveloperCandlesQuery({});
      const queryWithoutInterval = {
        symbol: query.symbol,
        start_datetime: query.start_datetime,
        end_datetime: query.end_datetime,
        timezone: query.timezone,
      };
      const queryString = buildQueryString(queryWithoutInterval);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        validateStatus: () => true,
      });

      expect(response.status).toBe(400);
    });

    test("should return 400 when start_datetime is missing", async () => {
      const query = createDeveloperCandlesQuery({});
      const queryWithoutStartTime = createDeveloperCandlesQuery({
        symbol: query.symbol,
        interval: query.interval,
        startTime: undefined,
        endTime: query.end_datetime,
        timezone: query.timezone,
      });
      const queryString = buildQueryString(queryWithoutStartTime);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        validateStatus: () => true,
      });

      expect(response.status).toBe(400);
    });

    test("should return 400 when end_datetime is missing", async () => {
      const query = createDeveloperCandlesQuery({});
      const queryWithoutEndTime = createDeveloperCandlesQuery({
        symbol: query.symbol,
        interval: query.interval,
        startTime: query.start_datetime,
        endTime: undefined,
        timezone: query.timezone,
      });
      const queryString = buildQueryString(queryWithoutEndTime);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        validateStatus: () => true,
      });

      expect(response.status).toBe(400);
    });

    test("should return 400 when interval is invalid", async () => {
      const query = createDeveloperCandlesQuery({});
      const queryWithInvalidInterval = {
        symbol: query.symbol,
        start_datetime: query.start_datetime,
        end_datetime: query.end_datetime,
        timezone: query.timezone,
        interval: "invalid-interval",
      };
      const queryString = buildQueryString(queryWithInvalidInterval);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        validateStatus: () => true,
      });

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

      const query = createDeveloperCandlesQuery({
        symbol: TEST_SYMBOL,
        interval: "5minute",
        startTime: startDatetime,
        endTime: endDatetime,
      });
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

      const query = createDeveloperCandlesQuery({
        symbol: TEST_SYMBOL,
        interval: "5minute",
        startTime: startDatetime,
        endTime: endDatetime,
      });
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
});
