import {
  authenticatedDelete,
  authenticatedGet,
  unauthenticatedDelete,
  unauthenticatedGet,
} from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import { expect, test } from "../../helpers/test-fixtures";
import { TestDataTracker } from "../../helpers/test-tracker";
import { prisma } from "../../../src/utils/prisma";
import {
  createShortlistSnapshot,
  createQuoteSnapshot,
  createNiftyQuoteSnapshot,
} from "../../helpers/db-helpers";
import { createValidGrowwQuotePayload } from "../../fixtures/test-data";
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

test.describe("GET /v1/admin/data/available-dates", () => {
  test.describe.configure({ mode: "serial" });

  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet("/v1/admin/data/available-dates");

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization header is required");
  });

  test("should return 401 when invalid admin token is provided", async () => {
    const response = await authenticatedGet("/v1/admin/data/available-dates", "invalid-token-12345", {
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

    const response = await authenticatedGet("/v1/admin/data/available-dates", dev.token, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization failed");
  });

  test("should return empty array when no data exists", async ({ tracker }) => {
    // Clean up any existing snapshots from previous tests to ensure isolation
    await prisma.shortlistSnapshot.deleteMany({});
    await prisma.quoteSnapshot.deleteMany({});
    await prisma.niftyQuote.deleteMany({});

    const response = await authenticatedGet("/v1/admin/data/available-dates", adminToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Available dates fetched successfully");
    expect(body.data.dates).toEqual([]);
  });

  test("should return dates with data counts", async ({ tracker }) => {
    // Create test data for a specific date
    const dateStr = "2025-09-15";

    // Create shortlist snapshot
    await createShortlistSnapshot(
      "top-gainers",
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

    // Create nifty quote
    await createNiftyQuoteSnapshot(
      `${dateStr}T10:00:00`,
      createValidGrowwQuotePayload(),
      tracker,
      0.5,
      "Asia/Kolkata"
    );

    const response = await authenticatedGet("/v1/admin/data/available-dates", adminToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.data.dates.length).toBeGreaterThan(0);
    const dateInfo = body.data.dates.find((d: { date: string }) => d.date === dateStr);
    expect(dateInfo).toBeDefined();
    expect(dateInfo.shortlistCount).toBeGreaterThan(0);
    expect(dateInfo.quoteCount).toBeGreaterThan(0);
    expect(dateInfo.niftyCount).toBeGreaterThan(0);
  });
});

test.describe("DELETE /v1/admin/data/dates", () => {
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedDelete("/v1/admin/data/dates", {
      data: {
        dates: ["2025-01-15"],
      }
    });

    expect(response.status).toBe(401);
  });

  test("should delete data for a single date", async ({ tracker }) => {
    // Create test data
    const dateStr = "2025-10-15";

    const shortlist = await createShortlistSnapshot(
      "top-gainers",
      `${dateStr}T10:00:00`,
      [{ nseSymbol: "RELIANCE", name: "Reliance Industries", price: 2500 }],
      tracker,
      "Asia/Kolkata",
      "TOP_5"
    );

    const quote = await createQuoteSnapshot(
      "RELIANCE",
      `${dateStr}T10:00:00`,
      createValidGrowwQuotePayload(),
      tracker,
      "Asia/Kolkata"
    );

    const nifty = await createNiftyQuoteSnapshot(
      `${dateStr}T10:00:00`,
      createValidGrowwQuotePayload(),
      tracker,
      0.5,
      "Asia/Kolkata"
    );

    // Delete the date
    const response = await authenticatedDelete(
      "/v1/admin/data/dates",
      adminToken,
      {
        data: {
          dates: [dateStr],
        },
        validateStatus: () => true,
      },
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Data deleted successfully");
    expect(body.data.deleted.shortlists).toBeGreaterThan(0);
    expect(body.data.deleted.quotes).toBeGreaterThan(0);
    expect(body.data.deleted.niftyQuotes).toBeGreaterThan(0);

    // Verify deleted
    const deletedShortlist = await prisma.shortlistSnapshot.findUnique({
      where: { id: shortlist.id },
    });
    const deletedQuote = await prisma.quoteSnapshot.findUnique({ where: { id: quote.id } });
    const deletedNifty = await prisma.niftyQuote.findUnique({ where: { id: nifty.id } });

    expect(deletedShortlist).toBeNull();
    expect(deletedQuote).toBeNull();
    expect(deletedNifty).toBeNull();
  });

  test("should delete data for multiple dates", async ({ tracker }) => {
    // Create test data for two dates
    const date1 = "2025-11-15";
    const date2 = "2025-11-20";

    await createShortlistSnapshot(
      "top-gainers",
      `${date1}T10:00:00`,
      [{ nseSymbol: "RELIANCE", name: "Reliance Industries", price: 2500 }],
      tracker,
      "Asia/Kolkata",
      "TOP_5"
    );
    await createShortlistSnapshot(
      "top-gainers",
      `${date2}T10:00:00`,
      [{ nseSymbol: "TCS", name: "Tata Consultancy Services", price: 3500 }],
      tracker,
      "Asia/Kolkata",
      "TOP_5"
    );

    const response = await authenticatedDelete(
      "/v1/admin/data/dates",
      adminToken,
      {
        data: {
          dates: [date1, date2],
        },
        validateStatus: () => true,
      },
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.data.deleted.shortlists).toBeGreaterThanOrEqual(2);
  });

  test("should return 400 when dates array is empty", async () => {
    const response = await authenticatedDelete(
      "/v1/admin/data/dates",
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

  test("should return 400 when date format is invalid", async () => {
    const response = await authenticatedDelete(
      "/v1/admin/data/dates",
      adminToken,
      {
        data: {
          dates: ["invalid-date"],
        },
        validateStatus: () => true,
      },
    );

    expect(response.status).toBe(400);
  });

  test("should handle non-existent dates gracefully", async () => {
    const response = await authenticatedDelete(
      "/v1/admin/data/dates",
      adminToken,
      {
        data: {
          dates: ["2099-12-31"],
        },
        validateStatus: () => true,
      },
    );

    // Should succeed but return zero counts
    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.data.deleted.shortlists).toBe(0);
    expect(body.data.deleted.quotes).toBe(0);
    expect(body.data.deleted.niftyQuotes).toBe(0);
  });
});
