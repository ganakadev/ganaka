import { v1_developer_available_dates_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { createValidShortlistEntries, generateUniqueTestDatetime } from "../../fixtures/test-data";
import { authenticatedGet, unauthenticatedGet } from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import { createShortlistSnapshot } from "../../helpers/db-helpers";
import { expect, test } from "../../helpers/test-fixtures";
import { TestDataTracker } from "../../helpers/test-tracker";

dayjs.extend(utc);
dayjs.extend(timezone);

let developerToken: string;
let adminToken: string;
let sharedTracker: TestDataTracker;

test.beforeAll(async () => {
  sharedTracker = new TestDataTracker();
  const dev = await createDeveloperUser(undefined, sharedTracker);
  developerToken = dev.token;

  const token = process.env.TEST_ADMIN_TOKEN;
  if (!token) {
    throw new Error("TEST_ADMIN_TOKEN not set in environment");
  }
  adminToken = token;
});

test.afterAll(async () => {
  if (sharedTracker) {
    await sharedTracker.cleanup();
  }
});

test.describe("GET /v1/dates", () => {
  test.describe.configure({ mode: "serial" });
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet("/v1/dates");

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization header is required");
  });

  test("should return 401 when invalid developer token is provided", async () => {
    const response = await authenticatedGet("/v1/dates", "invalid-token-12345", {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization failed");
  });

  test("should return 200 with empty dates array when no snapshots exist", async () => {
    const response = await authenticatedGet("/v1/dates", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Available dates fetched successfully");
    expect(body.data.dates).toBeInstanceOf(Array);

    // Validate response matches schema
    const validatedData =
      v1_developer_available_dates_schemas.getAvailableDates.response.parse(body);
    expect(validatedData.data.dates).toBeInstanceOf(Array);
  });

  test("should return dates grouped by date with timestamps sorted ascending", async ({
    tracker,
  }) => {
    // Create snapshots for testing
    const testDatetime = generateUniqueTestDatetime();
    const testEntries = createValidShortlistEntries();
    await createShortlistSnapshot("top-gainers", testDatetime, testEntries, tracker);

    // Create another snapshot on the same date but different time
    const baseDate = testDatetime.split("T")[0];
    const anotherDatetime = `${baseDate}T11:00:00`;
    await createShortlistSnapshot("top-gainers", anotherDatetime, testEntries, tracker);

    // Create snapshot on different date
    const differentDate = generateUniqueTestDatetime("2025-12-27");
    await createShortlistSnapshot("volume-shockers", differentDate, testEntries, tracker);

    const response = await authenticatedGet("/v1/dates", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Available dates fetched successfully");

    // Validate response matches schema
    const validatedData =
      v1_developer_available_dates_schemas.getAvailableDates.response.parse(body);
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
    await createShortlistSnapshot("top-gainers", testDatetime, testEntries, tracker);

    const response = await authenticatedGet("/v1/dates", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_available_dates_schemas.getAvailableDates.response.parse(
      response.data
    );

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
    await createShortlistSnapshot("top-gainers", testDatetime, testEntries, tracker);

    const response = await authenticatedGet("/v1/dates", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_available_dates_schemas.getAvailableDates.response.parse(
      response.data
    );

    expect(validatedData.statusCode).toBe(200);
    expect(validatedData.message).toBe("Available dates fetched successfully");
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
    await createShortlistSnapshot("top-gainers", date1, testEntries, tracker);
    await createShortlistSnapshot("top-gainers", testDatetime, testEntries, tracker);
    const date3 = generateUniqueTestDatetime("2025-12-27");
    await createShortlistSnapshot("top-gainers", date3, testEntries, tracker);

    const response = await authenticatedGet("/v1/dates", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_available_dates_schemas.getAvailableDates.response.parse(
      response.data
    );

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
      await createShortlistSnapshot("top-gainers", `${date}T10:06:00`, testEntries, tracker);
    }

    const response = await authenticatedGet("/v1/dates", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_available_dates_schemas.getAvailableDates.response.parse(
      response.data
    );

    // Should have entries for all dates
    const returnedDates = validatedData.data.dates.map((d) => d.date);
    dates.forEach((date) => {
      expect(returnedDates).toContain(date);
    });
  });

  test("should group timestamps correctly by date", async ({ tracker }) => {
    const testEntries = createValidShortlistEntries();
    const baseDate = "2025-12-28";
    const timestamps = [`${baseDate}T09:15:00`, `${baseDate}T10:30:00`, `${baseDate}T14:00:00`];

    // Create snapshots at different times on the same date
    for (const timestamp of timestamps) {
      await createShortlistSnapshot("top-gainers", timestamp, testEntries, tracker);
    }

    const response = await authenticatedGet("/v1/dates", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_available_dates_schemas.getAvailableDates.response.parse(
      response.data
    );

    // Find the entry for this date
    const dateEntry = validatedData.data.dates.find((d) => d.date === baseDate);
    expect(dateEntry).toBeDefined();
    expect(dateEntry!.timestamps.length).toBe(3);
  });

  test("should handle dates with single timestamp", async ({ tracker }) => {
    const testEntries = createValidShortlistEntries();
    const testDatetime = generateUniqueTestDatetime("2025-12-29");
    await createShortlistSnapshot("top-gainers", testDatetime, testEntries, tracker);

    const response = await authenticatedGet("/v1/dates", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_available_dates_schemas.getAvailableDates.response.parse(
      response.data
    );

    // Extract UTC date from IST datetime string (since it's stored as UTC in DB)
    const baseDate = dayjs.tz(testDatetime, "Asia/Kolkata").utc().format("YYYY-MM-DD");
    const dateEntry = validatedData.data.dates.find((d) => d.date === baseDate);
    expect(dateEntry).toBeDefined();
    expect(dateEntry!.timestamps.length).toBe(1);
  });

  test("should handle dates spanning different months/years", async ({ tracker }) => {
    const testEntries = createValidShortlistEntries();
    const dates = ["2024-12-31", "2025-01-01", "2025-12-31", "2026-01-01"];

    // Create snapshots on different dates across months/years
    for (const date of dates) {
      await createShortlistSnapshot("top-gainers", `${date}T10:00:00`, testEntries, tracker);
    }

    const response = await authenticatedGet("/v1/dates", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_available_dates_schemas.getAvailableDates.response.parse(
      response.data
    );

    // Should have entries for all dates
    const returnedDates = validatedData.data.dates.map((d) => d.date);
    dates.forEach((date) => {
      expect(returnedDates).toContain(date);
    });
  });

  test("should handle dates at UTC day boundaries correctly", async ({ tracker }) => {
    const testEntries = createValidShortlistEntries();
    // Test with a date that spans UTC day boundaries
    const dateStr = "2025-08-20";
    const timestamp = `${dateStr}T23:45:00`; // Late IST time that might cross UTC boundary
    await createShortlistSnapshot("top-gainers", timestamp, testEntries, tracker);

    const response = await authenticatedGet("/v1/dates", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_available_dates_schemas.getAvailableDates.response.parse(
      response.data
    );

    // Should find the date entry
    const dateEntry = validatedData.data.dates.find((d) => d.date === dateStr);
    expect(dateEntry).toBeDefined();
  });

  test("should return consistent results across multiple requests", async ({ tracker }) => {
    const testEntries = createValidShortlistEntries();
    const testDatetime = generateUniqueTestDatetime("2025-12-30");
    await createShortlistSnapshot("top-gainers", testDatetime, testEntries, tracker);

    // Make multiple requests
    const response1 = await authenticatedGet("/v1/dates", developerToken);
    const response2 = await authenticatedGet("/v1/dates", developerToken);

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);

    const validatedData1 = v1_developer_available_dates_schemas.getAvailableDates.response.parse(
      response1.data
    );
    const validatedData2 = v1_developer_available_dates_schemas.getAvailableDates.response.parse(
      response2.data
    );

    // Results should be consistent
    expect(validatedData1.data.dates.length).toBe(validatedData2.data.dates.length);
  });
});
