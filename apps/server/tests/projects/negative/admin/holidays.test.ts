import { authenticatedPost, authenticatedDelete } from "../../../helpers/api-client";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";
import { prisma } from "../../../../src/utils/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

let adminToken: string;
let sharedTracker: TestDataTracker;

test.beforeAll(async () => {
  const token = process.env.TEST_ADMIN_TOKEN;
  if (!token) {
    throw new Error("TEST_ADMIN_TOKEN not set in environment");
  }
  adminToken = token;
  sharedTracker = new TestDataTracker();
});

test.afterAll(async () => {
  if (sharedTracker) {
    await sharedTracker.cleanup();
  }
});

test.describe("Admin Holidays API", () => {
  test.describe.configure({ mode: "serial" });

  test.describe("POST /v1/holidays", () => {
    test("should return 400 when dates array is empty", async () => {
      const response = await authenticatedPost(
        "/v1/holidays",
        adminToken,
        {
          dates: [],
        },
        { validateStatus: () => true }
      );

      expect(response.status).toBe(400);
    });

    test("should return 400 when date format is invalid", async () => {
      const response = await authenticatedPost(
        "/v1/holidays",
        adminToken,
        {
          dates: ["invalid-date"],
        },
        { validateStatus: () => true }
      );

      expect(response.status).toBe(400);
    });

    test("should return 400 when duplicate dates in request", async () => {
      const response = await authenticatedPost(
        "/v1/holidays",
        adminToken,
        {
          dates: ["2025-04-15", "2025-04-15"],
        },
        { validateStatus: () => true }
      );

      expect(response.status).toBe(400);
      const body =
        typeof response.data === "string" ? response.data : JSON.stringify(response.data);
      expect(body).toContain("Duplicate dates");
    });

    test("should return 409 when holiday already exists", async ({ tracker }) => {
      // Create existing holiday
      const date = dayjs.utc("2025-05-15").startOf("day").toDate();
      const holiday = await prisma.nseHoliday.create({ data: { date } });
      tracker.trackNseHoliday(holiday.id);

      const response = await authenticatedPost(
        "/v1/holidays",
        adminToken,
        {
          dates: ["2025-05-15"],
        },
        { validateStatus: () => true }
      );

      expect(response.status).toBe(409);
      const body =
        typeof response.data === "string" ? response.data : JSON.stringify(response.data);
      expect(body).toContain("already exist");
    });
  });

  test.describe("DELETE /v1/holidays", () => {
    test("should return 400 when dates array is empty", async () => {
      const response = await authenticatedDelete("/v1/holidays", adminToken, {
        data: {
          dates: [],
        },
        validateStatus: () => true,
      });

      expect(response.status).toBe(400);
    });

    test("should return 404 when no holidays found", async () => {
      const response = await authenticatedDelete("/v1/holidays", adminToken, {
        data: {
          dates: ["2025-08-15"],
        },
        validateStatus: () => true,
      });

      expect(response.status).toBe(404);
      const body =
        typeof response.data === "string" ? response.data : JSON.stringify(response.data);
      expect(body).toContain("No holidays found");
    });
  });
});
