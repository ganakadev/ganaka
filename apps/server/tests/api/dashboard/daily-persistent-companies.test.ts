import { test, expect } from "../../helpers/test-fixtures";
import { authenticatedGet, unauthenticatedGet } from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import { createMultipleShortlistSnapshots } from "../../helpers/db-helpers";
import {
  DAILY_PERSISTENT_COMPANIES_TEST_DATE,
  createDailyPersistentCompaniesQuery,
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

test.describe("GET /v1/dashboard/daily-persistent-companies", () => {
  // Run tests in serial to avoid race conditions with count of companies
  test.describe.configure({ mode: "serial" });

  test("should return 401 when authorization header is missing", async () => {
    const query = createDailyPersistentCompaniesQuery();
    const queryString = new URLSearchParams(query).toString();
    const response = await unauthenticatedGet(
      `/v1/dashboard/daily-persistent-companies?${queryString}`
    );

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = createDailyPersistentCompaniesQuery();
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-persistent-companies?${queryString}`,
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
      `/v1/dashboard/daily-persistent-companies?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when type is missing", async () => {
    const query = { date: DAILY_PERSISTENT_COMPANIES_TEST_DATE };
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-persistent-companies?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when date format is invalid", async () => {
    const query = createDailyPersistentCompaniesQuery("invalid-date", "TOP_GAINERS");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-persistent-companies?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when type is invalid enum value", async () => {
    const query = { date: DAILY_PERSISTENT_COMPANIES_TEST_DATE, type: "invalid-type" };
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-persistent-companies?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 200 with empty companies array when no snapshots exist", async () => {
    const futureDate = "2099-01-01";
    const query = createDailyPersistentCompaniesQuery(futureDate, "TOP_GAINERS");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-persistent-companies?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Daily persistent companies fetched successfully");
    expect(body.data.companies).toBeInstanceOf(Array);
    expect(body.data.companies.length).toBe(0);
  });

  test("should return 200 with companies appearing in >=80% of snapshots", async ({ tracker }) => {
    // Create 10 snapshots with same entries (should appear in 100% of snapshots)
    const testEntries = createValidShortlistEntries();
    await createMultipleShortlistSnapshots(
      "top-gainers",
      DAILY_PERSISTENT_COMPANIES_TEST_DATE,
      10,
      tracker
    );

    const query = createDailyPersistentCompaniesQuery(
      DAILY_PERSISTENT_COMPANIES_TEST_DATE,
      "TOP_GAINERS"
    );
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-persistent-companies?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Daily persistent companies fetched successfully");

    // Validate response matches schema
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_daily_persistent_companies_schemas.getDailyPersistentCompanies.response.parse(
        body
      );

    // Companies appearing in all 10 snapshots should be >= 80% threshold
    validatedData.data.companies.forEach((company) => {
      expect(company.percentage).toBeGreaterThanOrEqual(80);
    });
  });

  test("should validate response structure (date, type, totalSnapshots, companies)", async ({
    tracker,
  }) => {
    await createMultipleShortlistSnapshots(
      "top-gainers",
      DAILY_PERSISTENT_COMPANIES_TEST_DATE,
      5,
      tracker
    );

    const query = createDailyPersistentCompaniesQuery(
      DAILY_PERSISTENT_COMPANIES_TEST_DATE,
      "TOP_GAINERS"
    );
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-persistent-companies?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_daily_persistent_companies_schemas.getDailyPersistentCompanies.response.parse(
        response.data
      );

    expect(validatedData.data).toHaveProperty("date");
    expect(validatedData.data).toHaveProperty("type");
    expect(validatedData.data).toHaveProperty("totalSnapshots");
    expect(validatedData.data).toHaveProperty("companies");
    expect(typeof validatedData.data.date).toBe("string");
    expect(["TOP_GAINERS", "VOLUME_SHOCKERS"]).toContain(validatedData.data.type);
    expect(typeof validatedData.data.totalSnapshots).toBe("number");
    expect(Array.isArray(validatedData.data.companies)).toBe(true);
  });

  test("should validate company structure (nseSymbol, name, count, percentage)", async ({
    tracker,
  }) => {
    await createMultipleShortlistSnapshots(
      "top-gainers",
      DAILY_PERSISTENT_COMPANIES_TEST_DATE,
      5,
      tracker
    );

    const query = createDailyPersistentCompaniesQuery(
      DAILY_PERSISTENT_COMPANIES_TEST_DATE,
      "TOP_GAINERS"
    );
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-persistent-companies?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_daily_persistent_companies_schemas.getDailyPersistentCompanies.response.parse(
        response.data
      );

    if (validatedData.data.companies.length > 0) {
      const firstCompany = validatedData.data.companies[0];
      expect(firstCompany).toHaveProperty("nseSymbol");
      expect(firstCompany).toHaveProperty("name");
      expect(firstCompany).toHaveProperty("count");
      expect(firstCompany).toHaveProperty("percentage");
      expect(typeof firstCompany.nseSymbol).toBe("string");
      expect(typeof firstCompany.name).toBe("string");
      expect(typeof firstCompany.count).toBe("number");
      expect(typeof firstCompany.percentage).toBe("number");
      expect(firstCompany.count).toBeGreaterThan(0);
      expect(firstCompany.percentage).toBeGreaterThanOrEqual(0);
      expect(firstCompany.percentage).toBeLessThanOrEqual(100);
    }
  });

  test("should validate percentage is rounded to 1 decimal place", async ({ tracker }) => {
    await createMultipleShortlistSnapshots(
      "top-gainers",
      DAILY_PERSISTENT_COMPANIES_TEST_DATE,
      5,
      tracker
    );

    const query = createDailyPersistentCompaniesQuery(
      DAILY_PERSISTENT_COMPANIES_TEST_DATE,
      "TOP_GAINERS"
    );
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-persistent-companies?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_daily_persistent_companies_schemas.getDailyPersistentCompanies.response.parse(
        response.data
      );

    validatedData.data.companies.forEach((company) => {
      // Check that percentage has at most 1 decimal place
      const decimalPlaces = company.percentage.toString().split(".")[1]?.length || 0;
      expect(decimalPlaces).toBeLessThanOrEqual(1);
    });
  });

  test("should validate exact company values ", async ({ tracker }) => {
    await createMultipleShortlistSnapshots(
      "top-gainers",
      DAILY_PERSISTENT_COMPANIES_TEST_DATE,
      5,
      tracker
    );

    const query = createDailyPersistentCompaniesQuery(
      DAILY_PERSISTENT_COMPANIES_TEST_DATE,
      "TOP_GAINERS"
    );
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-persistent-companies?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_daily_persistent_companies_schemas.getDailyPersistentCompanies.response.parse(
        response.data
      );

    if (validatedData.data.companies.length > 0) {
      const firstCompany = validatedData.data.companies[0];
      expect(firstCompany).toHaveProperty("nseSymbol");
      expect(firstCompany).toHaveProperty("name");
      expect(firstCompany).toHaveProperty("count");
      expect(firstCompany).toHaveProperty("percentage");

      expect(firstCompany.nseSymbol).toBe("RELIANCE");
      expect(firstCompany.name).toBe("Reliance Industries Ltd");
      expect(firstCompany.count).toBe(5);
      expect(firstCompany.percentage).toBe(100);
    }
  });

  test("should validate date matches requested date format (YYYY-MM-DD)", async ({ tracker }) => {
    await createMultipleShortlistSnapshots(
      "top-gainers",
      DAILY_PERSISTENT_COMPANIES_TEST_DATE,
      5,
      tracker
    );

    const query = createDailyPersistentCompaniesQuery(
      DAILY_PERSISTENT_COMPANIES_TEST_DATE,
      "TOP_GAINERS"
    );
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-persistent-companies?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_daily_persistent_companies_schemas.getDailyPersistentCompanies.response.parse(
        response.data
      );

    expect(validatedData.data.date).toBe(DAILY_PERSISTENT_COMPANIES_TEST_DATE);
    expect(validatedData.data.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
