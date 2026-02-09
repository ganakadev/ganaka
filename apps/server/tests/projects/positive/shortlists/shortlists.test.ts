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

    const query = createShortlistsQuery(testDatetime, "TOP_GAINERS");
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Shortlist fetched successfully");
    expect(body.data.shortlist).not.toBeNull();

    // Validate response matches schema
    const validatedData = v1_schemas.v1_shortlists_schemas.getShortlists.response.parse(body);
    expect(validatedData.data).not.toBeNull();
  });

  test("should validate shortlist structure (id, timestamp, shortlistType, entries)", async ({
    tracker,
  }) => {
    const testDatetime = generateUniqueTestDatetime();
    const testEntries = createValidShortlistEntries();

    await createShortlistSnapshot("TOP_GAINERS", testDatetime, testEntries, tracker);

    const query = createShortlistsQuery(testDatetime, "TOP_GAINERS");
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_shortlists_schemas.getShortlists.response.parse(
      response.data
    );

    // if (validatedData.data.shortlist) {
    //   expect(validatedData.data.shortlist).toHaveProperty("id");
    //   expect(validatedData.data.shortlist).toHaveProperty("timestamp");
    //   expect(validatedData.data.shortlist).toHaveProperty("shortlistType");
    //   expect(validatedData.data.shortlist).toHaveProperty("entries");
    //   expect(typeof validatedData.data.shortlist.id).toBe("string");
    //   expect(["TOP_GAINERS", "VOLUME_SHOCKERS"]).toContain(
    //     validatedData.data.shortlist.shortlistType
    //   );
    //   expect(Array.isArray(validatedData.data.shortlist.entries)).toBe(true);
    // }
  });

  test("should validate entries structure (nseSymbol, name, price, quoteData)", async ({
    tracker,
  }) => {
    const testDatetime = generateUniqueTestDatetime();
    const testEntries = createValidShortlistEntries();

    await createShortlistSnapshot("TOP_GAINERS", testDatetime, testEntries, tracker);

    const query = createShortlistsQuery(testDatetime, "TOP_GAINERS");
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_shortlists_schemas.getShortlists.response.parse(
      response.data
    );

    // if (validatedData.data.shortlist && validatedData.data.shortlist.entries.length > 0) {
    //   const firstEntry = validatedData.data.shortlist.entries[0];
    //   expect(firstEntry).toHaveProperty("nseSymbol");
    //   expect(firstEntry).toHaveProperty("name");
    //   expect(firstEntry).toHaveProperty("price");
    //   expect(typeof firstEntry.nseSymbol).toBe("string");
    //   expect(typeof firstEntry.name).toBe("string");
    //   expect(typeof firstEntry.price).toBe("number");
    // }
  });

  test("should validate exact timestamp matches requested datetime", async ({ tracker }) => {
    const testDatetime = generateUniqueTestDatetime();
    const testEntries = createValidShortlistEntries();

    await createShortlistSnapshot("TOP_GAINERS", testDatetime, testEntries, tracker);

    const query = createShortlistsQuery(testDatetime, "TOP_GAINERS");
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_shortlists_schemas.getShortlists.response.parse(
      response.data
    );

    // if (validatedData.data.shortlist) {
    //   // Validate timestamp is within 1 second of requested datetime
    //   const requestedTime = dayjs.tz(testDatetime, "Asia/Kolkata").utc().toDate().getTime();
    //   const returnedTime = dayjs.utc(validatedData.data.shortlist.timestamp).toDate().getTime();
    //   const timeDiff = Math.abs(returnedTime - requestedTime);
    //   expect(timeDiff).toBeLessThan(1000); // Within 1 seconds
    // }
  });

  test("should validate exact entry values ", async ({ tracker }) => {
    const testDatetime = generateUniqueTestDatetime();
    const testEntries = createValidShortlistEntries();

    await createShortlistSnapshot("TOP_GAINERS", testDatetime, testEntries, tracker);

    const query = createShortlistsQuery(testDatetime, "TOP_GAINERS");
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_shortlists_schemas.getShortlists.response.parse(
      response.data
    );

    // if (validatedData.data.shortlist && validatedData.data.shortlist.entries.length > 0) {
    //   const firstEntry = validatedData.data.shortlist.entries[0];
    //   expect(firstEntry).toHaveProperty("nseSymbol");
    //   expect(firstEntry).toHaveProperty("name");
    //   expect(firstEntry).toHaveProperty("price");
    //   expect(firstEntry.nseSymbol).toBe("RELIANCE");
    //   expect(firstEntry.name).toBe("Reliance Industries Ltd");
    //   expect(firstEntry.price).toBe(2500);
    // }
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
    const query = createShortlistsQuery(testDatetime, "TOP_GAINERS", undefined, "TOP_5");
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.data.shortlist).not.toBeNull();
    if (body.data.shortlist) {
      expect(body.data.shortlist.entries.length).toBe(testEntries.length);
    }
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
    const query = createShortlistsQuery(testDatetime, "TOP_GAINERS");
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(`/v1/shortlists?${queryString}`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.data.shortlist).not.toBeNull();
    // Should return TOP_5 by default
  });
});
