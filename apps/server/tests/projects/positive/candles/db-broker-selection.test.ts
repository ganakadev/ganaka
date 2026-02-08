import { v1_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { parseDateTimeInTimezone } from "../../../../src/utils/timezone";
import {
  buildQueryString,
  createCandlesQuery,
  createDeveloperCandlesQuery,
  TEST_SYMBOL,
} from "../../../fixtures/test-data";
import { authenticatedGet } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { createTestCandles, createTestInstrument } from "../../../helpers/db-helpers";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";

dayjs.extend(utc);
dayjs.extend(timezone);

// Boundary dates for testing
const DB_BOUNDARY_START = "2025-11-01";
const DB_BOUNDARY_START_DATETIME = "2025-11-01T09:15:00";

// Helper to get boundary end (today - 1 day)
function getBoundaryEndDate(): string {
  return dayjs
    .tz(dayjs.utc().tz("Asia/Kolkata").format("YYYY-MM-DD"), "Asia/Kolkata")
    .subtract(1, "day")
    .format("YYYY-MM-DD");
}

function getBoundaryEndDatetime(): string {
  return dayjs
    .tz(dayjs.utc().tz("Asia/Kolkata").format("YYYY-MM-DD"), "Asia/Kolkata")
    .subtract(1, "day")
    .format("YYYY-MM-DDTHH:mm:ss");
}

// Date within DB range (between boundaries)
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

test.describe("GET /v1/candles - DB/Broker Selection", () => {
  test.describe("Dashboard Source - Date Range Boundaries", () => {
    test("should fetch from broker when date is before boundary start", async () => {
      const dateBeforeBoundary = "2025-10-31";
      const query = createCandlesQuery({
        symbol: TEST_SYMBOL,
        date: dateBeforeBoundary,
        interval: "1minute",
      });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "dashboard",
        },
        validateStatus: () => true,
      });

      // Should attempt broker fetch (may fail if API unavailable, but should not try DB)
      if (response.status === 200) {
        const body = response.data;
        expect(body.data.source).toBe("broker");
      } else {
        // External API failure is acceptable - we're testing selection logic
        expect([400, 500]).toContain(response.status);
      }
    });

    test("should fetch from db when date equals boundary start", async () => {
      const query = createCandlesQuery({
        symbol: TEST_SYMBOL,
        date: DB_BOUNDARY_START,
        interval: "1minute",
      });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "dashboard",
        },
        validateStatus: () => true,
      });

      // Strict isAfter check means equals should use broker
      if (response.status === 200) {
        const body = response.data;
        expect(body.data.source).toBe("db");
      } else {
        expect([400, 500]).toContain(response.status);
      }
    });

    test("should fetch from DB when date is between boundaries with 1minute interval", async ({
      tracker,
    }) => {
      // Create instrument and candles in DB
      const testSymbol = "TESTDB1";
      const instrument = await createTestInstrument(testSymbol, "Test DB Instrument 1", tracker);
      const testDate = DATE_IN_DB_RANGE;
      const marketStart = dayjs.tz(`${testDate} 09:15:00`, "Asia/Kolkata");

      // Create some test candles
      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: marketStart.add(0, "minute").toDate(),
            open: 100.0,
            high: 101.0,
            low: 99.0,
            close: 100.5,
            volume: BigInt(1000),
          },
          {
            timestamp: marketStart.add(1, "minute").toDate(),
            open: 100.5,
            high: 102.0,
            low: 100.0,
            close: 101.5,
            volume: BigInt(1500),
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
      expect(body.statusCode).toBe(200);
      expect(body.data.source).toBe("db");
      expect(body.data.candles).toBeInstanceOf(Array);
      expect(body.data.candles.length).toBeGreaterThan(0);
      expect(body.data.interval_in_minutes).toBe(1);
    });

    test("should fetch from db when date equals boundary end", async () => {
      const boundaryEndDate = getBoundaryEndDate();
      const query = createCandlesQuery({
        symbol: TEST_SYMBOL,
        date: boundaryEndDate,
        interval: "1minute",
      });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "dashboard",
        },
        validateStatus: () => true,
      });

      // Strict isBefore check means equals should use broker
      if (response.status === 200) {
        const body = response.data;
        expect(body.data.source).toBe("db");
      } else {
        expect([400, 500]).toContain(response.status);
      }
    });

    test("should fetch from broker when date is after boundary end", async () => {
      const today = dayjs.tz(dayjs.utc().tz("Asia/Kolkata").format("YYYY-MM-DD"), "Asia/Kolkata");
      const query = createCandlesQuery({
        symbol: TEST_SYMBOL,
        date: today.format("YYYY-MM-DD"),
        interval: "1minute",
      });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "dashboard",
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        const body = response.data;
        expect(body.data.source).toBe("broker");
      } else {
        expect([400, 500]).toContain(response.status);
      }
    });
  });

  test.describe("Dashboard Source - Interval Tests", () => {
    test("should fetch from broker when interval is not 1minute even if date is in DB range", async ({
      tracker,
    }) => {
      const testSymbol = "TESTDB2";
      await createTestInstrument(testSymbol, "Test DB Instrument 2", tracker);

      const query = createCandlesQuery({
        symbol: testSymbol,
        date: DATE_IN_DB_RANGE,
        interval: "5minute",
      });
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "dashboard",
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        const body = response.data;
        expect(body.data.source).toBe("broker");
      } else {
        expect([400, 500]).toContain(response.status);
      }
    });

    test("should fetch from DB when interval is 1minute and date is in DB range", async ({
      tracker,
    }) => {
      const testSymbol = "TESTDB3";
      const instrument = await createTestInstrument(testSymbol, "Test DB Instrument 3", tracker);
      const testDate = DATE_IN_DB_RANGE;
      const marketStart = dayjs.tz(`${testDate} 09:15:00`, "Asia/Kolkata");

      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: marketStart.add(0, "minute").toDate(),
            open: 200.0,
            high: 201.0,
            low: 199.0,
            close: 200.5,
            volume: BigInt(2000),
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
      expect(body.data.interval_in_minutes).toBe(1);
    });
  });

  test.describe("Dashboard Source - ignoreDb Parameter Tests", () => {
    test("should fetch from broker when ignoreDb=true even if conditions for DB are met", async ({
      tracker,
    }) => {
      const testSymbol = "TESTDB4";
      const instrument = await createTestInstrument(testSymbol, "Test DB Instrument 4", tracker);
      const testDate = DATE_IN_DB_RANGE;
      const marketStart = dayjs.tz(`${testDate} 09:15:00`, "Asia/Kolkata");

      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: marketStart.add(0, "minute").toDate(),
            open: 300.0,
            high: 301.0,
            low: 299.0,
            close: 300.5,
            volume: BigInt(3000),
          },
        ],
        tracker
      );

      const query = createCandlesQuery({ symbol: testSymbol, date: testDate, interval: "1minute" });
      const queryWithIgnoreDb = Object.assign({}, query, { ignoreDb: true });
      const queryString = buildQueryString(queryWithIgnoreDb);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "dashboard",
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        const body = response.data;
        expect(body.data.source).toBe("broker");
      } else {
        expect([400, 500]).toContain(response.status);
      }
    });

    test("should fetch from DB when ignoreDb=false and conditions for DB are met", async ({
      tracker,
    }) => {
      const testSymbol = "TESTDB5";
      const instrument = await createTestInstrument(testSymbol, "Test DB Instrument 5", tracker);
      const testDate = DATE_IN_DB_RANGE;
      const marketStart = dayjs.tz(`${testDate} 09:15:00`, "Asia/Kolkata");

      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: marketStart.toDate(),
            open: 400.0,
            high: 401.0,
            low: 399.0,
            close: 400.5,
            volume: BigInt(4000),
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
    });

    test("should fetch from DB when ignoreDb is not provided and conditions for DB are met", async ({
      tracker,
    }) => {
      const testSymbol = "TESTDB6";
      const instrument = await createTestInstrument(testSymbol, "Test DB Instrument 6", tracker);
      const testDate = DATE_IN_DB_RANGE;
      const marketStart = dayjs.tz(`${testDate} 09:15:00`, "Asia/Kolkata");

      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: marketStart.add(0, "minute").toDate(),
            open: 500.0,
            high: 501.0,
            low: 499.0,
            close: 500.5,
            volume: BigInt(5000),
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
    });
  });

  test.describe("Dashboard Source - Database Instrument Tests", () => {
    test("should return candles from DB when instrument exists with candles", async ({
      tracker,
    }) => {
      const testSymbol = "TESTDB7";
      const instrument = await createTestInstrument(testSymbol, "Test DB Instrument 7", tracker);
      const testDate = DATE_IN_DB_RANGE;
      const marketStart = dayjs.tz(`${testDate} 09:15:00`, "Asia/Kolkata");

      const candles = [
        {
          timestamp: marketStart.add(0, "minute").toDate(),
          open: 600.0,
          high: 601.0,
          low: 599.0,
          close: 600.5,
          volume: BigInt(6000),
        },
        {
          timestamp: marketStart.add(1, "minute").toDate(),
          open: 600.5,
          high: 602.0,
          low: 600.0,
          close: 601.5,
          volume: BigInt(6500),
        },
        {
          timestamp: marketStart.add(2, "minute").toDate(),
          open: 601.5,
          high: 603.0,
          low: 601.0,
          close: 602.5,
          volume: BigInt(7000),
        },
      ];

      await createTestCandles(instrument.id, candles, tracker);

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
      expect(body.data.candles.length).toBe(3);

      // Verify chronological ordering
      for (let i = 1; i < body.data.candles.length; i++) {
        expect(body.data.candles[i].time).toBeGreaterThanOrEqual(body.data.candles[i - 1].time);
      }

      // Verify structure
      const firstCandle = body.data.candles[0];
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
    });

    test("should return empty candles array when instrument exists but no candles in range", async ({
      tracker,
    }) => {
      const testSymbol = "TESTDB8";
      await createTestInstrument(testSymbol, "Test DB Instrument 8", tracker);

      // Query for a date where no candles exist
      const query = createCandlesQuery({
        symbol: testSymbol,
        date: DATE_IN_DB_RANGE,
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
      expect(body.data.candles).toBeInstanceOf(Array);
      expect(body.data.candles.length).toBe(0);
    });

    test("should filter out candles with null OHLC values", async ({ tracker }) => {
      const testSymbol = "TESTDB9";
      const instrument = await createTestInstrument(testSymbol, "Test DB Instrument 9", tracker);
      const testDate = DATE_IN_DB_RANGE;
      const marketStart = dayjs.tz(`${testDate} 09:15:00`, "Asia/Kolkata");

      // Create candles with some having null values
      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: marketStart.add(0, "minute").toDate(),
            open: 700.0,
            high: 701.0,
            low: 699.0,
            close: 700.5,
            volume: BigInt(7000),
          },
          {
            timestamp: marketStart.add(1, "minute").toDate(),
            open: null,
            high: 702.0,
            low: 700.0,
            close: 701.5,
            volume: BigInt(7500),
          },
          {
            timestamp: marketStart.add(2, "minute").toDate(),
            open: 701.5,
            high: null,
            low: 701.0,
            close: 702.5,
            volume: BigInt(8000),
          },
          {
            timestamp: marketStart.add(3, "minute").toDate(),
            open: 702.5,
            high: 703.0,
            low: null,
            close: 703.5,
            volume: BigInt(8500),
          },
          {
            timestamp: marketStart.add(4, "minute").toDate(),
            open: 703.5,
            high: 704.0,
            low: 703.0,
            close: null,
            volume: BigInt(9000),
          },
          {
            timestamp: marketStart.add(5, "minute").toDate(),
            open: 704.5,
            high: 705.0,
            low: 704.0,
            close: 705.5,
            volume: BigInt(9500),
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
      // Should only return candles with complete OHLC values
      expect(body.data.candles.length).toBe(2); // First and last candles
      expect(body.data.candles[0].open).toBe(700.0);
      expect(body.data.candles[1].open).toBe(704.5);
    });
  });

  test.describe("Developer Source - Datetime Range Boundaries", () => {
    test("should fetch from broker when start_datetime is before boundary start", async () => {
      const startDatetime = "2025-10-31T09:15:00";
      const endDatetime = "2025-10-31T15:30:00";
      const query = createDeveloperCandlesQuery(TEST_SYMBOL, "1minute", startDatetime, endDatetime);
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "developer",
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        const validatedData = v1_schemas.v1_candles_schemas.getDeveloperCandles.response.parse(
          response.data
        );
        expect(validatedData.data.payload.source).toBe("broker");
      } else {
        expect([400, 500]).toContain(response.status);
      }
    });

    test("should fetch from db when start_datetime equals boundary start", async () => {
      const startDatetime = DB_BOUNDARY_START_DATETIME;
      const endDatetime = "2025-11-01T15:30:00";
      const query = createDeveloperCandlesQuery(TEST_SYMBOL, "1minute", startDatetime, endDatetime);
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "developer",
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        const validatedData = v1_schemas.v1_candles_schemas.getDeveloperCandles.response.parse(
          response.data
        );
        expect(validatedData.data.payload.source).toBe("db");
      } else {
        expect([400, 500]).toContain(response.status);
      }
    });

    test("should fetch from DB when start_datetime and end_datetime are between boundaries", async ({
      tracker,
    }) => {
      const testSymbol = "TESTDEV1";
      const instrument = await createTestInstrument(testSymbol, "Test Dev Instrument 1", tracker);
      const startDatetime = DATETIME_IN_DB_RANGE_START;
      const endDatetime = DATETIME_IN_DB_RANGE_END;
      const startUTC = parseDateTimeInTimezone(startDatetime, "Asia/Kolkata");

      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: startUTC,
            open: 800.0,
            high: 801.0,
            low: 799.0,
            close: 800.5,
            volume: BigInt(8000),
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
      const validatedData = v1_schemas.v1_candles_schemas.getDeveloperCandles.response.parse(
        response.data
      );
      expect(validatedData.data.payload.source).toBe("db");
      expect(validatedData.data.payload.interval_in_minutes).toBe(1);
    });

    test("should fetch from db when end_datetime equals boundary end", async () => {
      const boundaryEndDatetime = getBoundaryEndDatetime();
      const startDatetime = dayjs
        .tz(boundaryEndDatetime, "Asia/Kolkata")
        .subtract(1, "hour")
        .format("YYYY-MM-DDTHH:mm:ss");
      const query = createDeveloperCandlesQuery(
        TEST_SYMBOL,
        "1minute",
        startDatetime,
        boundaryEndDatetime
      );
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "developer",
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        const validatedData = v1_schemas.v1_candles_schemas.getDeveloperCandles.response.parse(
          response.data
        );
        expect(validatedData.data.payload.source).toBe("db");
      } else {
        expect([400, 500]).toContain(response.status);
      }
    });

    test("should fetch from broker when end_datetime is after boundary end", async () => {
      const today = dayjs.tz(dayjs.utc().tz("Asia/Kolkata").format("YYYY-MM-DD"), "Asia/Kolkata");
      const startDatetime = today.subtract(1, "hour").format("YYYY-MM-DDTHH:mm:ss");
      const endDatetime = today.format("YYYY-MM-DDTHH:mm:ss");
      const query = createDeveloperCandlesQuery(TEST_SYMBOL, "1minute", startDatetime, endDatetime);
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "developer",
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        const validatedData = v1_schemas.v1_candles_schemas.getDeveloperCandles.response.parse(
          response.data
        );
        expect(validatedData.data.payload.source).toBe("broker");
      } else {
        expect([400, 500]).toContain(response.status);
      }
    });

    test("should fetch from broker when start_datetime is before boundary and end_datetime is within boundary", async () => {
      const startDatetime = "2025-10-31T15:30:00";
      const endDatetime = DATETIME_IN_DB_RANGE_END;
      const query = createDeveloperCandlesQuery(TEST_SYMBOL, "1minute", startDatetime, endDatetime);
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "developer",
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        const validatedData = v1_schemas.v1_candles_schemas.getDeveloperCandles.response.parse(
          response.data
        );
        expect(validatedData.data.payload.source).toBe("broker");
      } else {
        expect([400, 500]).toContain(response.status);
      }
    });

    test("should fetch from broker when start_datetime is within boundary and end_datetime is after boundary", async () => {
      const startDatetime = DATETIME_IN_DB_RANGE_START;
      const today = dayjs.tz(dayjs.utc().tz("Asia/Kolkata").format("YYYY-MM-DD"), "Asia/Kolkata");
      const endDatetime = today.format("YYYY-MM-DDTHH:mm:ss");
      const query = createDeveloperCandlesQuery(TEST_SYMBOL, "1minute", startDatetime, endDatetime);
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "developer",
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        const validatedData = v1_schemas.v1_candles_schemas.getDeveloperCandles.response.parse(
          response.data
        );
        expect(validatedData.data.payload.source).toBe("broker");
      } else {
        expect([400, 500]).toContain(response.status);
      }
    });
  });

  test.describe("Developer Source - Interval Tests", () => {
    test("should fetch from broker when interval is not 1minute even if datetime range is in DB boundaries", async ({
      tracker,
    }) => {
      const testSymbol = "TESTDEV2";
      await createTestInstrument(testSymbol, "Test Dev Instrument 2", tracker);

      const query = createDeveloperCandlesQuery(
        testSymbol,
        "5minute",
        DATETIME_IN_DB_RANGE_START,
        DATETIME_IN_DB_RANGE_END
      );
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "developer",
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        const validatedData = v1_schemas.v1_candles_schemas.getDeveloperCandles.response.parse(
          response.data
        );
        expect(validatedData.data.payload.source).toBe("broker");
      } else {
        expect([400, 500]).toContain(response.status);
      }
    });

    test("should fetch from DB when interval is 1minute and datetime range is in DB boundaries", async ({
      tracker,
    }) => {
      const testSymbol = "TESTDEV3";
      const instrument = await createTestInstrument(testSymbol, "Test Dev Instrument 3", tracker);
      const startDatetime = DATETIME_IN_DB_RANGE_START;
      const endDatetime = DATETIME_IN_DB_RANGE_END;
      const startUTC = parseDateTimeInTimezone(startDatetime, "Asia/Kolkata");

      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: startUTC,
            open: 900.0,
            high: 901.0,
            low: 899.0,
            close: 900.5,
            volume: BigInt(9000),
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
      const validatedData = v1_schemas.v1_candles_schemas.getDeveloperCandles.response.parse(
        response.data
      );
      expect(validatedData.data.payload.source).toBe("db");
      expect(validatedData.data.payload.interval_in_minutes).toBe(1);
    });
  });

  test.describe("Developer Source - ignoreDb Parameter Tests", () => {
    test("should fetch from broker when ignoreDb=true even if conditions for DB are met", async ({
      tracker,
    }) => {
      const testSymbol = "TESTDEV4";
      const instrument = await createTestInstrument(testSymbol, "Test Dev Instrument 4", tracker);
      const startDatetime = DATETIME_IN_DB_RANGE_START;
      const endDatetime = DATETIME_IN_DB_RANGE_END;
      const startUTC = parseDateTimeInTimezone(startDatetime, "Asia/Kolkata");

      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: startUTC,
            open: 1000.0,
            high: 1001.0,
            low: 999.0,
            close: 1000.5,
            volume: BigInt(10000),
          },
        ],
        tracker
      );

      const query = createDeveloperCandlesQuery(testSymbol, "1minute", startDatetime, endDatetime);
      const queryWithIgnoreDb = Object.assign({}, query, { ignoreDb: true });
      const queryString = buildQueryString(queryWithIgnoreDb);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "developer",
        },
        validateStatus: () => true,
      });

      if (response.status === 200) {
        const validatedData = v1_schemas.v1_candles_schemas.getDeveloperCandles.response.parse(
          response.data
        );
        expect(validatedData.data.payload.source).toBe("broker");
      } else {
        expect([400, 500]).toContain(response.status);
      }
    });

    test("should fetch from DB when ignoreDb=false and conditions for DB are met", async ({
      tracker,
    }) => {
      const testSymbol = "TESTDEV5";
      const instrument = await createTestInstrument(testSymbol, "Test Dev Instrument 5", tracker);
      const startDatetime = DATETIME_IN_DB_RANGE_START;
      const endDatetime = DATETIME_IN_DB_RANGE_END;
      const startUTC = parseDateTimeInTimezone(startDatetime, "Asia/Kolkata");

      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: startUTC,
            open: 1100.0,
            high: 1101.0,
            low: 1099.0,
            close: 1100.5,
            volume: BigInt(11000),
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
      const validatedData = v1_schemas.v1_candles_schemas.getDeveloperCandles.response.parse(
        response.data
      );
      expect(validatedData.data.payload.source).toBe("db");
    });

    test("should fetch from DB when ignoreDb is not provided and conditions for DB are met", async ({
      tracker,
    }) => {
      const testSymbol = "TESTDEV6";
      const instrument = await createTestInstrument(testSymbol, "Test Dev Instrument 6", tracker);
      const startDatetime = DATETIME_IN_DB_RANGE_START;
      const endDatetime = DATETIME_IN_DB_RANGE_END;
      const startUTC = parseDateTimeInTimezone(startDatetime, "Asia/Kolkata");

      await createTestCandles(
        instrument.id,
        [
          {
            timestamp: startUTC,
            open: 1200.0,
            high: 1201.0,
            low: 1199.0,
            close: 1200.5,
            volume: BigInt(12000),
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
      const validatedData = v1_schemas.v1_candles_schemas.getDeveloperCandles.response.parse(
        response.data
      );
      expect(validatedData.data.payload.source).toBe("db");
    });
  });

  test.describe("Developer Source - Database Instrument Tests", () => {
    test("should return candles from DB when instrument exists with candles in range", async ({
      tracker,
    }) => {
      const testSymbol = "TESTDEV7";
      const instrument = await createTestInstrument(testSymbol, "Test Dev Instrument 7", tracker);
      const startDatetime = DATETIME_IN_DB_RANGE_START;
      const endDatetime = DATETIME_IN_DB_RANGE_END;
      const startUTC = parseDateTimeInTimezone(startDatetime, "Asia/Kolkata");

      const candles = [
        {
          timestamp: startUTC,
          open: 1300.0,
          high: 1301.0,
          low: 1299.0,
          close: 1300.5,
          volume: BigInt(13000),
        },
        {
          timestamp: dayjs.utc(startUTC).add(1, "minute").toDate(),
          open: 1300.5,
          high: 1302.0,
          low: 1300.0,
          close: 1301.5,
          volume: BigInt(13500),
        },
      ];

      await createTestCandles(instrument.id, candles, tracker);

      const query = createDeveloperCandlesQuery(testSymbol, "1minute", startDatetime, endDatetime);
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "developer",
        },
      });

      expect(response.status).toBe(200);
      const validatedData = v1_schemas.v1_candles_schemas.getDeveloperCandles.response.parse(
        response.data
      );
      expect(validatedData.data.payload.source).toBe("db");
      expect(validatedData.data.payload.candles.length).toBe(2);

      // Verify structure matches developer format (includes volume, turnover)
      const firstCandle = validatedData.data.payload.candles[0];
      expect(Array.isArray(firstCandle)).toBe(true);
      expect(firstCandle.length).toBeGreaterThanOrEqual(5); // timestamp, open, high, low, close, volume, turnover
    });

    test("should return empty candles array when instrument exists but no candles in datetime range", async ({
      tracker,
    }) => {
      const testSymbol = "TESTDEV8";
      await createTestInstrument(testSymbol, "Test Dev Instrument 8", tracker);

      const query = createDeveloperCandlesQuery(
        testSymbol,
        "1minute",
        DATETIME_IN_DB_RANGE_START,
        DATETIME_IN_DB_RANGE_END
      );
      const queryString = buildQueryString(query);
      const response = await authenticatedGet(`/v1/candles?${queryString}`, developerToken, {
        headers: {
          "x-source": "developer",
        },
      });

      expect(response.status).toBe(200);
      const validatedData = v1_schemas.v1_candles_schemas.getDeveloperCandles.response.parse(
        response.data
      );
      expect(validatedData.data.payload.source).toBe("db");
      expect(validatedData.data.payload.candles).toBeInstanceOf(Array);
      expect(validatedData.data.payload.candles.length).toBe(0);
    });
  });
});
