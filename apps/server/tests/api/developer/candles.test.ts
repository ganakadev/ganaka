import { v1_developer_groww_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { parseDateTimeInTimezone } from "../../../src/utils/timezone";
import {
  createHistoricalCandlesQuery,
  TEST_SYMBOL,
  buildQueryString,
  generateUniqueTestDatetime,
} from "../../fixtures/test-data";
import {
  authenticatedGet,
  authenticatedGetWithRunContext,
  unauthenticatedGet,
} from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import { createRun } from "../../helpers/db-helpers";
import { expect, test } from "../../helpers/test-fixtures";
import { TestDataTracker } from "../../helpers/test-tracker";

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
      `/v1/developer/candles?${queryString}`,
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
      `/v1/developer/candles?${queryString}`,
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
      `/v1/developer/candles?${queryString}`,
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
      `/v1/developer/candles?${queryString}`,
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
      `/v1/developer/candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return candles data with correct structure", async () => {
    const query = createHistoricalCandlesQuery();
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/developer/candles?${queryString}`, developerToken);

    // Note: This test may fail if external API is unavailable, but structure validation should still work
    if (response.status === 200) {
      const body = response.data;
      expect(body.statusCode).toBe(200);
      expect(body.message).toBe("Historical candles fetched successfully");

      // Validate response matches schema
      const validatedData =
        v1_developer_groww_schemas.getGrowwHistoricalCandles.response.parse(body);
      expect(validatedData.data.status).toBe("SUCCESS");
      expect(validatedData.data.payload.candles).toBeInstanceOf(Array);
      expect(typeof validatedData.data.payload.start_time).toBe("string");
      expect(typeof validatedData.data.payload.end_time).toBe("string");
      expect(typeof validatedData.data.payload.interval_in_minutes).toBe("number");

      // Validate payload structure matches expected values
      expect(validatedData.data.payload.start_time).toBe(query.start_datetime);
      expect(validatedData.data.payload.end_time).toBe(query.end_datetime);
      expect(validatedData.data.payload.interval_in_minutes).toBe(5); // 5minute interval
      expect(validatedData.data.payload.closing_price).toBeNull();

      // Validate candle structure if candles exist
      if (validatedData.data.payload.candles.length > 0) {
        // Validate first candle structure
        const firstCandle = validatedData.data.payload.candles[0];
        expect(firstCandle).toBeInstanceOf(Array);
        expect(firstCandle.length).toBe(7); // [timestamp, open, high, low, close, volume, turnover]
        expect(typeof firstCandle[0]).toBe("string"); // timestamp
        expect(typeof firstCandle[1]).toBe("number"); // open
        expect(typeof firstCandle[2]).toBe("number"); // high
        expect(typeof firstCandle[3]).toBe("number"); // low
        expect(typeof firstCandle[4]).toBe("number"); // close
        expect(typeof firstCandle[5]).toBe("number"); // volume
        expect(firstCandle[6]).toBeNull(); // turnover

        // Validate all candles have correct structure
        validatedData.data.payload.candles.forEach((candle, index) => {
          expect(candle).toBeInstanceOf(Array);
          expect(candle.length).toBe(7);
          expect(typeof candle[0]).toBe("string"); // timestamp
          expect(typeof candle[1]).toBe("number"); // open
          expect(typeof candle[2]).toBe("number"); // high
          expect(typeof candle[3]).toBe("number"); // low
          expect(typeof candle[4]).toBe("number"); // close
          expect(typeof candle[5]).toBe("number"); // volume
          // Turnover can be null or number
          expect(candle[6] === null || typeof candle[6] === "number").toBe(true);
        });

        // Validate candles are ordered chronologically (timestamps should be ascending)
        for (let i = 1; i < validatedData.data.payload.candles.length; i++) {
          const prevTimestamp = validatedData.data.payload.candles[i - 1][0] as string;
          const currTimestamp = validatedData.data.payload.candles[i][0] as string;
          expect(dayjs.utc(currTimestamp).valueOf()).toBeGreaterThanOrEqual(
            dayjs.utc(prevTimestamp).valueOf()
          );
        }

        // Validate exact candle values from response
        const candles = validatedData.data.payload.candles;
        if (candles.length >= 1) {
          // First candle: ["2025-12-26T09:15:00", 1558.1, 1560.2, 1554.6, 1559.5, 102889, null]
          expect(candles[0][0]).toBe("2025-12-26T09:15:00"); // timestamp
          expect(candles[0][1]).toBe(1558.1); // open
          expect(candles[0][2]).toBe(1560.2); // high
          expect(candles[0][3]).toBe(1554.6); // low
          expect(candles[0][4]).toBe(1559.5); // close
          expect(candles[0][5]).toBe(102889); // volume
          expect(candles[0][6]).toBeNull(); // turnover
        }

        if (candles.length >= 2) {
          // Second candle: ["2025-12-26T09:20:00", 1560, 1560.1, 1555.7, 1557, 56459, null]
          expect(candles[1][0]).toBe("2025-12-26T09:20:00"); // timestamp
          expect(candles[1][1]).toBe(1560); // open
          expect(candles[1][2]).toBe(1560.1); // high
          expect(candles[1][3]).toBe(1555.7); // low
          expect(candles[1][4]).toBe(1557); // close
          expect(candles[1][5]).toBe(56459); // volume
          expect(candles[1][6]).toBeNull(); // turnover
        }

        if (candles.length >= 3) {
          // Third candle: ["2025-12-26T09:25:00", 1556.9, 1559, 1555.2, 1558.2, 43518, null]
          expect(candles[2][0]).toBe("2025-12-26T09:25:00"); // timestamp
          expect(candles[2][1]).toBe(1556.9); // open
          expect(candles[2][2]).toBe(1559); // high
          expect(candles[2][3]).toBe(1555.2); // low
          expect(candles[2][4]).toBe(1558.2); // close
          expect(candles[2][5]).toBe(43518); // volume
          expect(candles[2][6]).toBeNull(); // turnover
        }

        if (candles.length >= 4) {
          // Fourth candle: ["2025-12-26T09:30:00", 1558.6, 1558.7, 1555.5, 1557, 28010, null]
          expect(candles[3][0]).toBe("2025-12-26T09:30:00"); // timestamp
          expect(candles[3][1]).toBe(1558.6); // open
          expect(candles[3][2]).toBe(1558.7); // high
          expect(candles[3][3]).toBe(1555.5); // low
          expect(candles[3][4]).toBe(1557); // close
          expect(candles[3][5]).toBe(28010); // volume
          expect(candles[3][6]).toBeNull(); // turnover
        }

        if (candles.length >= 5) {
          // Fifth candle: ["2025-12-26T09:35:00", 1556.7, 1559.3, 1556.5, 1559.1, 15992, null]
          expect(candles[4][0]).toBe("2025-12-26T09:35:00"); // timestamp
          expect(candles[4][1]).toBe(1556.7); // open
          expect(candles[4][2]).toBe(1559.3); // high
          expect(candles[4][3]).toBe(1556.5); // low
          expect(candles[4][4]).toBe(1559.1); // close
          expect(candles[4][5]).toBe(15992); // volume
          expect(candles[4][6]).toBeNull(); // turnover
        }

        if (candles.length >= 6) {
          // Sixth candle: ["2025-12-26T09:40:00", 1559.2, 1559.2, 1556.1, 1557.9, 28023, null]
          expect(candles[5][0]).toBe("2025-12-26T09:40:00"); // timestamp
          expect(candles[5][1]).toBe(1559.2); // open
          expect(candles[5][2]).toBe(1559.2); // high
          expect(candles[5][3]).toBe(1556.1); // low
          expect(candles[5][4]).toBe(1557.9); // close
          expect(candles[5][5]).toBe(28023); // volume
          expect(candles[5][6]).toBeNull(); // turnover
        }

        if (candles.length >= 7) {
          // Seventh candle: ["2025-12-26T09:45:00", 1557.8, 1558, 1556.6, 1558, 17891, null]
          expect(candles[6][0]).toBe("2025-12-26T09:45:00"); // timestamp
          expect(candles[6][1]).toBe(1557.8); // open
          expect(candles[6][2]).toBe(1558); // high
          expect(candles[6][3]).toBe(1556.6); // low
          expect(candles[6][4]).toBe(1558); // close
          expect(candles[6][5]).toBe(17891); // volume
          expect(candles[6][6]).toBeNull(); // turnover
        }

        if (candles.length >= 8) {
          // Eighth candle: ["2025-12-26T09:50:00", 1557.7, 1558.4, 1555.1, 1556.5, 19948, null]
          expect(candles[7][0]).toBe("2025-12-26T09:50:00"); // timestamp
          expect(candles[7][1]).toBe(1557.7); // open
          expect(candles[7][2]).toBe(1558.4); // high
          expect(candles[7][3]).toBe(1555.1); // low
          expect(candles[7][4]).toBe(1556.5); // close
          expect(candles[7][5]).toBe(19948); // volume
          expect(candles[7][6]).toBeNull(); // turnover
        }

        if (candles.length >= 9) {
          // Ninth candle: ["2025-12-26T09:55:00", 1556.4, 1558.9, 1556.3, 1558, 15522, null]
          expect(candles[8][0]).toBe("2025-12-26T09:55:00"); // timestamp
          expect(candles[8][1]).toBe(1556.4); // open
          expect(candles[8][2]).toBe(1558.9); // high
          expect(candles[8][3]).toBe(1556.3); // low
          expect(candles[8][4]).toBe(1558); // close
          expect(candles[8][5]).toBe(15522); // volume
          expect(candles[8][6]).toBeNull(); // turnover
        }

        if (candles.length >= 10) {
          // Tenth candle: ["2025-12-26T10:00:00", 1558.2, 1558.5, 1557.7, 1558.3, 3467, null]
          expect(candles[9][0]).toBe("2025-12-26T10:00:00"); // timestamp
          expect(candles[9][1]).toBe(1558.2); // open
          expect(candles[9][2]).toBe(1558.5); // high
          expect(candles[9][3]).toBe(1557.7); // low
          expect(candles[9][4]).toBe(1558.3); // close
          expect(candles[9][5]).toBe(3467); // volume
          expect(candles[9][6]).toBeNull(); // turnover
        }
      }
    } else {
      // External API failure - should return 500
      expect(response.status).toBe(500);
    }
  });

  test("should allow request with start_datetime and end_datetime < currentTimestamp when headers are present", async ({
    tracker,
  }) => {
    const startDatetime = generateUniqueTestDatetime();
    const endDatetime = dayjs
      .tz(startDatetime, "Asia/Kolkata")
      .add(1, "hour")
      .format("YYYY-MM-DDTHH:mm:ss");
    const currentTimestamp = parseDateTimeInTimezone(endDatetime, "Asia/Kolkata");
    currentTimestamp.setHours(currentTimestamp.getHours() + 1); // currentTimestamp is 1 hour after endDatetime
    const run = await createRun(
      developerId,
      startDatetime,
      currentTimestamp.toISOString(),
      tracker
    );

    const query = createHistoricalCandlesQuery(TEST_SYMBOL, "5minute", startDatetime, endDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGetWithRunContext(
      `/v1/developer/candles?${queryString}`,
      developerToken,
      run.id,
      currentTimestamp,
      "Asia/Kolkata",
      { validateStatus: () => true }
    );

    // May return 200 or error from external API, but should not return 403
    expect(response.status).not.toBe(403);
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
      `/v1/developer/candles?${queryString}`,
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
      `/v1/developer/candles?${queryString}`,
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

  test("should allow request without headers (backward compatibility)", async () => {
    const query = createHistoricalCandlesQuery();
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/candles?${queryString}`,
      developerToken,
      { validateStatus: () => true }
    );

    // May return 200 or error from external API, but should not return 403
    expect(response.status).not.toBe(403);
  });
});
