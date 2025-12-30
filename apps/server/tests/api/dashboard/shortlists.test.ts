import { test, expect } from "../../helpers/test-fixtures";
import { authenticatedGet, unauthenticatedGet } from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import { createShortlistSnapshot, createQuoteSnapshot } from "../../helpers/db-helpers";
import {
  createValidShortlistEntries,
  createValidGrowwQuotePayload,
  createShortlistsQuery,
  TEST_DATETIME,
} from "../../fixtures/test-data";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import { TestDataTracker } from "../../helpers/test-tracker";
import z from "zod";

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

test.describe("GET /v1/dashboard/shortlists", () => {
  test("should return 401 when authorization header is missing", async () => {
    const query = createShortlistsQuery();
    const queryString = new URLSearchParams(query).toString();
    const response = await unauthenticatedGet(`/v1/dashboard/shortlists?${queryString}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = createShortlistsQuery();
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/shortlists?${queryString}`,
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
      `/v1/dashboard/shortlists?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when type is missing", async () => {
    const query = { date: TEST_DATETIME };
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/shortlists?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when date format is invalid", async () => {
    const query = createShortlistsQuery("invalid-date", "TOP_GAINERS");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/shortlists?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when type is invalid enum value", async () => {
    const query = { date: TEST_DATETIME, type: "invalid-type" };
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/shortlists?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when method is invalid enum value", async () => {
    const query = createShortlistsQuery(TEST_DATETIME, "TOP_GAINERS", "invalid-method" as any);
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/shortlists?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 200 with null shortlist when snapshot not found", async () => {
    const futureDatetime = "2099-01-01T10:06:00";
    const query = createShortlistsQuery(futureDatetime, "TOP_GAINERS");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/shortlists?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Shortlist fetched successfully");
    expect(body.data.shortlist).toBeNull();
  });

  test("should return 200 with shortlist data when valid params provided", async ({ tracker }) => {
    const testEntries = createValidShortlistEntries();
    const testQuoteData = createValidGrowwQuotePayload();

    // Create shortlist snapshot
    await createShortlistSnapshot("top-gainers", TEST_DATETIME, testEntries, tracker);

    // Create quote snapshots for each entry
    for (const entry of testEntries) {
      await createQuoteSnapshot(entry.nseSymbol, TEST_DATETIME, testQuoteData, tracker);
    }

    const query = createShortlistsQuery(TEST_DATETIME, "TOP_GAINERS");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/shortlists?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Shortlist fetched successfully");
    expect(body.data.shortlist).not.toBeNull();

    // Validate response matches schema
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.response.parse(body);
    expect(validatedData.data.shortlist).not.toBeNull();
  });

  test("should validate shortlist structure (id, timestamp, shortlistType, entries)", async ({
    tracker,
  }) => {
    const testEntries = createValidShortlistEntries();
    const testQuoteData = createValidGrowwQuotePayload();

    await createShortlistSnapshot("top-gainers", TEST_DATETIME, testEntries, tracker);
    for (const entry of testEntries) {
      await createQuoteSnapshot(entry.nseSymbol, TEST_DATETIME, testQuoteData, tracker);
    }

    const query = createShortlistsQuery(TEST_DATETIME, "TOP_GAINERS");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/shortlists?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.response.parse(
        response.data
      );

    if (validatedData.data.shortlist) {
      expect(validatedData.data.shortlist).toHaveProperty("id");
      expect(validatedData.data.shortlist).toHaveProperty("timestamp");
      expect(validatedData.data.shortlist).toHaveProperty("shortlistType");
      expect(validatedData.data.shortlist).toHaveProperty("entries");
      expect(typeof validatedData.data.shortlist.id).toBe("string");
      expect(["TOP_GAINERS", "VOLUME_SHOCKERS"]).toContain(
        validatedData.data.shortlist.shortlistType
      );
      expect(Array.isArray(validatedData.data.shortlist.entries)).toBe(true);
    }
  });

  test("should validate entries structure (nseSymbol, name, price, quoteData, buyerControlPercentage)", async ({
    tracker,
  }) => {
    const testEntries = createValidShortlistEntries();
    const testQuoteData = createValidGrowwQuotePayload();

    await createShortlistSnapshot("top-gainers", TEST_DATETIME, testEntries, tracker);
    for (const entry of testEntries) {
      await createQuoteSnapshot(entry.nseSymbol, TEST_DATETIME, testQuoteData, tracker);
    }

    const query = createShortlistsQuery(TEST_DATETIME, "TOP_GAINERS");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/shortlists?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.response.parse(
        response.data
      );

    if (validatedData.data.shortlist && validatedData.data.shortlist.entries.length > 0) {
      const firstEntry = validatedData.data.shortlist.entries[0];
      expect(firstEntry).toHaveProperty("nseSymbol");
      expect(firstEntry).toHaveProperty("name");
      expect(firstEntry).toHaveProperty("price");
      expect(firstEntry).toHaveProperty("quoteData");
      expect(firstEntry).toHaveProperty("buyerControlPercentage");
      expect(typeof firstEntry.nseSymbol).toBe("string");
      expect(typeof firstEntry.name).toBe("string");
      expect(typeof firstEntry.price).toBe("number");
      expect(typeof firstEntry.buyerControlPercentage).toBe("number");
    }
  });

  test("should validate quoteData structure matches schema", async ({ tracker }) => {
    const testEntries = createValidShortlistEntries();
    const testQuoteData = createValidGrowwQuotePayload();

    await createShortlistSnapshot("top-gainers", TEST_DATETIME, testEntries, tracker);
    for (const entry of testEntries) {
      await createQuoteSnapshot(entry.nseSymbol, TEST_DATETIME, testQuoteData, tracker);
    }

    const query = createShortlistsQuery(TEST_DATETIME, "TOP_GAINERS");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/shortlists?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.response.parse(
        response.data
      );

    if (validatedData.data.shortlist && validatedData.data.shortlist.entries.length > 0) {
      const firstEntry = validatedData.data.shortlist.entries[0];
      expect(firstEntry.quoteData).toHaveProperty("status");
      expect(firstEntry.quoteData).toHaveProperty("payload");
      expect(["SUCCESS", "FAILURE"]).toContain(firstEntry.quoteData.status);
      expect(firstEntry.quoteData.payload).toHaveProperty("ohlc");
      expect(firstEntry.quoteData.payload).toHaveProperty("depth");
      expect(firstEntry.quoteData.payload.ohlc).toHaveProperty("open");
      expect(firstEntry.quoteData.payload.ohlc).toHaveProperty("high");
      expect(firstEntry.quoteData.payload.ohlc).toHaveProperty("low");
      expect(firstEntry.quoteData.payload.ohlc).toHaveProperty("close");
    }
  });

  test("should validate exact timestamp matches requested datetime", async ({ tracker }) => {
    const testEntries = createValidShortlistEntries();
    const testQuoteData = createValidGrowwQuotePayload();

    await createShortlistSnapshot("top-gainers", TEST_DATETIME, testEntries, tracker);
    for (const entry of testEntries) {
      await createQuoteSnapshot(entry.nseSymbol, TEST_DATETIME, testQuoteData, tracker);
    }

    const query = createShortlistsQuery(TEST_DATETIME, "TOP_GAINERS");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/shortlists?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.response.parse(
        response.data
      );

    if (validatedData.data.shortlist) {
      // Validate timestamp is within 1 second of requested datetime
      const requestedTime = new Date(TEST_DATETIME).getTime();
      const returnedTime = new Date(validatedData.data.shortlist.timestamp).getTime();
      const timeDiff = Math.abs(returnedTime - requestedTime);
      expect(timeDiff).toBeLessThan(1000); // Within 1 second
    }
  });

  test("should validate buyerControlPercentage calculation for each method", async ({
    tracker,
  }) => {
    const testEntries = createValidShortlistEntries();
    const testQuoteData = createValidGrowwQuotePayload();

    await createShortlistSnapshot("top-gainers", TEST_DATETIME, testEntries, tracker);
    for (const entry of testEntries) {
      await createQuoteSnapshot(entry.nseSymbol, TEST_DATETIME, testQuoteData, tracker);
    }

    const methods: z.infer<
      typeof v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.query
    >["method"][] = [
      "simple",
      "total",
      "price-weighted",
      "near-price",
      "volume-weighted",
      "bid-ask",
      "hybrid",
    ];

    for (const method of methods) {
      const query = createShortlistsQuery(TEST_DATETIME, "TOP_GAINERS", method);
      const queryString = new URLSearchParams(query).toString();
      const response = await authenticatedGet(
        `/v1/dashboard/shortlists?${queryString}`,
        developerToken
      );

      expect(response.status).toBe(200);
      const validatedData =
        v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.response.parse(
          response.data
        );

      if (validatedData.data.shortlist && validatedData.data.shortlist.entries.length > 0) {
        validatedData.data.shortlist.entries.forEach((entry) => {
          expect(typeof entry.buyerControlPercentage).toBe("number");
          expect(entry.buyerControlPercentage).toBeGreaterThanOrEqual(0);
          expect(entry.buyerControlPercentage).toBeLessThanOrEqual(100);
        });
      }
    }
  });

  test("should validate exact entry values ", async ({ tracker }) => {
    const testEntries = createValidShortlistEntries();
    const testQuoteData = createValidGrowwQuotePayload();

    await createShortlistSnapshot("top-gainers", TEST_DATETIME, testEntries, tracker);
    for (const entry of testEntries) {
      await createQuoteSnapshot(entry.nseSymbol, TEST_DATETIME, testQuoteData, tracker);
    }

    const query = createShortlistsQuery(TEST_DATETIME, "TOP_GAINERS");
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/dashboard/shortlists?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.response.parse(
        response.data
      );

    if (validatedData.data.shortlist && validatedData.data.shortlist.entries.length > 0) {
      // Placeholder for exact value validation - user will fill with actual expected values
      const firstEntry = validatedData.data.shortlist.entries[0];
      expect(firstEntry).toHaveProperty("nseSymbol");
      expect(firstEntry).toHaveProperty("name");
      expect(firstEntry).toHaveProperty("price");
      expect(firstEntry).toHaveProperty("buyerControlPercentage");
      expect(firstEntry.nseSymbol).toBe("RELIANCE");
      expect(firstEntry.name).toBe("Reliance Industries Ltd");
      expect(firstEntry.price).toBe(2500);
      expect(firstEntry.buyerControlPercentage).toBe(48.676363583030394);
    }
  });
});
