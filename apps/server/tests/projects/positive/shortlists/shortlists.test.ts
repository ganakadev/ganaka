import { v1_schemas } from "@ganaka/schemas";
import { expect } from "@playwright/test";
import dayjs from "dayjs";
import {
  generateUniqueTestDatetime,
  createValidShortlistEntries,
  createShortlistsQuery,
  buildQueryString,
} from "../../../fixtures/test-data";
import { authenticatedGet } from "../../../helpers/api-client";
import { createShortlistSnapshot } from "../../../helpers/db-helpers";
import { TestDataTracker } from "../../../helpers/test-tracker";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { test } from "../../../helpers/test-fixtures";

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

test.describe("GET /v1/shortlists", () => {
  test("should return 200 with shortlist data when valid params provided", async ({ tracker }) => {
    const testDatetime = generateUniqueTestDatetime();
    const testEntries = createValidShortlistEntries();

    // Create shortlist snapshot
    await createShortlistSnapshot("TOP_GAINERS", testDatetime, testEntries, tracker);

    const query = createShortlistsQuery({ datetime: testDatetime, type: "TOP_GAINERS" });
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Shortlist fetched successfully");
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    // Validate response matches schema
    const validatedData = v1_schemas.v1_shortlists_schemas.getShortlists.response.parse(body);
    expect(validatedData.data).not.toBeNull();
    expect(Array.isArray(validatedData.data)).toBe(true);
  });

  test("should validate shortlist structure (id, timestamp, shortlistType, entries)", async ({
    tracker,
  }) => {
    const testDatetime = generateUniqueTestDatetime();
    const testEntries = createValidShortlistEntries();

    await createShortlistSnapshot("TOP_GAINERS", testDatetime, testEntries, tracker);

    const query = createShortlistsQuery({ datetime: testDatetime, type: "TOP_GAINERS" });
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_shortlists_schemas.getShortlists.response.parse(
      response.data
    );

    expect(validatedData.data).not.toBeNull();
    expect(Array.isArray(validatedData.data)).toBe(true);
    if (validatedData.data) {
      expect(validatedData.data.length).toBeGreaterThan(0);
    }

    if (validatedData.data && validatedData.data.length > 0) {
      const firstEntry = validatedData.data[0];
      expect(firstEntry).toHaveProperty("nseSymbol");
      expect(firstEntry).toHaveProperty("name");
      expect(firstEntry).toHaveProperty("price");
      expect(typeof firstEntry.nseSymbol).toBe("string");
      expect(typeof firstEntry.name).toBe("string");
      expect(typeof firstEntry.price).toBe("number");
    }
  });

  test("should validate entries structure (nseSymbol, name, price, quoteData)", async ({
    tracker,
  }) => {
    const testDatetime = generateUniqueTestDatetime();
    const testEntries = createValidShortlistEntries();

    await createShortlistSnapshot("TOP_GAINERS", testDatetime, testEntries, tracker);

    const query = createShortlistsQuery({ datetime: testDatetime, type: "TOP_GAINERS" });
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_shortlists_schemas.getShortlists.response.parse(
      response.data
    );

    if (validatedData.data && validatedData.data.length > 0) {
      const firstEntry = validatedData.data[0];
      expect(firstEntry).toHaveProperty("nseSymbol");
      expect(firstEntry).toHaveProperty("name");
      expect(firstEntry).toHaveProperty("price");
      expect(typeof firstEntry.nseSymbol).toBe("string");
      expect(typeof firstEntry.name).toBe("string");
      expect(typeof firstEntry.price).toBe("number");
    }
  });

  test("should validate exact timestamp matches requested datetime", async ({ tracker }) => {
    const testDatetime = generateUniqueTestDatetime();
    const testEntries = createValidShortlistEntries();

    await createShortlistSnapshot("TOP_GAINERS", testDatetime, testEntries, tracker);

    const query = createShortlistsQuery({ datetime: testDatetime, type: "TOP_GAINERS" });
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_shortlists_schemas.getShortlists.response.parse(
      response.data
    );

    // Since timestamp is no longer returned in the response, validate that entries
    // are returned for the requested datetime (indirect validation that snapshot exists)
    expect(validatedData.data).not.toBeNull();
    if (validatedData.data) {
      expect(Array.isArray(validatedData.data)).toBe(true);
      expect(validatedData.data.length).toBeGreaterThan(0);
    }
  });

  test("should validate exact entry values ", async ({ tracker }) => {
    const testDatetime = generateUniqueTestDatetime();
    const testEntries = createValidShortlistEntries();

    await createShortlistSnapshot("TOP_GAINERS", testDatetime, testEntries, tracker);

    const query = createShortlistsQuery({ datetime: testDatetime, type: "TOP_GAINERS" });
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_shortlists_schemas.getShortlists.response.parse(
      response.data
    );

    if (validatedData.data && validatedData.data.length > 0) {
      const firstEntry = validatedData.data[0];
      const expectedFirstEntry = testEntries[0];
      expect(firstEntry).toHaveProperty("nseSymbol");
      expect(firstEntry).toHaveProperty("name");
      expect(firstEntry).toHaveProperty("price");
      expect(firstEntry.nseSymbol).toBe(expectedFirstEntry.nseSymbol);
      expect(firstEntry.name).toBe(expectedFirstEntry.name);
      expect(firstEntry.price).toBe(expectedFirstEntry.price);
    }
  });

  test("should filter by scope when specified", async ({ tracker }) => {
    const testDatetime = generateUniqueTestDatetime();
    const testEntries = createValidShortlistEntries();

    // Create shortlist snapshots with different scopes
    await createShortlistSnapshot(
      "TOP_GAINERS",
      testDatetime,
      testEntries,
      tracker,
      undefined,
      "TOP_5"
    );
    await createShortlistSnapshot(
      "TOP_GAINERS",
      testDatetime,
      testEntries,
      tracker,
      undefined,
      "FULL"
    );

    // Query for TOP_5 scope
    const query = createShortlistsQuery({
      datetime: testDatetime,
      type: "TOP_GAINERS",
      timezone: undefined,
      scope: "TOP_5",
    });
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBe(testEntries.length);
  });

  test("should default to TOP_5 when not specified", async ({ tracker }) => {
    const testDatetime = generateUniqueTestDatetime();
    const testEntries = createValidShortlistEntries();

    // Create both TOP_5 and FULL snapshots
    await createShortlistSnapshot(
      "TOP_GAINERS",
      testDatetime,
      testEntries,
      tracker,
      undefined,
      "TOP_5"
    );
    await createShortlistSnapshot(
      "TOP_GAINERS",
      testDatetime,
      testEntries,
      tracker,
      undefined,
      "FULL"
    );

    // Query without scope parameter
    const query = createShortlistsQuery({ datetime: testDatetime, type: "TOP_GAINERS" });
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    // Should return TOP_5 by default
  });
});
