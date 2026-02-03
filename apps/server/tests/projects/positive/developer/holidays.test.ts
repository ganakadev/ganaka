import { authenticatedGet } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";
import { prisma } from "../../../../src/utils/prisma";
import { v1_developer_holidays_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

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
      expect(h.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });
  });
});
