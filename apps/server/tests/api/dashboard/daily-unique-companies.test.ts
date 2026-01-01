import { test, expect } from "../../helpers/test-fixtures";
import { authenticatedGet, unauthenticatedGet } from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import {
  createMultipleShortlistSnapshots,
  createShortlistSnapshotsWithUniqueCompanies,
} from "../../helpers/db-helpers";
import {
  DAILY_UNIQUE_COMPANIES_TEST_DATE,
  createDailyUniqueCompaniesQuery,
  createValidShortlistEntries,
} from "../../fixtures/test-data";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import { TestDataTracker } from "../../helpers/test-tracker";

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

test.describe("GET /v1/dashboard/daily-unique-companies", () => {
  // Run tests in serial to avoid race conditions with count of companies
  test.describe.configure({ mode: "serial" });

  test("should return 401 when authorization header is missing", async () => {
    const query = createDailyUniqueCompaniesQuery();
    const queryString = new URLSearchParams(query).toString();
    const response = await unauthenticatedGet(
      `/v1/dashboard/daily-unique-companies?${queryString}`
    );

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = createDailyUniqueCompaniesQuery();
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-unique-companies?${queryString}`,
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when date is missing", async () => {
    const query = { type: "TOP_GAINERS" };
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-unique-companies?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when type is missing", async () => {
    const query = { date: DAILY_UNIQUE_COMPANIES_TEST_DATE };
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-unique-companies?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when date format is invalid", async () => {
    const query = createDailyUniqueCompaniesQuery("invalid-date", "TOP_GAINERS");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-unique-companies?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when type is invalid enum value", async () => {
    const query = { date: DAILY_UNIQUE_COMPANIES_TEST_DATE, type: "invalid-type" };
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-unique-companies?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 200 with uniqueCount 0 when no snapshots exist", async () => {
    const futureDate = "2099-01-01";
    const query = createDailyUniqueCompaniesQuery(futureDate, "TOP_GAINERS");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-unique-companies?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Daily unique companies fetched successfully");
    expect(body.data.uniqueCount).toBe(0);
  });

  test("should return 200 with correct unique count when snapshots exist", async ({ tracker }) => {
    // Create snapshots with known entries
    const testEntries = createValidShortlistEntries();
    await createMultipleShortlistSnapshots(
      "top-gainers",
      DAILY_UNIQUE_COMPANIES_TEST_DATE,
      5,
      tracker
    );

    const query = createDailyUniqueCompaniesQuery(DAILY_UNIQUE_COMPANIES_TEST_DATE, "TOP_GAINERS");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-unique-companies?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Daily unique companies fetched successfully");
    expect(body.data.uniqueCount).toBeGreaterThan(0);

    // Validate response matches schema
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_daily_unique_companies_schemas.getDailyUniqueCompanies.response.parse(
        body
      );
    expect(validatedData.data.uniqueCount).toBeGreaterThan(0);
  });

  test("should validate response structure (date, type, uniqueCount)", async ({ tracker }) => {
    await createMultipleShortlistSnapshots(
      "top-gainers",
      DAILY_UNIQUE_COMPANIES_TEST_DATE,
      3,
      tracker
    );

    const query = createDailyUniqueCompaniesQuery(DAILY_UNIQUE_COMPANIES_TEST_DATE, "TOP_GAINERS");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-unique-companies?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_daily_unique_companies_schemas.getDailyUniqueCompanies.response.parse(
        response.data
      );

    expect(validatedData.data).toHaveProperty("date");
    expect(validatedData.data).toHaveProperty("type");
    expect(validatedData.data).toHaveProperty("uniqueCount");
    expect(typeof validatedData.data.date).toBe("string");
    expect(["TOP_GAINERS", "VOLUME_SHOCKERS"]).toContain(validatedData.data.type);
    expect(typeof validatedData.data.uniqueCount).toBe("number");
    expect(validatedData.data.uniqueCount).toBeGreaterThanOrEqual(0);
  });

  test("should validate exact uniqueCount value", async ({ tracker }) => {
    // Create snapshots with exactly 10 unique companies
    await createShortlistSnapshotsWithUniqueCompanies(
      "top-gainers",
      DAILY_UNIQUE_COMPANIES_TEST_DATE,
      10,
      tracker
    );

    const query = createDailyUniqueCompaniesQuery(DAILY_UNIQUE_COMPANIES_TEST_DATE, "TOP_GAINERS");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-unique-companies?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_daily_unique_companies_schemas.getDailyUniqueCompanies.response.parse(
        response.data
      );

    expect(typeof validatedData.data.uniqueCount).toBe("number");
    expect(validatedData.data.uniqueCount).toBeGreaterThanOrEqual(0);
    expect(validatedData.data.uniqueCount).toBe(10);
  });

  test("should validate date matches requested date format (YYYY-MM-DD)", async ({ tracker }) => {
    await createMultipleShortlistSnapshots(
      "top-gainers",
      DAILY_UNIQUE_COMPANIES_TEST_DATE,
      3,
      tracker
    );

    const query = createDailyUniqueCompaniesQuery(DAILY_UNIQUE_COMPANIES_TEST_DATE, "TOP_GAINERS");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-unique-companies?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_daily_unique_companies_schemas.getDailyUniqueCompanies.response.parse(
        response.data
      );

    expect(validatedData.data.date).toBe(DAILY_UNIQUE_COMPANIES_TEST_DATE);
    expect(validatedData.data.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
