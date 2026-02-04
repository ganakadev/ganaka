import { authenticatedGet, authenticatedDelete } from "../../../helpers/api-client";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";
import { createShortlistSnapshot, createQuoteSnapshot } from "../../../helpers/db-helpers";
import { createValidGrowwQuotePayload } from "../../../fixtures/test-data";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { v1_schemas } from "@ganaka/schemas";
import {
  createValidShortlistEntries,
  generateUniqueTestDatetime,
} from "../../../fixtures/test-data";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

let adminToken: string;
let developerToken: string;
let sharedTracker: TestDataTracker;

test.beforeAll(async () => {
  const token = process.env.TEST_ADMIN_TOKEN;
  if (!token) {
    throw new Error("TEST_ADMIN_TOKEN not set in environment");
  }
  adminToken = token;
  sharedTracker = new TestDataTracker();
  const dev = await createDeveloperUser(undefined, sharedTracker);
  developerToken = dev.token;
});

test.afterAll(async () => {
  if (sharedTracker) {
    await sharedTracker.cleanup();
  }
});

test.describe("GET /v1/dates", () => {
  test.describe.configure({ mode: "serial" });

  test.describe("Admin Role", () => {
    test("should return dates with data counts", async ({ tracker }) => {
      // Create test data for a specific date
      const dateStr = "2025-09-15";

      // Create shortlist snapshot
      await createShortlistSnapshot(
        "TOP_GAINERS",
        `${dateStr}T10:00:00`,
        [{ nseSymbol: "RELIANCE", name: "Reliance Industries", price: 2500 }],
        tracker,
        "Asia/Kolkata",
        "TOP_5"
      );

      // Create quote snapshot
      await createQuoteSnapshot(
        "RELIANCE",
        `${dateStr}T10:00:00`,
        createValidGrowwQuotePayload(),
        tracker,
        "Asia/Kolkata"
      );

      const response = await authenticatedGet("/v1/dates", adminToken);

      expect(response.status).toBe(200);
      const body = response.data;
      expect(body.data.dates.length).toBeGreaterThan(0);
      const dateInfo = body.data.dates.find((d: { date: string }) => d.date === dateStr);
      expect(dateInfo).toBeDefined();
      expect(dateInfo.shortlistCount).toBeGreaterThan(0);
    });
  });

  test.describe("Developer Role", () => {
    test("should return dates grouped by date with timestamps sorted ascending", async ({
      tracker,
    }) => {
      // Create snapshots for testing
      const testDatetime = generateUniqueTestDatetime();
      const testEntries = createValidShortlistEntries();
      await createShortlistSnapshot("TOP_GAINERS", testDatetime, testEntries, tracker);

      // Create another snapshot on the same date but different time
      const baseDate = testDatetime.split("T")[0];
      const anotherDatetime = `${baseDate}T11:00:00`;
      await createShortlistSnapshot("TOP_GAINERS", anotherDatetime, testEntries, tracker);

      // Create snapshot on different date
      const differentDate = generateUniqueTestDatetime("2025-12-27");
      await createShortlistSnapshot("VOLUME_SHOCKERS", differentDate, testEntries, tracker);

      const response = await authenticatedGet("/v1/dates", developerToken);

      expect(response.status).toBe(200);
      const body = response.data;
      expect(body.statusCode).toBe(200);
      expect(body.message).toBe("Dates fetched successfully");

      // Validate response matches schema
      const validatedData = v1_schemas.v1_dates_schemas.getDates.response.parse(body);
      expect(validatedData.data.dates).toBeInstanceOf(Array);
      expect(validatedData.data.dates.length).toBeGreaterThan(0);

      // Validate dates are grouped correctly
      const dateMap = new Map<string, string[]>();
      validatedData.data.dates.forEach((dateEntry) => {
        expect(dateEntry).toHaveProperty("date");
        expect(dateEntry).toHaveProperty("timestamps");
        expect(typeof dateEntry.date).toBe("string");
        expect(Array.isArray(dateEntry.timestamps)).toBe(true);
        dateMap.set(dateEntry.date, dateEntry.timestamps);
      });

      // Validate timestamps are sorted ascending within each date
      dateMap.forEach((timestamps) => {
        for (let i = 1; i < timestamps.length; i++) {
          const prevTimestamp = dayjs.utc(timestamps[i - 1]).valueOf();
          const currTimestamp = dayjs.utc(timestamps[i]).valueOf();
          expect(currTimestamp).toBeGreaterThanOrEqual(prevTimestamp);
        }
      });
    });

    test("should validate exact timestamp formats (ISO strings)", async ({ tracker }) => {
      const testDatetime = generateUniqueTestDatetime();
      const testEntries = createValidShortlistEntries();
      await createShortlistSnapshot("TOP_GAINERS", testDatetime, testEntries, tracker);

      const response = await authenticatedGet("/v1/dates", developerToken);

      expect(response.status).toBe(200);
      const validatedData = v1_schemas.v1_dates_schemas.getDates.response.parse(response.data);

      // Validate timestamp format (YYYY-MM-DDTHH:mm:ss - no milliseconds, no timezone)
      validatedData.data.dates.forEach((dateEntry) => {
        dateEntry.timestamps.forEach((timestamp) => {
          expect(typeof timestamp).toBe("string");
          // Strict format validation: exactly YYYY-MM-DDTHH:mm:ss (no milliseconds, no timezone)
          expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
          // Should be valid date
          expect(() => dayjs.utc(timestamp)).not.toThrow();
        });
      });
    });

    test("should validate response schema matches expected structure", async ({ tracker }) => {
      const testDatetime = generateUniqueTestDatetime();
      const testEntries = createValidShortlistEntries();
      await createShortlistSnapshot("TOP_GAINERS", testDatetime, testEntries, tracker);

      const response = await authenticatedGet("/v1/dates", developerToken);

      expect(response.status).toBe(200);
      const validatedData = v1_schemas.v1_dates_schemas.getDates.response.parse(response.data);

      expect(validatedData.statusCode).toBe(200);
      expect(validatedData.message).toBe("Dates fetched successfully");
      expect(validatedData.data).toHaveProperty("dates");
      expect(Array.isArray(validatedData.data.dates)).toBe(true);

      if (validatedData.data.dates.length > 0) {
        const firstDate = validatedData.data.dates[0];
        expect(firstDate).toHaveProperty("date");
        expect(firstDate).toHaveProperty("timestamps");
        expect(typeof firstDate.date).toBe("string");
        expect(Array.isArray(firstDate.timestamps)).toBe(true);
      }
    });

    test("should return dates in ascending order", async ({ tracker }) => {
      const testDatetime = generateUniqueTestDatetime();
      const testEntries = createValidShortlistEntries();
      // Create snapshots on different dates
      const date1 = generateUniqueTestDatetime("2025-12-25");
      await createShortlistSnapshot("TOP_GAINERS", date1, testEntries, tracker);
      await createShortlistSnapshot("TOP_GAINERS", testDatetime, testEntries, tracker);
      const date3 = generateUniqueTestDatetime("2025-12-27");
      await createShortlistSnapshot("TOP_GAINERS", date3, testEntries, tracker);

      const response = await authenticatedGet("/v1/dates", developerToken);

      expect(response.status).toBe(200);
      const validatedData = v1_schemas.v1_dates_schemas.getDates.response.parse(response.data);

      // Validate dates are sorted ascending
      for (let i = 1; i < validatedData.data.dates.length; i++) {
        const prevDate = validatedData.data.dates[i - 1].date;
        const currDate = validatedData.data.dates[i].date;
        expect(dayjs.utc(currDate).valueOf()).toBeGreaterThanOrEqual(dayjs.utc(prevDate).valueOf());
      }
    });

    test("should handle multiple dates correctly", async ({ tracker }) => {
      const testEntries = createValidShortlistEntries();
      const dates = ["2025-12-25", "2025-12-26", "2025-12-27"];

      // Create snapshots on different dates
      for (const date of dates) {
        await createShortlistSnapshot("TOP_GAINERS", `${date}T10:06:00`, testEntries, tracker);
      }

      const response = await authenticatedGet("/v1/dates", developerToken);

      expect(response.status).toBe(200);
      const validatedData = v1_schemas.v1_dates_schemas.getDates.response.parse(response.data);

      // Should have entries for all dates
      const returnedDates = validatedData.data.dates.map((d) => d.date);
      dates.forEach((date) => {
        expect(returnedDates).toContain(date);
      });
    });
  });
});

test.describe("DELETE /v1/dates", () => {
  test.describe("Admin Role", () => {
    test("should delete data for multiple dates", async ({ tracker }) => {
      // Create test data for two dates
      const date1 = "2025-11-15";
      const date2 = "2025-11-20";

      await createShortlistSnapshot(
        "TOP_GAINERS",
        `${date1}T10:00:00`,
        [{ nseSymbol: "RELIANCE", name: "Reliance Industries", price: 2500 }],
        tracker,
        "Asia/Kolkata",
        "TOP_5"
      );
      await createShortlistSnapshot(
        "TOP_GAINERS",
        `${date2}T10:00:00`,
        [{ nseSymbol: "TCS", name: "Tata Consultancy Services", price: 3500 }],
        tracker,
        "Asia/Kolkata",
        "TOP_5"
      );

      const response = await authenticatedDelete("/v1/dates", adminToken, {
        data: {
          dates: [date1, date2],
        },
        validateStatus: () => true,
      });

      expect(response.status).toBe(200);
      const body = response.data;
      expect(body.data.deleted.shortlists).toBeGreaterThanOrEqual(2);
    });
  });
});
