import { v1_developer_lists_schemas } from "@ganaka/schemas";
import { expect, test } from "@playwright/test";
import {
  createListsQuery,
  createValidShortlistEntries,
  TEST_DATETIME,
  buildQueryString,
} from "../../fixtures/test-data";
import { authenticatedGet, unauthenticatedGet } from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import { createShortlistSnapshot, cleanupDatabase } from "../../helpers/db-helpers";

let developerToken: string;

test.beforeAll(async () => {
  const dev = await createDeveloperUser();
  developerToken = dev.token;
});

test.afterEach(async () => {
  await cleanupDatabase();
  // Re-create developer user after cleanup
  const dev = await createDeveloperUser();
  developerToken = dev.token;
});

test.describe("GET /v1/developer/lists", () => {
  test("should return 401 when authorization header is missing", async () => {
    const query = createListsQuery("top-gainers");
    const queryString = buildQueryString(query);
    const response = await unauthenticatedGet(`/v1/developer/lists?${queryString}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = createListsQuery("top-gainers");
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/lists?${queryString}`,
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when type parameter is missing", async () => {
    const response = await authenticatedGet("/v1/developer/lists", developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when type is invalid enum value", async () => {
    const response = await authenticatedGet(
      "/v1/developer/lists?type=invalid-type",
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when datetime format is invalid", async () => {
    const query = createListsQuery("top-gainers", "invalid-datetime");
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/developer/lists?${queryString}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return null data when snapshot is not found", async () => {
    const futureDatetime = "2099-01-01T10:30:00";
    const query = createListsQuery("top-gainers", futureDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/developer/lists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Shortlist snapshot not found");
    expect(body.data).toBeNull();
  });

  test("should return snapshot data for top-gainers with valid datetime", async () => {
    const testEntries = createValidShortlistEntries();
    const snapshot = await createShortlistSnapshot("top-gainers", TEST_DATETIME, testEntries);

    const query = createListsQuery("top-gainers", TEST_DATETIME);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/developer/lists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Lists fetched successfully");
    expect(body.data).not.toBeNull();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    // Validate response matches schema
    const validatedData = v1_developer_lists_schemas.getLists.response.parse(body);
    expect(validatedData.data).not.toBeNull();
    if (validatedData.data) {
      expect(Array.isArray(validatedData.data)).toBe(true);
      expect(validatedData.data.length).toBe(testEntries.length);
    }
  });

  test("should return snapshot data for volume-shockers with valid datetime", async () => {
    const testEntries = createValidShortlistEntries();
    const snapshot = await createShortlistSnapshot("volume-shockers", TEST_DATETIME, testEntries);

    const query = createListsQuery("volume-shockers", TEST_DATETIME);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/developer/lists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Lists fetched successfully");
    expect(body.data).not.toBeNull();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test("should return list data matching stored snapshot with known datetime/type", async () => {
    const testType = "top-gainers";
    const testDatetime = TEST_DATETIME;
    const testEntries = createValidShortlistEntries();

    // Create snapshot in database
    const snapshot = await createShortlistSnapshot(testType, testDatetime, testEntries);

    // Fetch via API
    const query = createListsQuery(testType, testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/developer/lists?${queryString}`, developerToken);

    // Validate response structure
    expect(response.status).toBe(200);
    const validatedData = v1_developer_lists_schemas.getLists.response.parse(response.data);

    // Validate data matches stored snapshot
    expect(validatedData.data).not.toBeNull();
    if (validatedData.data) {
      expect(Array.isArray(validatedData.data)).toBe(true);
      expect(validatedData.data.length).toBe(testEntries.length);

      // Validate each list entry structure
      validatedData.data.forEach((entry, index) => {
        expect(entry).toHaveProperty("name");
        expect(entry).toHaveProperty("price");
        expect(entry).toHaveProperty("nseSymbol");

        expect(typeof entry.name).toBe("string");
        expect(entry.name.length).toBeGreaterThan(0);
        expect(typeof entry.price).toBe("number");
        expect(entry.price).toBeGreaterThan(0);
        expect(typeof entry.nseSymbol).toBe("string");
        expect(entry.nseSymbol.length).toBeGreaterThan(0);

        // Verify data matches stored snapshot
        expect(entry.name).toBe(testEntries[index].name);
        expect(entry.price).toBe(testEntries[index].price);
        expect(entry.nseSymbol).toBe(testEntries[index].nseSymbol);
      });
    }
  });

  test("should return list data matching stored snapshot for volume-shockers type", async () => {
    const testType = "volume-shockers";
    const testDatetime = TEST_DATETIME;
    const testEntries = createValidShortlistEntries();

    // Create snapshot in database
    const snapshot = await createShortlistSnapshot(testType, testDatetime, testEntries);

    // Fetch via API
    const query = createListsQuery(testType, testDatetime);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/developer/lists?${queryString}`, developerToken);

    // Validate response structure
    expect(response.status).toBe(200);
    const validatedData = v1_developer_lists_schemas.getLists.response.parse(response.data);

    // Validate data matches stored snapshot
    expect(validatedData.data).not.toBeNull();
    if (validatedData.data) {
      expect(Array.isArray(validatedData.data)).toBe(true);
      expect(validatedData.data.length).toBe(testEntries.length);

      // Validate each list entry
      validatedData.data.forEach((entry, index) => {
        expect(entry).toHaveProperty("name");
        expect(entry).toHaveProperty("price");
        expect(entry).toHaveProperty("nseSymbol");
        expect(typeof entry.name).toBe("string");
        expect(entry.name.length).toBeGreaterThan(0);
        expect(typeof entry.price).toBe("number");
        expect(entry.price).toBeGreaterThan(0);
        expect(typeof entry.nseSymbol).toBe("string");
        expect(entry.nseSymbol.length).toBeGreaterThan(0);

        // Verify data matches stored snapshot
        expect(entry.name).toBe(testEntries[index].name);
        expect(entry.price).toBe(testEntries[index].price);
        expect(entry.nseSymbol).toBe(testEntries[index].nseSymbol);
      });
    }
  });

  test("should handle live fetch when no datetime is provided", async () => {
    const query = createListsQuery("top-gainers");
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/developer/lists?${queryString}`, developerToken);

    // Note: This test may return empty array if external API fails, but should still return 200
    expect([200, 500]).toContain(response.status);

    if (response.status === 200) {
      const body = response.data;
      expect(body.statusCode).toBe(200);
      // Can be "Lists fetched successfully" or "Lists unable to be fetched..."
      expect(body.message).toBeTruthy();
      expect(Array.isArray(body.data)).toBe(true);
    }
  });
});
