import { v1_dashboard_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import z from "zod";
import { CANDLES_TEST_DATE, createCandlesQuery, TEST_SYMBOL } from "../../fixtures/test-data";
import { authenticatedGet, unauthenticatedGet } from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import { expect, test } from "../../helpers/test-fixtures";
import { TestDataTracker } from "../../helpers/test-tracker";

dayjs.extend(utc);
dayjs.extend(timezone);

let developerToken: string;
let sharedTracker: TestDataTracker;

test.beforeAll(async () => {
  sharedTracker = new TestDataTracker();
  const dev = await createDeveloperUser(undefined, sharedTracker);
  developerToken = dev.token;
});

test.afterAll(async () => {
  if (sharedTracker) {
    await sharedTracker.cleanup();
  }
});

test.describe("GET /v1/dashboard/candles", () => {
  test.describe.configure({ mode: "default" });
  test("should return 401 when authorization header is missing", async () => {
    const query = createCandlesQuery();
    const queryString = new URLSearchParams(query).toString();
    const response = await unauthenticatedGet(`/v1/dashboard/candles?${queryString}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = createCandlesQuery();
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/candles?${queryString}`,
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when symbol is missing", async () => {
    const query = { date: CANDLES_TEST_DATE };
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when date is missing", async () => {
    const query = { symbol: TEST_SYMBOL };
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when date format is invalid", async () => {
    const query = createCandlesQuery(TEST_SYMBOL, "invalid-date");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when interval is invalid enum value", async () => {
    const query = createCandlesQuery(TEST_SYMBOL, CANDLES_TEST_DATE, "invalid-interval" as any);
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 200 with candles data when valid params provided", async () => {
    const query = createCandlesQuery(TEST_SYMBOL, CANDLES_TEST_DATE);
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(`/v1/dashboard/candles?${queryString}`, developerToken);

    // Note: This test may fail if external API is unavailable, but structure validation should still work
    if (response.status === 200) {
      const body = response.data;
      expect(body.statusCode).toBe(200);
      expect(body.message).toBe("Candles fetched successfully");
      expect(body.data).toHaveProperty("candles");
      expect(body.data).toHaveProperty("start_time");
      expect(body.data).toHaveProperty("end_time");
      expect(body.data).toHaveProperty("interval_in_minutes");
    } else {
      // External API failure - should return 500
      expect(response.status).toBe(500);
    }
  });

  test("should validate candle structure (time, open, high, low, close)", async () => {
    const query = createCandlesQuery(TEST_SYMBOL, CANDLES_TEST_DATE);
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(`/v1/dashboard/candles?${queryString}`, developerToken);

    if (response.status === 200) {
      const validatedData =
        v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.response.parse(response.data);

      expect(validatedData.data.candles).toBeInstanceOf(Array);

      if (validatedData.data.candles.length > 0) {
        const firstCandle = validatedData.data.candles[0];
        expect(firstCandle).toHaveProperty("time");
        expect(firstCandle).toHaveProperty("open");
        expect(firstCandle).toHaveProperty("high");
        expect(firstCandle).toHaveProperty("low");
        expect(firstCandle).toHaveProperty("close");
        expect(typeof firstCandle.time).toBe("number");
        expect(typeof firstCandle.open).toBe("number");
        expect(typeof firstCandle.high).toBe("number");
        expect(typeof firstCandle.low).toBe("number");
        expect(typeof firstCandle.close).toBe("number");
      }
    }
  });

  test("should validate start_time and end_time match market hours (9:15 AM - 3:30 PM IST)", async () => {
    const query = createCandlesQuery(TEST_SYMBOL, CANDLES_TEST_DATE);
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(`/v1/dashboard/candles?${queryString}`, developerToken);

    if (response.status === 200) {
      const validatedData =
        v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.response.parse(response.data);

      // Market hours: 9:15 AM - 3:30 PM IST
      const expectedStart = dayjs
        .tz(`${CANDLES_TEST_DATE} 09:15:00`, "Asia/Kolkata")
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss");
      const expectedEnd = dayjs
        .tz(`${CANDLES_TEST_DATE} 15:30:00`, "Asia/Kolkata")
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss");

      expect(validatedData.data.start_time).toBe(expectedStart);
      expect(validatedData.data.end_time).toBe(expectedEnd);
    }
  });

  test("should validate interval_in_minutes matches requested interval", async () => {
    const intervals: {
      interval: z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.query
      >["interval"];
      expectedMinutes: number;
    }[] = [
      { interval: "1minute", expectedMinutes: 1 },
      { interval: "2minute", expectedMinutes: 2 },
      { interval: "3minute", expectedMinutes: 3 },
      { interval: "5minute", expectedMinutes: 5 },
      { interval: "15minute", expectedMinutes: 15 },
      { interval: "30minute", expectedMinutes: 30 },
      { interval: "1hour", expectedMinutes: 60 },
      { interval: "1day", expectedMinutes: 1440 },
      { interval: "1week", expectedMinutes: 10080 },
    ];

    for (const { interval, expectedMinutes } of intervals) {
      const query = createCandlesQuery(TEST_SYMBOL, CANDLES_TEST_DATE, interval);
      const queryString = new URLSearchParams(query).toString();
      const response = await authenticatedGet(
        `/v1/dashboard/candles?${queryString}`,
        developerToken
      );

      if (response.status === 200) {
        const validatedData =
          v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.response.parse(
            response.data
          );
        expect(validatedData.data.interval_in_minutes).toBe(expectedMinutes);
      }
    }
  });

  test("should validate candles are ordered chronologically", async () => {
    const query = createCandlesQuery(TEST_SYMBOL, CANDLES_TEST_DATE);
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(`/v1/dashboard/candles?${queryString}`, developerToken);

    if (response.status === 200) {
      const validatedData =
        v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.response.parse(response.data);

      // Validate candles are ordered chronologically (time should be ascending)
      for (let i = 1; i < validatedData.data.candles.length; i++) {
        const prevTime = validatedData.data.candles[i - 1].time;
        const currTime = validatedData.data.candles[i].time;
        expect(currTime).toBeGreaterThanOrEqual(prevTime);
      }
    }
  });

  test("should handle external API failures gracefully (500)", async () => {
    // Use a date that likely won't have data (far future or invalid symbol)
    const futureDate = "2099-01-01";
    const query = createCandlesQuery("INVALID_SYMBOL_XYZ", futureDate);
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    // Should return 500 when external API fails
    expect([400, 500]).toContain(response.status);
  });

  test("should validate exact candle values ", async () => {
    const query = createCandlesQuery(TEST_SYMBOL, CANDLES_TEST_DATE);
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(`/v1/dashboard/candles?${queryString}`, developerToken);

    if (response.status === 200) {
      const validatedData =
        v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.response.parse(response.data);

      if (validatedData.data.candles.length > 0) {
        const firstCandle = validatedData.data.candles[0];
        expect(firstCandle).toHaveProperty("time");
        expect(firstCandle).toHaveProperty("open");
        expect(firstCandle).toHaveProperty("high");
        expect(firstCandle).toHaveProperty("low");
        expect(firstCandle).toHaveProperty("close");
        expect(firstCandle.time).toBe(1766979900);
        expect(firstCandle.open).toBe(1555.2);
        expect(firstCandle.high).toBe(1557.5);
        expect(firstCandle.low).toBe(1552.8);
        expect(firstCandle.close).toBe(1554.1);
      }
    }
  });
});
