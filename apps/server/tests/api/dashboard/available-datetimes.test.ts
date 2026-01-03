import { v1_dashboard_schemas } from "@ganaka/schemas";
import { createValidShortlistEntries, generateUniqueTestDatetime } from "../../fixtures/test-data";
import { authenticatedGet, unauthenticatedGet } from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import { createShortlistSnapshot } from "../../helpers/db-helpers";
import { expect, test } from "../../helpers/test-fixtures";
import { TestDataTracker } from "../../helpers/test-tracker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

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

test.describe("GET /v1/dashboard/available-datetimes", () => {
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet("/v1/dashboard/available-datetimes");

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization header is required");
  });

  test("should return 401 when invalid token is provided", async () => {
    const response = await authenticatedGet(
      "/v1/dashboard/available-datetimes",
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization failed");
  });

  test("should return 200 with empty dates array when no snapshots exist", async () => {
    const response = await authenticatedGet("/v1/dashboard/available-datetimes", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Available datetimes fetched successfully");
    expect(body.data.dates).toBeInstanceOf(Array);

    // Validate response matches schema
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_available_datetimes_schemas.getAvailableDatetimes.response.parse(
        body
      );
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

    const response = await authenticatedGet("/v1/dashboard/available-datetimes", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Available datetimes fetched successfully");

    // Validate response matches schema
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_available_datetimes_schemas.getAvailableDatetimes.response.parse(
        body
      );
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

    const response = await authenticatedGet("/v1/dashboard/available-datetimes", developerToken);

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_available_datetimes_schemas.getAvailableDatetimes.response.parse(
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

    const response = await authenticatedGet("/v1/dashboard/available-datetimes", developerToken);

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_available_datetimes_schemas.getAvailableDatetimes.response.parse(
        response.data
      );

    expect(validatedData.statusCode).toBe(200);
    expect(validatedData.message).toBe("Available datetimes fetched successfully");
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

    const response = await authenticatedGet("/v1/dashboard/available-datetimes", developerToken);

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_available_datetimes_schemas.getAvailableDatetimes.response.parse(
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

    const response = await authenticatedGet("/v1/dashboard/available-datetimes", developerToken);

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_available_datetimes_schemas.getAvailableDatetimes.response.parse(
        response.data
      );

    // Should have entries for all dates
    const returnedDates = validatedData.data.dates.map((d) => d.date);
    dates.forEach((date) => {
      expect(returnedDates).toContain(date);
    });
  });
});
