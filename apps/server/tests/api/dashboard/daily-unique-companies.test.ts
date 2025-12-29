import { test, expect } from "@playwright/test";
import { authenticatedGet, unauthenticatedGet } from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import { createMultipleShortlistSnapshots } from "../../helpers/db-helpers";
import {
  TEST_DATE,
  createDailyUniqueCompaniesQuery,
  createValidShortlistEntries,
} from "../../fixtures/test-data";
import { v1_dashboard_schemas } from "@ganaka/schemas";

let developerToken: string;

test.beforeAll(async () => {
  const dev = await createDeveloperUser();
  developerToken = dev.token;
});

test.describe("GET /v1/dashboard/daily-unique-companies", () => {
  test("should return 401 when authorization header is missing", async () => {
    const query = createDailyUniqueCompaniesQuery();
    const queryString = new URLSearchParams(query as any).toString();
    const response = await unauthenticatedGet(
      `/v1/dashboard/daily-unique-companies?${queryString}`
    );

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = createDailyUniqueCompaniesQuery();
    const queryString = new URLSearchParams(query as any).toString();
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
    const queryString = new URLSearchParams(query as any).toString();
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
    const query = { date: TEST_DATE };
    const queryString = new URLSearchParams(query as any).toString();
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
    const queryString = new URLSearchParams(query as any).toString();
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
    const query = { date: TEST_DATE, type: "invalid-type" };
    const queryString = new URLSearchParams(query as any).toString();
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
    const queryString = new URLSearchParams(query as any).toString();
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

  test("should return 200 with correct unique count when snapshots exist", async () => {
    // Create snapshots with known entries
    const testEntries = createValidShortlistEntries();
    await createMultipleShortlistSnapshots("top-gainers", TEST_DATE, 5);

    const query = createDailyUniqueCompaniesQuery(TEST_DATE, "TOP_GAINERS");
    const queryString = new URLSearchParams(query as any).toString();
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

  test("should validate response structure (date, type, uniqueCount)", async () => {
    await createMultipleShortlistSnapshots("top-gainers", TEST_DATE, 3);

    const query = createDailyUniqueCompaniesQuery(TEST_DATE, "TOP_GAINERS");
    const queryString = new URLSearchParams(query as any).toString();
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

  test("should validate exact uniqueCount value (placeholder for user to fill)", async () => {
    await createMultipleShortlistSnapshots("top-gainers", TEST_DATE, 5);

    const query = createDailyUniqueCompaniesQuery(TEST_DATE, "TOP_GAINERS");
    const queryString = new URLSearchParams(query as any).toString();
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
    // TODO: Add exact value assertion here
    // expect(validatedData.data.uniqueCount).toBe(5); // Based on testEntries length
  });

  test("should validate date matches requested date format (YYYY-MM-DD)", async () => {
    await createMultipleShortlistSnapshots("top-gainers", TEST_DATE, 3);

    const query = createDailyUniqueCompaniesQuery(TEST_DATE, "TOP_GAINERS");
    const queryString = new URLSearchParams(query as any).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/daily-unique-companies?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_daily_unique_companies_schemas.getDailyUniqueCompanies.response.parse(
        response.data
      );

    expect(validatedData.data.date).toBe(TEST_DATE);
    expect(validatedData.data.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
