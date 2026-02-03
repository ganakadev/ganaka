import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { prisma } from "../../../../src/utils/prisma";
import { authenticatedGet, unauthenticatedGet } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";

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

test.describe("GET /v1/holidays/check", () => {
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet(
      "/v1/holidays/check?date=2025-01-15",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const response = await authenticatedGet(
      "/v1/holidays/check?date=2025-01-15",
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when date query parameter is missing", async () => {
    const response = await authenticatedGet(
      "/v1/holidays/check",
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("date");
  });

  test("should return 400 when date format is invalid", async () => {
    const response = await authenticatedGet(
      "/v1/holidays/check?date=invalid-date",
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("date");
  });

  test("should return 400 when date is not a valid date", async () => {
    const response = await authenticatedGet(
      "/v1/holidays/check?date=2025-13-45",
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 200 with isHoliday=false when date is not a holiday", async () => {
    const response = await authenticatedGet(
      "/v1/holidays/check?date=2025-06-15",
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Holiday check completed");
    expect(body.data.isHoliday).toBe(false);
    expect(body.data.date).toBe("2025-06-15");
  });

  test("should return 200 with isHoliday=true when date is a holiday", async ({ tracker }) => {
    // Create a holiday for the test date
    const dateStr = "2025-07-15";
    const date = dayjs.utc(dateStr).startOf("day").toDate();
    const holiday = await prisma.nseHoliday.create({ data: { date } });
    tracker.trackNseHoliday(holiday.id);

    const response = await authenticatedGet(
      `/v1/holidays/check?date=${dateStr}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.data.isHoliday).toBe(true);
    expect(body.data.date).toBe(dateStr);
  });

  test("should handle different date formats correctly", async ({ tracker }) => {
    // Test with a date that spans UTC day boundaries
    const dateStr = "2025-08-20";
    const date = dayjs.utc(dateStr).startOf("day").toDate();
    const holiday = await prisma.nseHoliday.create({ data: { date } });
    tracker.trackNseHoliday(holiday.id);

    const response = await authenticatedGet(
      `/v1/holidays/check?date=${dateStr}`,
      developerToken
    );

    expect(response.status).toBe(200);
    expect(response.data.data.isHoliday).toBe(true);
    expect(response.data.data.date).toBe(dateStr);
  });

  test("should validate date parameter using Zod schema", async () => {
    // Test with empty date
    const response1 = await authenticatedGet(
      "/v1/holidays/check?date=",
      developerToken,
      {
        validateStatus: () => true,
      }
    );
    expect(response1.status).toBe(400);

    // Test with date missing year
    const response2 = await authenticatedGet(
      "/v1/holidays/check?date=01-15",
      developerToken,
      {
        validateStatus: () => true,
      }
    );
    expect(response2.status).toBe(400);

    // Test with date missing dashes
    const response3 = await authenticatedGet(
      "/v1/holidays/check?date=20250115",
      developerToken,
      {
        validateStatus: () => true,
      }
    );
    expect(response3.status).toBe(400);
  });

  test("should return the same date that was sent in the request", async () => {
    const dateStr = "2025-09-25";
    const response = await authenticatedGet(
      `/v1/holidays/check?date=${dateStr}`,
      developerToken
    );

    expect(response.status).toBe(200);
    expect(response.data.data.date).toBe(dateStr);
  });
});
