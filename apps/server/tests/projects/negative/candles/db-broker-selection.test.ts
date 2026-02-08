import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { parseDateTimeInTimezone } from "../../../../src/utils/timezone";
import {
  buildQueryString,
  createCandlesQuery,
  createDeveloperCandlesQuery,
} from "../../../fixtures/test-data";
import { authenticatedGet } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { createTestCandles, createTestInstrument } from "../../../helpers/db-helpers";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";

dayjs.extend(utc);
dayjs.extend(timezone);

// Boundary dates for testing
const DATE_IN_DB_RANGE = "2025-12-01";
const DATETIME_IN_DB_RANGE_START = "2025-12-01T09:15:00";
const DATETIME_IN_DB_RANGE_END = "2025-12-01T15:30:00";

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

test.describe("GET /v1/candles - DB/Broker Selection Edge Cases", () => {
  test.describe("Dashboard Source - Null Value Filtering", () => {
    test("should filter out candles with null open value", async ({ tracker }) => {
      const testSymbol = "TESTNULL1";
      const instrument = await createTestInstrument(testSymbol, "Test Null Instrument 1", tracker);
      const testDate = DATE_IN_DB_RANGE;
      const marketStart = dayjs.tz(`${testDate} 09:15:00`, "Asia/Kolkata");

      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: marketStart.add(0, "minute").toDate(),
            open: 1500.0,
            high: 1501.0,
            low: 1499.0,
            close: 1500.5,
            volume: BigInt(15000),
          },
          {
            timestamp: marketStart.add(1, "minute").toDate(),
            open: null,
            high: 1502.0,
            low: 1500.0,
            close: 1501.5,
            volume: BigInt(15500),
          },
          {
            timestamp: marketStart.add(2, "minute").toDate(),
            open: 1501.5,
            high: 1503.0,
            low: 1501.0,
            close: 1502.5,
            volume: BigInt(16000),
          },
        ],
        tracker
      );

      const query = createCandlesQuery({ symbol: testSymbol, date: testDate, interval: "1minute" });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "dashboard",
        },
      });

      expect(response.status).toBe(200);
      const body = response.data;
      expect(body.data.candles.length).toBe(2);
      expect(body.data.candles[0].open).toBe(1500.0);
      expect(body.data.candles[1].open).toBe(1501.5);
    });

    test("should filter out candles with null high value", async ({ tracker }) => {
      const testSymbol = "TESTNULL2";
      const instrument = await createTestInstrument(testSymbol, "Test Null Instrument 2", tracker);
      const testDate = DATE_IN_DB_RANGE;
      const marketStart = dayjs.tz(`${testDate} 09:15:00`, "Asia/Kolkata");

      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: marketStart.add(0, "minute").toDate(),
            open: 1600.0,
            high: null,
            low: 1599.0,
            close: 1600.5,
            volume: BigInt(16000),
          },
          {
            timestamp: marketStart.add(1, "minute").toDate(),
            open: 1600.5,
            high: 1602.0,
            low: 1600.0,
            close: 1601.5,
            volume: BigInt(16500),
          },
        ],
        tracker
      );

      const query = createCandlesQuery({ symbol: testSymbol, date: testDate, interval: "1minute" });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "dashboard",
        },
      });

      expect(response.status).toBe(200);
      const body = response.data;
      expect(body.data.candles.length).toBe(1);
      expect(body.data.candles[0].open).toBe(1600.5);
    });

    test("should filter out candles with null low value", async ({ tracker }) => {
      const testSymbol = "TESTNULL3";
      const instrument = await createTestInstrument(testSymbol, "Test Null Instrument 3", tracker);
      const testDate = DATE_IN_DB_RANGE;
      const marketStart = dayjs.tz(`${testDate} 09:15:00`, "Asia/Kolkata");

      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: marketStart.add(0, "minute").toDate(),
            open: 1700.0,
            high: 1701.0,
            low: null,
            close: 1700.5,
            volume: BigInt(17000),
          },
          {
            timestamp: marketStart.add(1, "minute").toDate(),
            open: 1700.5,
            high: 1702.0,
            low: 1700.0,
            close: 1701.5,
            volume: BigInt(17500),
          },
        ],
        tracker
      );

      const query = createCandlesQuery({ symbol: testSymbol, date: testDate, interval: "1minute" });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "dashboard",
        },
      });

      expect(response.status).toBe(200);
      const body = response.data;
      expect(body.data.candles.length).toBe(1);
      expect(body.data.candles[0].open).toBe(1700.5);
    });

    test("should filter out candles with null close value", async ({ tracker }) => {
      const testSymbol = "TESTNULL4";
      const instrument = await createTestInstrument(testSymbol, "Test Null Instrument 4", tracker);
      const testDate = DATE_IN_DB_RANGE;
      const marketStart = dayjs.tz(`${testDate} 09:15:00`, "Asia/Kolkata");

      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: marketStart.add(0, "minute").toDate(),
            open: 1800.0,
            high: 1801.0,
            low: 1799.0,
            close: null,
            volume: BigInt(18000),
          },
          {
            timestamp: marketStart.add(1, "minute").toDate(),
            open: 1800.5,
            high: 1802.0,
            low: 1800.0,
            close: 1801.5,
            volume: BigInt(18500),
          },
        ],
        tracker
      );

      const query = createCandlesQuery({ symbol: testSymbol, date: testDate, interval: "1minute" });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "dashboard",
        },
      });

      expect(response.status).toBe(200);
      const body = response.data;
      expect(body.data.candles.length).toBe(1);
      expect(body.data.candles[0].open).toBe(1800.5);
    });

    test("should filter out candles with multiple null values", async ({ tracker }) => {
      const testSymbol = "TESTNULL5";
      const instrument = await createTestInstrument(testSymbol, "Test Null Instrument 5", tracker);
      const testDate = DATE_IN_DB_RANGE;
      const marketStart = dayjs.tz(`${testDate} 09:15:00`, "Asia/Kolkata");

      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: marketStart.add(0, "minute").toDate(),
            open: 1900.0,
            high: 1901.0,
            low: 1899.0,
            close: 1900.5,
            volume: BigInt(19000),
          },
          {
            timestamp: marketStart.add(1, "minute").toDate(),
            open: null,
            high: null,
            low: 1900.0,
            close: 1901.5,
            volume: BigInt(19500),
          },
          {
            timestamp: marketStart.add(2, "minute").toDate(),
            open: 1901.5,
            high: 1903.0,
            low: null,
            close: null,
            volume: BigInt(20000),
          },
          {
            timestamp: marketStart.add(3, "minute").toDate(),
            open: 1902.5,
            high: 1904.0,
            low: 1902.0,
            close: 1903.5,
            volume: BigInt(20500),
          },
        ],
        tracker
      );

      const query = createCandlesQuery({ symbol: testSymbol, date: testDate, interval: "1minute" });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "dashboard",
        },
      });

      expect(response.status).toBe(200);
      const body = response.data;
      expect(body.data.candles.length).toBe(2);
      expect(body.data.candles[0].open).toBe(1900.0);
      expect(body.data.candles[1].open).toBe(1902.5);
    });
  });

  test.describe("Developer Source - Null Value Filtering", () => {
    test("should filter out candles with null OHLC values", async ({ tracker }) => {
      const testSymbol = "TESTNULL6";
      const instrument = await createTestInstrument(testSymbol, "Test Null Instrument 6", tracker);
      const startDatetime = DATETIME_IN_DB_RANGE_START;
      const endDatetime = DATETIME_IN_DB_RANGE_END;
      const startUTC = parseDateTimeInTimezone(startDatetime, "Asia/Kolkata");

      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: startUTC,
            open: 2000.0,
            high: 2001.0,
            low: 1999.0,
            close: 2000.5,
            volume: BigInt(20000),
          },
          {
            timestamp: dayjs.utc(startUTC).add(1, "minute").toDate(),
            open: null,
            high: 2002.0,
            low: 2000.0,
            close: 2001.5,
            volume: BigInt(20500),
          },
          {
            timestamp: dayjs.utc(startUTC).add(2, "minute").toDate(),
            open: 2001.5,
            high: 2003.0,
            low: 2001.0,
            close: 2002.5,
            volume: BigInt(21000),
          },
        ],
        tracker
      );

      const query = createDeveloperCandlesQuery(testSymbol, "1minute", startDatetime, endDatetime);
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "developer",
        },
      });

      expect(response.status).toBe(200);
      const body = response.data;
      expect(body.data.payload.candles.length).toBe(2);
    });
  });

  test.describe("Boundary Calculation Tests", () => {
    test("should correctly calculate boundary end as today - 1 day", async ({ tracker }) => {
      const testSymbol = "TESTBOUNDARY1";
      const instrument = await createTestInstrument(
        testSymbol,
        "Test Boundary Instrument 1",
        tracker
      );

      // Get today and yesterday
      const today = dayjs.utc().tz("Asia/Kolkata");
      const yesterday = today.subtract(1, "day");
      const dayBeforeYesterday = today.subtract(2, "day");

      // Create candles for day before yesterday (should be in DB range)
      const marketStart = dayjs.tz(
        `${dayBeforeYesterday.format("YYYY-MM-DD")} 09:15:00`,
        "Asia/Kolkata"
      );
      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: marketStart.add(0, "minute").toDate(),
            open: 2100.0,
            high: 2101.0,
            low: 2099.0,
            close: 2100.5,
            volume: BigInt(21000),
          },
        ],
        tracker
      );

      // Query for day before yesterday - should fetch from DB
      const query = createCandlesQuery({
        symbol: testSymbol,
        date: dayBeforeYesterday.format("YYYY-MM-DD"),
        interval: "1minute",
      });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "dashboard",
        },
      });

      expect(response.status).toBe(200);
      const body = response.data;
      expect(body.data.source).toBe("db");

      // Query for yesterday - should fetch from broker (boundary end is yesterday)
      const queryYesterday = createCandlesQuery({
        symbol: testSymbol,
        date: yesterday.format("YYYY-MM-DD"),
        interval: "1minute",
      });
      const queryStringYesterday = buildQueryString(queryYesterday);
      const responseYesterday = await authenticatedGet(
        `/v1/candles?${queryStringYesterday}`,
        developerToken,
        {
          headers: {
            "x-source": "dashboard",
          },
          validateStatus: () => true,
        }
      );

      // Yesterday equals boundary end, so should use db
      if (responseYesterday.status === 200) {
        expect(responseYesterday.data.data.source).toBe("db");
      } else {
        expect([400, 500]).toContain(responseYesterday.status);
      }
    });
  });

  test.describe("Empty Response Tests", () => {
    test("should return empty array when instrument exists but query returns no results", async ({
      tracker,
    }) => {
      const testSymbol = "TESTEMPTY1";
      const instrument = await createTestInstrument(testSymbol, "Test Empty Instrument 1", tracker);
      const testDate = DATE_IN_DB_RANGE;
      const marketStart = dayjs.tz(`${testDate} 09:15:00`, "Asia/Kolkata");

      // Create candles for a different time range
      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: marketStart.add(10, "hour").toDate(), // Outside market hours
            open: 2300.0,
            high: 2301.0,
            low: 2299.0,
            close: 2300.5,
            volume: BigInt(23000),
          },
        ],
        tracker
      );

      // Query for market hours (9:15 - 15:30) - should return empty
      const query = createCandlesQuery({ symbol: testSymbol, date: testDate, interval: "1minute" });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "dashboard",
        },
      });

      expect(response.status).toBe(200);
      const body = response.data;
      expect(body.data.source).toBe("db");
      expect(body.data.candles).toBeInstanceOf(Array);
      expect(body.data.candles.length).toBe(0);
    });
  });

  test.describe("Boundary Timestamp Tests", () => {
    test("should handle candles at exact boundary timestamps", async ({ tracker }) => {
      const testSymbol = "TESTBOUNDARY2";
      const instrument = await createTestInstrument(
        testSymbol,
        "Test Boundary Instrument 2",
        tracker
      );
      const testDate = DATE_IN_DB_RANGE;
      const marketStart = dayjs.tz(`${testDate} 09:15:00`, "Asia/Kolkata");
      const marketEnd = dayjs.tz(`${testDate} 15:30:00`, "Asia/Kolkata");

      // Create candles at exact market start and end times
      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: marketStart.toDate(),
            open: 2400.0,
            high: 2401.0,
            low: 2399.0,
            close: 2400.5,
            volume: BigInt(24000),
          },
          {
            timestamp: marketEnd.toDate(),
            open: 2400.5,
            high: 2402.0,
            low: 2400.0,
            close: 2401.5,
            volume: BigInt(24500),
          },
        ],
        tracker
      );

      const query = createCandlesQuery({ symbol: testSymbol, date: testDate, interval: "1minute" });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "dashboard",
        },
      });

      expect(response.status).toBe(200);
      const body = response.data;
      expect(body.data.source).toBe("db");
      expect(body.data.candles.length).toBeGreaterThanOrEqual(2);
    });
  });
});
