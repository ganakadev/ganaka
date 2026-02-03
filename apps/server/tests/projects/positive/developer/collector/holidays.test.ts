import { authenticatedGet } from "../../../../helpers/api-client";
import { createDeveloperUser } from "../../../../helpers/auth-helpers";
import { expect, test } from "../../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../../helpers/test-tracker";
import { prisma } from "../../../../../src/utils/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

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
});
