import {
  authenticatedGet,
  authenticatedPost,
  unauthenticatedGet,
} from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import { expect, test } from "../../helpers/test-fixtures";
import { TestDataTracker } from "../../helpers/test-tracker";
import { prisma } from "../../../src/utils/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { v1_developer_holidays_schemas } from "@ganaka/schemas";

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

test.describe("GET /v1/developer/holidays", () => {
  test.describe.configure({ mode: "serial" });
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet("/v1/developer/holidays");

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization header is required");
  });

  test("should return 401 when invalid developer token is provided", async () => {
    const response = await authenticatedGet("/v1/developer/holidays", "invalid-token-12345", {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization failed");
  });

  test("should return 200 with empty holidays array when no holidays exist", async ({
    tracker,
  }) => {
    // Clean up any existing holidays from previous tests to ensure isolation
    await prisma.nseHoliday.deleteMany({});

    const response = await authenticatedGet("/v1/developer/holidays", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Holidays fetched successfully");
    expect(body.data.holidays).toEqual([]);

    // Validate response matches schema
    const validatedData = v1_developer_holidays_schemas.getHolidays.response.parse(body);
    expect(validatedData.data.holidays).toEqual([]);
  });

  test("should return holidays when they exist", async ({ tracker }) => {
    // Clean up any existing holidays to ensure clean state
    await prisma.nseHoliday.deleteMany({});

    // Create test holidays
    const date1 = dayjs.utc("2025-01-15").startOf("day").toDate();
    const date2 = dayjs.utc("2025-01-20").startOf("day").toDate();

    const holiday1 = await prisma.nseHoliday.create({ data: { date: date1 } });
    const holiday2 = await prisma.nseHoliday.create({ data: { date: date2 } });

    tracker.trackNseHoliday(holiday1.id);
    tracker.trackNseHoliday(holiday2.id);

    const response = await authenticatedGet("/v1/developer/holidays", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.data.holidays).toHaveLength(2);
    expect(body.data.holidays.map((h: { date: string }) => h.date).sort()).toEqual([
      "2025-01-15",
      "2025-01-20",
    ]);
  });

  test("should return holidays in ascending date order", async ({ tracker }) => {
    await prisma.nseHoliday.deleteMany({});

    // Create holidays in random order
    const date1 = dayjs.utc("2025-03-20").startOf("day").toDate();
    const date2 = dayjs.utc("2025-03-15").startOf("day").toDate();
    const date3 = dayjs.utc("2025-03-25").startOf("day").toDate();

    const holiday1 = await prisma.nseHoliday.create({ data: { date: date1 } });
    const holiday2 = await prisma.nseHoliday.create({ data: { date: date2 } });
    const holiday3 = await prisma.nseHoliday.create({ data: { date: date3 } });

    tracker.trackNseHoliday(holiday1.id);
    tracker.trackNseHoliday(holiday2.id);
    tracker.trackNseHoliday(holiday3.id);

    const response = await authenticatedGet("/v1/developer/holidays", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_holidays_schemas.getHolidays.response.parse(response.data);

    // Validate dates are sorted ascending
    const dates = validatedData.data.holidays.map((h: { date: string }) => h.date);
    expect(dates).toEqual(["2025-03-15", "2025-03-20", "2025-03-25"]);
  });

  test("should return all holiday fields (id, date, createdAt, updatedAt)", async ({
    tracker,
  }) => {
    await prisma.nseHoliday.deleteMany({});

    const date = dayjs.utc("2025-04-15").startOf("day").toDate();
    const holiday = await prisma.nseHoliday.create({ data: { date } });
    tracker.trackNseHoliday(holiday.id);

    const response = await authenticatedGet("/v1/developer/holidays", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_holidays_schemas.getHolidays.response.parse(response.data);

    expect(validatedData.data.holidays.length).toBeGreaterThan(0);
    const firstHoliday = validatedData.data.holidays[0];
    expect(firstHoliday).toHaveProperty("id");
    expect(firstHoliday).toHaveProperty("date");
    expect(firstHoliday).toHaveProperty("createdAt");
    expect(firstHoliday).toHaveProperty("updatedAt");
  });

  test("should validate response schema matches expected structure with data", async ({
    tracker,
  }) => {
    await prisma.nseHoliday.deleteMany({});

    const date = dayjs.utc("2025-05-15").startOf("day").toDate();
    const holiday = await prisma.nseHoliday.create({ data: { date } });
    tracker.trackNseHoliday(holiday.id);

    const response = await authenticatedGet("/v1/developer/holidays", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_holidays_schemas.getHolidays.response.parse(response.data);

    expect(validatedData.statusCode).toBe(200);
    expect(validatedData.message).toBe("Holidays fetched successfully");
    expect(validatedData.data).toHaveProperty("holidays");
    expect(Array.isArray(validatedData.data.holidays)).toBe(true);
  });

  test("should return correct date format (YYYY-MM-DD)", async ({ tracker }) => {
    await prisma.nseHoliday.deleteMany({});

    const date = dayjs.utc("2025-06-15").startOf("day").toDate();
    const holiday = await prisma.nseHoliday.create({ data: { date } });
    tracker.trackNseHoliday(holiday.id);

    const response = await authenticatedGet("/v1/developer/holidays", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_holidays_schemas.getHolidays.response.parse(response.data);

    validatedData.data.holidays.forEach((h: { date: string }) => {
      expect(typeof h.date).toBe("string");
      expect(h.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  test("should return valid UUIDs for holiday IDs", async ({ tracker }) => {
    await prisma.nseHoliday.deleteMany({});

    const date = dayjs.utc("2025-07-15").startOf("day").toDate();
    const holiday = await prisma.nseHoliday.create({ data: { date } });
    tracker.trackNseHoliday(holiday.id);

    const response = await authenticatedGet("/v1/developer/holidays", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_holidays_schemas.getHolidays.response.parse(response.data);

    validatedData.data.holidays.forEach((h: { id: string }) => {
      expect(typeof h.id).toBe("string");
      // UUID v4 format validation
      expect(h.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });
  });

  test("should return valid Date objects for createdAt and updatedAt", async ({ tracker }) => {
    await prisma.nseHoliday.deleteMany({});

    const date = dayjs.utc("2025-08-15").startOf("day").toDate();
    const holiday = await prisma.nseHoliday.create({ data: { date } });
    tracker.trackNseHoliday(holiday.id);

    const response = await authenticatedGet("/v1/developer/holidays", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_holidays_schemas.getHolidays.response.parse(response.data);

    validatedData.data.holidays.forEach((h: { createdAt: Date; updatedAt: Date }) => {
      expect(h.createdAt).toBeInstanceOf(Date);
      expect(h.updatedAt).toBeInstanceOf(Date);
      expect(h.createdAt.getTime()).toBeGreaterThan(0);
      expect(h.updatedAt.getTime()).toBeGreaterThan(0);
    });
  });

  test("should handle single holiday correctly", async ({ tracker }) => {
    await prisma.nseHoliday.deleteMany({});

    const date = dayjs.utc("2025-09-15").startOf("day").toDate();
    const holiday = await prisma.nseHoliday.create({ data: { date } });
    tracker.trackNseHoliday(holiday.id);

    const response = await authenticatedGet("/v1/developer/holidays", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_holidays_schemas.getHolidays.response.parse(response.data);

    expect(validatedData.data.holidays.length).toBe(1);
    expect(validatedData.data.holidays[0].date).toBe("2025-09-15");
  });

  test("should handle multiple holidays correctly", async ({ tracker }) => {
    await prisma.nseHoliday.deleteMany({});

    const dates = [
      dayjs.utc("2025-10-15").startOf("day").toDate(),
      dayjs.utc("2025-10-20").startOf("day").toDate(),
      dayjs.utc("2025-10-25").startOf("day").toDate(),
    ];

    const holidays = await Promise.all(
      dates.map((date) => prisma.nseHoliday.create({ data: { date } }))
    );

    holidays.forEach((h) => tracker.trackNseHoliday(h.id));

    const response = await authenticatedGet("/v1/developer/holidays", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_holidays_schemas.getHolidays.response.parse(response.data);

    expect(validatedData.data.holidays.length).toBe(3);
    const returnedDates = validatedData.data.holidays.map((h: { date: string }) => h.date);
    expect(returnedDates.sort()).toEqual(["2025-10-15", "2025-10-20", "2025-10-25"]);
  });

  test("should handle holidays across different months/years", async ({ tracker }) => {
    await prisma.nseHoliday.deleteMany({});

    const dates = [
      dayjs.utc("2024-12-31").startOf("day").toDate(),
      dayjs.utc("2025-01-01").startOf("day").toDate(),
      dayjs.utc("2025-12-31").startOf("day").toDate(),
      dayjs.utc("2026-01-01").startOf("day").toDate(),
    ];

    const holidays = await Promise.all(
      dates.map((date) => prisma.nseHoliday.create({ data: { date } }))
    );

    holidays.forEach((h) => tracker.trackNseHoliday(h.id));

    const response = await authenticatedGet("/v1/developer/holidays", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_holidays_schemas.getHolidays.response.parse(response.data);

    expect(validatedData.data.holidays.length).toBe(4);
    const returnedDates = validatedData.data.holidays.map((h: { date: string }) => h.date);
    expect(returnedDates.sort()).toEqual(["2024-12-31", "2025-01-01", "2025-12-31", "2026-01-01"]);
  });

  test("should handle holidays at UTC day boundaries correctly", async ({ tracker }) => {
    await prisma.nseHoliday.deleteMany({});

    // Test with a date that spans UTC day boundaries
    const dateStr = "2025-11-20";
    const date = dayjs.utc(dateStr).startOf("day").toDate();
    const holiday = await prisma.nseHoliday.create({ data: { date } });
    tracker.trackNseHoliday(holiday.id);

    const response = await authenticatedGet("/v1/developer/holidays", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_holidays_schemas.getHolidays.response.parse(response.data);

    // Should find the holiday
    const foundHoliday = validatedData.data.holidays.find(
      (h: { date: string }) => h.date === dateStr
    );
    expect(foundHoliday).toBeDefined();
  });

  test("should return consistent results across multiple requests", async ({ tracker }) => {
    await prisma.nseHoliday.deleteMany({});

    const date = dayjs.utc("2025-12-15").startOf("day").toDate();
    const holiday = await prisma.nseHoliday.create({ data: { date } });
    tracker.trackNseHoliday(holiday.id);

    // Make multiple requests
    const response1 = await authenticatedGet("/v1/developer/holidays", developerToken);
    const response2 = await authenticatedGet("/v1/developer/holidays", developerToken);

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);

    const validatedData1 = v1_developer_holidays_schemas.getHolidays.response.parse(
      response1.data
    );
    const validatedData2 = v1_developer_holidays_schemas.getHolidays.response.parse(
      response2.data
    );

    // Results should be consistent
    expect(validatedData1.data.holidays.length).toBe(validatedData2.data.holidays.length);
  });

  test("should handle holidays created at different times", async ({ tracker }) => {
    await prisma.nseHoliday.deleteMany({});

    // Create holidays with a delay between them
    const date1 = dayjs.utc("2025-12-20").startOf("day").toDate();
    const holiday1 = await prisma.nseHoliday.create({ data: { date: date1 } });
    tracker.trackNseHoliday(holiday1.id);

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 100));

    const date2 = dayjs.utc("2025-12-21").startOf("day").toDate();
    const holiday2 = await prisma.nseHoliday.create({ data: { date: date2 } });
    tracker.trackNseHoliday(holiday2.id);

    const response = await authenticatedGet("/v1/developer/holidays", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_developer_holidays_schemas.getHolidays.response.parse(response.data);

    expect(validatedData.data.holidays.length).toBe(2);
    // Both should have valid timestamps
    validatedData.data.holidays.forEach((h: { createdAt: Date; updatedAt: Date }) => {
      expect(h.createdAt.getTime()).toBeGreaterThan(0);
      expect(h.updatedAt.getTime()).toBeGreaterThan(0);
    });
  });

  test("should return same data structure as admin endpoint (read-only)", async ({
    tracker,
  }) => {
    await prisma.nseHoliday.deleteMany({});

    const date = dayjs.utc("2025-12-25").startOf("day").toDate();
    const holiday = await prisma.nseHoliday.create({ data: { date } });
    tracker.trackNseHoliday(holiday.id);

    // Get from developer endpoint
    const devResponse = await authenticatedGet("/v1/developer/holidays", developerToken);
    const devData = v1_developer_holidays_schemas.getHolidays.response.parse(devResponse.data);

    // Get from admin endpoint
    const adminResponse = await authenticatedGet("/v1/admin/holidays", adminToken);
    const adminData = adminResponse.data;

    // Both should have same structure
    expect(devData.data.holidays.length).toBe(adminData.data.holidays.length);
    if (devData.data.holidays.length > 0) {
      const devHoliday = devData.data.holidays[0];
      const adminHoliday = adminData.data.holidays[0];
      expect(devHoliday).toHaveProperty("id");
      expect(devHoliday).toHaveProperty("date");
      expect(devHoliday).toHaveProperty("createdAt");
      expect(devHoliday).toHaveProperty("updatedAt");
      expect(adminHoliday).toHaveProperty("id");
      expect(adminHoliday).toHaveProperty("date");
      expect(adminHoliday).toHaveProperty("createdAt");
      expect(adminHoliday).toHaveProperty("updatedAt");
    }
  });

  test("should not allow POST operations (developer endpoint is GET only)", async () => {
    const response = await authenticatedPost(
      "/v1/developer/holidays",
      developerToken,
      {
        dates: ["2025-12-30"],
      },
      { validateStatus: () => true }
    );

    // Should return 404 (route doesn't exist) or 405 (method not allowed)
    expect([404, 405]).toContain(response.status);
  });
});
