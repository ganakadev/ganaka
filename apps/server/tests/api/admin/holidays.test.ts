import {
  authenticatedDelete,
  authenticatedGet,
  authenticatedPost,
  unauthenticatedDelete,
  unauthenticatedGet,
  unauthenticatedPost,
} from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import { expect, test } from "../../helpers/test-fixtures";
import { TestDataTracker } from "../../helpers/test-tracker";
import { prisma } from "../../../src/utils/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

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

  test.describe("GET /v1/admin/holidays", () => {
    test("should return 401 when authorization header is missing", async () => {
      const response = await unauthenticatedGet("/v1/admin/holidays");

      expect(response.status).toBe(401);
      const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
      expect(body).toContain("Authorization header is required");
    });

    test("should return 401 when invalid admin token is provided", async () => {
      const response = await authenticatedGet("/v1/admin/holidays", "invalid-token-12345", {
        validateStatus: () => true,
      });

      expect(response.status).toBe(401);
      const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
      expect(body).toContain("Authorization failed");
    });

    test("should return 401 when developer token is used instead of admin token", async ({
      tracker,
    }) => {
      const dev = await createDeveloperUser(undefined, tracker);

      const response = await authenticatedGet("/v1/admin/holidays", dev.token, {
        validateStatus: () => true,
      });

      expect(response.status).toBe(401);
      const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
      expect(body).toContain("Authorization failed");
    });

    test("should return empty array when no holidays exist", async ({ tracker }) => {
      // Clean up any existing holidays from previous tests to ensure isolation
      await prisma.nseHoliday.deleteMany({});

      const response = await authenticatedGet("/v1/admin/holidays", adminToken);

      expect(response.status).toBe(200);
      const body = response.data;
      expect(body.statusCode).toBe(200);
      expect(body.message).toBe("Holidays fetched successfully");
      expect(body.data.holidays).toEqual([]);
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

      const response = await authenticatedGet("/v1/admin/holidays", adminToken);

      expect(response.status).toBe(200);
      const body = response.data;
      expect(body.statusCode).toBe(200);
      expect(body.data.holidays).toHaveLength(2);
      expect(body.data.holidays.map((h: { date: string }) => h.date).sort()).toEqual([
        "2025-01-15",
        "2025-01-20",
      ]);
    });
  });

  test.describe("POST /v1/admin/holidays", () => {
    test("should return 401 when authorization header is missing", async () => {
      const response = await unauthenticatedPost("/v1/admin/holidays", {
        dates: ["2025-01-15"],
      });

      expect(response.status).toBe(401);
    });

    test("should add a single holiday successfully", async ({ tracker }) => {
      const response = await authenticatedPost(
      "/v1/admin/holidays",
      adminToken,
      {
        dates: ["2025-02-15"],
      },
      { validateStatus: () => true }
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.message).toBe("Holidays added successfully");
    expect(body.data.holidays).toHaveLength(1);
    expect(body.data.holidays[0].date).toBe("2025-02-15");

    // Track for cleanup
    tracker.trackNseHoliday(body.data.holidays[0].id);
  });

    test("should add multiple holidays successfully", async ({ tracker }) => {
      const response = await authenticatedPost(
      "/v1/admin/holidays",
      adminToken,
      {
        dates: ["2025-03-15", "2025-03-20", "2025-03-25"],
      },
      { validateStatus: () => true }
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.data.holidays).toHaveLength(3);
    expect(body.data.holidays.map((h: { date: string }) => h.date).sort()).toEqual([
      "2025-03-15",
      "2025-03-20",
      "2025-03-25",
    ]);

    // Track for cleanup
    body.data.holidays.forEach((h: { id: string }) => {
      tracker.trackNseHoliday(h.id);
    });
  });

    test("should return 400 when dates array is empty", async () => {
      const response = await authenticatedPost(
      "/v1/admin/holidays",
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
      "/v1/admin/holidays",
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
      "/v1/admin/holidays",
      adminToken,
      {
        dates: ["2025-04-15", "2025-04-15"],
      },
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Duplicate dates");
  });

    test("should return 409 when holiday already exists", async ({ tracker }) => {
      // Create existing holiday
      const date = dayjs.utc("2025-05-15").startOf("day").toDate();
    const holiday = await prisma.nseHoliday.create({ data: { date } });
    tracker.trackNseHoliday(holiday.id);

    const response = await authenticatedPost(
      "/v1/admin/holidays",
      adminToken,
      {
        dates: ["2025-05-15"],
      },
      { validateStatus: () => true }
    );

    expect(response.status).toBe(409);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("already exist");
  });
  });

  test.describe("DELETE /v1/admin/holidays", () => {
    test("should return 401 when authorization header is missing", async () => {
      const response = await unauthenticatedDelete("/v1/admin/holidays", {
      data: {
        dates: ["2025-01-15"],
      },
    });

    expect(response.status).toBe(401);
  });

    test("should remove a single holiday successfully", async ({ tracker }) => {
      // Create holiday
      const date = dayjs.utc("2025-06-15").startOf("day").toDate();
    const holiday = await prisma.nseHoliday.create({ data: { date } });
    tracker.trackNseHoliday(holiday.id);

    const response = await authenticatedDelete(
      "/v1/admin/holidays",
      adminToken,
      {
        data: {
          dates: ["2025-06-15"],
        },
        validateStatus: () => true,
      },
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Holidays removed successfully");
    expect(body.data.deleted.count).toBe(1);
    expect(body.data.deleted.dates).toEqual(["2025-06-15"]);

    // Verify deleted
    const deleted = await prisma.nseHoliday.findUnique({ where: { id: holiday.id } });
    expect(deleted).toBeNull();
  });

    test("should remove multiple holidays successfully", async ({ tracker }) => {
      // Create holidays
      const date1 = dayjs.utc("2025-07-15").startOf("day").toDate();
    const date2 = dayjs.utc("2025-07-20").startOf("day").toDate();
    const holiday1 = await prisma.nseHoliday.create({ data: { date: date1 } });
    const holiday2 = await prisma.nseHoliday.create({ data: { date: date2 } });
    tracker.trackNseHoliday(holiday1.id);
    tracker.trackNseHoliday(holiday2.id);

    const response = await authenticatedDelete(
      "/v1/admin/holidays",
      adminToken,
      {
        data: {
          dates: ["2025-07-15", "2025-07-20"],
        },
        validateStatus: () => true,
      },
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.data.deleted.count).toBe(2);
    expect(body.data.deleted.dates.sort()).toEqual(["2025-07-15", "2025-07-20"]);
  });

    test("should return 400 when dates array is empty", async () => {
      const response = await authenticatedDelete(
      "/v1/admin/holidays",
      adminToken,
      {
        data: {
          dates: [],
        },
        validateStatus: () => true,
      },
    );

    expect(response.status).toBe(400);
  });

    test("should return 404 when no holidays found", async () => {
      const response = await authenticatedDelete(
      "/v1/admin/holidays",
      adminToken,
      {
        data: {
          dates: ["2025-08-15"],
        },
        validateStatus: () => true,
      },
    );

    expect(response.status).toBe(404);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("No holidays found");
  });
});
});
