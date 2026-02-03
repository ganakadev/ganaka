import { v1_developer_available_dates_schemas } from "@ganaka/schemas";
import { authenticatedGet } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { createShortlistSnapshot } from "../../../helpers/db-helpers";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";
import {
  createValidShortlistEntries,
  generateUniqueTestDatetime,
} from "../../../fixtures/test-data";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

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
});
