import { v1_developer_shortlist_persistence_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  buildQueryString,
  createValidShortlistEntries,
  generateUniqueTestDate,
  TEST_DATETIME,
} from "../../fixtures/test-data";
import { authenticatedGet, unauthenticatedGet } from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import { createShortlistSnapshot } from "../../helpers/db-helpers";
import { expect, test } from "../../helpers/test-fixtures";
import { TestDataTracker } from "../../helpers/test-tracker";

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

test.describe("GET /v1/developer/shortlists/persistence", () => {
  test("should return 401 when authorization header is missing", async () => {
    const query = {
      type: "top-gainers",
      start_datetime: TEST_DATETIME,
      end_datetime: TEST_DATETIME,
    };
    const queryString = buildQueryString(query);
    const response = await unauthenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`
    );

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = {
      type: "top-gainers",
      start_datetime: TEST_DATETIME,
      end_datetime: TEST_DATETIME,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`,
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when type parameter is missing", async () => {
    const query = {
      start_datetime: TEST_DATETIME,
      end_datetime: TEST_DATETIME,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when start_datetime is missing", async () => {
    const query = {
      type: "top-gainers",
      end_datetime: TEST_DATETIME,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when end_datetime is missing", async () => {
    const query = {
      type: "top-gainers",
      start_datetime: TEST_DATETIME,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when type is invalid enum value", async () => {
    const query = {
      type: "invalid-type",
      start_datetime: TEST_DATETIME,
      end_datetime: TEST_DATETIME,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when datetime format is invalid", async () => {
    const query = {
      type: "top-gainers",
      start_datetime: "invalid-datetime",
      end_datetime: TEST_DATETIME,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when start_datetime is after end_datetime", async () => {
    const startDatetime = "2025-12-26T11:00:00";
    const endDatetime = "2025-12-26T10:00:00";
    const query = {
      type: "top-gainers",
      start_datetime: startDatetime,
      end_datetime: endDatetime,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return empty array when no snapshots in range", async () => {
    const startDatetime = "2099-01-01T10:00:00";
    const endDatetime = "2099-01-01T11:00:00";
    const query = {
      type: "top-gainers",
      start_datetime: startDatetime,
      end_datetime: endDatetime,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Shortlist persistence fetched successfully");
    expect(body.data.totalSnapshots).toBe(0);
    expect(body.data.instruments).toEqual([]);
  });

  test("should return all instruments when snapshots exist with no overlapping symbols", async ({
    tracker,
  }) => {
    const uniqueDate = generateUniqueTestDate();
    const baseDatetime = `${uniqueDate}T10:00:00`;
    const startDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .subtract(1, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");
    const endDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .add(3, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");

    // Create snapshots with different symbols (no overlap)
    const entries1 = [
      { name: "Reliance Industries Ltd", price: 2500.0, nseSymbol: "RELIANCE" },
      { name: "Tata Consultancy Services", price: 3500.0, nseSymbol: "TCS" },
      { name: "HDFC Bank Ltd", price: 1600.0, nseSymbol: "HDFCBANK" },
    ];
    const entries2 = [
      { name: "Bharti Airtel Ltd", price: 1200.0, nseSymbol: "BHARTIARTL" },
      { name: "State Bank of India", price: 600.0, nseSymbol: "SBIN" },
      { name: "Bajaj Finance Ltd", price: 7500.0, nseSymbol: "BAJFINANCE" },
    ];
    await createShortlistSnapshot("top-gainers", baseDatetime, entries1, tracker);
    await createShortlistSnapshot(
      "top-gainers",
      dayjs.tz(baseDatetime, "Asia/Kolkata").add(2, "minute").format("YYYY-MM-DDTHH:mm:ss"),
      entries2,
      tracker
    );

    const query = {
      type: "top-gainers",
      start_datetime: startDatetime,
      end_datetime: endDatetime,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.data.totalSnapshots).toBe(2);
    // Should return all unique instruments from both snapshots
    expect(body.data.instruments.length).toBe(entries1.length + entries2.length);
    // All instruments should have appearanceCount of 1 (appear in only one snapshot)
    for (const instrument of body.data.instruments) {
      expect(instrument.appearanceCount).toBe(1);
      expect(instrument.totalSnapshots).toBe(2);
      expect(instrument.percentage).toBe(50);
    }
  });

  test("should return correct instruments when all appear in all snapshots", async ({
    tracker,
  }) => {
    const uniqueDate = generateUniqueTestDate();
    const baseDatetime = `${uniqueDate}T10:00:00`;
    const startDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .subtract(5, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");
    const endDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .add(5, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");

    // Create snapshots with same symbols
    const entries = createValidShortlistEntries();
    await createShortlistSnapshot("top-gainers", baseDatetime, entries, tracker);
    await createShortlistSnapshot(
      "top-gainers",
      dayjs.tz(baseDatetime, "Asia/Kolkata").add(2, "minute").format("YYYY-MM-DDTHH:mm:ss"),
      entries,
      tracker
    );

    const query = {
      type: "top-gainers",
      start_datetime: startDatetime,
      end_datetime: endDatetime,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.data.totalSnapshots).toBe(2);
    expect(body.data.instruments.length).toBe(entries.length);

    // Validate response matches schema
    const validatedData =
      v1_developer_shortlist_persistence_schemas.getShortlistPersistence.response.parse(body);
    expect(validatedData.data.instruments.length).toBe(entries.length);

    // Check that all instruments have correct structure
    for (const instrument of validatedData.data.instruments) {
      expect(instrument.appearanceCount).toBe(2);
      expect(instrument.totalSnapshots).toBe(2);
      expect(instrument.percentage).toBe(100);
      expect(instrument.nseSymbol).toBeDefined();
      expect(instrument.name).toBeDefined();
    }
  });

  test("should order instruments by appearance count descending", async ({ tracker }) => {
    const uniqueDate = generateUniqueTestDate();
    const baseDatetime = `${uniqueDate}T10:00:00`;
    const startDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .subtract(5, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");
    const endDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .add(10, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");

    // Create 3 snapshots
    // Symbol A appears in all 3
    // Symbol B appears in first 2
    // Symbol C appears only in first
    const entries1 = [
      { nseSymbol: "SYMBOL_A", name: "Symbol A", price: 100 },
      { nseSymbol: "SYMBOL_B", name: "Symbol B", price: 200 },
      { nseSymbol: "SYMBOL_C", name: "Symbol C", price: 300 },
    ];
    const entries2 = [
      { nseSymbol: "SYMBOL_A", name: "Symbol A", price: 110 },
      { nseSymbol: "SYMBOL_B", name: "Symbol B", price: 210 },
    ];
    const entries3 = [{ nseSymbol: "SYMBOL_A", name: "Symbol A", price: 120 }];

    await createShortlistSnapshot("top-gainers", baseDatetime, entries1, tracker);
    await createShortlistSnapshot(
      "top-gainers",
      dayjs.tz(baseDatetime, "Asia/Kolkata").add(2, "minute").format("YYYY-MM-DDTHH:mm:ss"),
      entries2,
      tracker
    );
    await createShortlistSnapshot(
      "top-gainers",
      dayjs.tz(baseDatetime, "Asia/Kolkata").add(4, "minute").format("YYYY-MM-DDTHH:mm:ss"),
      entries3,
      tracker
    );

    const query = {
      type: "top-gainers",
      start_datetime: startDatetime,
      end_datetime: endDatetime,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.data.totalSnapshots).toBe(3);
    // Should return all 3 symbols ordered by appearance count
    expect(body.data.instruments.length).toBe(3);
    // Verify ordering: SYMBOL_A (3) > SYMBOL_B (2) > SYMBOL_C (1)
    expect(body.data.instruments[0].nseSymbol).toBe("SYMBOL_A");
    expect(body.data.instruments[0].appearanceCount).toBe(3);
    expect(body.data.instruments[0].percentage).toBe(100);
    expect(body.data.instruments[1].nseSymbol).toBe("SYMBOL_B");
    expect(body.data.instruments[1].appearanceCount).toBe(2);
    expect(body.data.instruments[1].percentage).toBe(66.7);
    expect(body.data.instruments[2].nseSymbol).toBe("SYMBOL_C");
    expect(body.data.instruments[2].appearanceCount).toBe(1);
    expect(body.data.instruments[2].percentage).toBe(33.3);
    // Verify ordering is correct
    expect(body.data.instruments[0].appearanceCount).toBeGreaterThanOrEqual(
      body.data.instruments[1].appearanceCount
    );
    expect(body.data.instruments[1].appearanceCount).toBeGreaterThanOrEqual(
      body.data.instruments[2].appearanceCount
    );
  });

  test("should handle empty snapshots (exclude from count)", async ({ tracker }) => {
    const uniqueDate = generateUniqueTestDate();
    const baseDatetime = `${uniqueDate}T10:00:00`;
    const startDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .subtract(5, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");
    const endDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .add(5, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");

    // Create one snapshot with entries and one empty snapshot
    const entries = createValidShortlistEntries();
    await createShortlistSnapshot("top-gainers", baseDatetime, entries, tracker);
    await createShortlistSnapshot(
      "top-gainers",
      dayjs.tz(baseDatetime, "Asia/Kolkata").add(2, "minute").format("YYYY-MM-DDTHH:mm:ss"),
      [],
      tracker
    );

    const query = {
      type: "top-gainers",
      start_datetime: startDatetime,
      end_datetime: endDatetime,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    // Empty snapshot should be excluded from count
    expect(body.data.totalSnapshots).toBe(1);
    // All instruments from the non-empty snapshot should appear
    expect(body.data.instruments.length).toBe(entries.length);
  });

  test("should handle duplicate symbols in same snapshot (count once)", async ({ tracker }) => {
    const uniqueDate = generateUniqueTestDate();
    const baseDatetime = `${uniqueDate}T10:00:00`;
    const startDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .subtract(5, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");
    const endDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .add(5, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");

    // Create snapshot with duplicate symbol
    const entries = [
      { nseSymbol: "SYMBOL_A", name: "Symbol A", price: 100 },
      { nseSymbol: "SYMBOL_A", name: "Symbol A Duplicate", price: 100 }, // Duplicate
      { nseSymbol: "SYMBOL_B", name: "Symbol B", price: 200 },
    ];
    await createShortlistSnapshot("top-gainers", baseDatetime, entries, tracker);

    const query = {
      type: "top-gainers",
      start_datetime: startDatetime,
      end_datetime: endDatetime,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.data.totalSnapshots).toBe(1);
    // Should only count SYMBOL_A once
    expect(body.data.instruments.length).toBe(2);
    const symbolA = body.data.instruments.find((inst: any) => inst.nseSymbol === "SYMBOL_A");
    expect(symbolA).toBeDefined();
    expect(symbolA.appearanceCount).toBe(1);
  });

  test("should return all instruments with correct appearance counts when not all appear in all snapshots", async ({
    tracker,
  }) => {
    const uniqueDate = generateUniqueTestDate();
    const baseDatetime = `${uniqueDate}T10:00:00`;
    const startDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .subtract(5, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");
    const endDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .add(5, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");

    // Create 2 snapshots with partial overlap
    const entries1 = [
      { nseSymbol: "SYMBOL_A", name: "Symbol A", price: 100 },
      { nseSymbol: "SYMBOL_B", name: "Symbol B", price: 200 },
    ];
    const entries2 = [
      { nseSymbol: "SYMBOL_A", name: "Symbol A", price: 110 },
      // SYMBOL_B missing in second snapshot
    ];

    await createShortlistSnapshot("top-gainers", baseDatetime, entries1, tracker);
    await createShortlistSnapshot(
      "top-gainers",
      dayjs.tz(baseDatetime, "Asia/Kolkata").add(2, "minute").format("YYYY-MM-DDTHH:mm:ss"),
      entries2,
      tracker
    );

    const query = {
      type: "top-gainers",
      start_datetime: startDatetime,
      end_datetime: endDatetime,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.data.totalSnapshots).toBe(2);
    // Should return both symbols
    expect(body.data.instruments.length).toBe(2);
    // SYMBOL_A should appear first (higher appearance count)
    expect(body.data.instruments[0].nseSymbol).toBe("SYMBOL_A");
    expect(body.data.instruments[0].appearanceCount).toBe(2);
    expect(body.data.instruments[0].percentage).toBe(100);
    // SYMBOL_B should appear second (lower appearance count)
    expect(body.data.instruments[1].nseSymbol).toBe("SYMBOL_B");
    expect(body.data.instruments[1].appearanceCount).toBe(1);
    expect(body.data.instruments[1].percentage).toBe(50);
  });

  test("should handle single snapshot in range", async ({ tracker }) => {
    const uniqueDate = generateUniqueTestDate();
    const baseDatetime = `${uniqueDate}T10:00:00`;
    const startDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .subtract(5, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");
    const endDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .add(5, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");

    const entries = createValidShortlistEntries();
    await createShortlistSnapshot("top-gainers", baseDatetime, entries, tracker);

    const query = {
      type: "top-gainers",
      start_datetime: startDatetime,
      end_datetime: endDatetime,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.data.totalSnapshots).toBe(1);
    expect(body.data.instruments.length).toBe(entries.length);
    // All instruments should have 100% appearance
    for (const instrument of body.data.instruments) {
      expect(instrument.appearanceCount).toBe(1);
      expect(instrument.percentage).toBe(100);
    }
  });

  test("should work with volume-shockers type", async ({ tracker }) => {
    const uniqueDate = generateUniqueTestDate();
    console.log("uniqueDate", uniqueDate);
    const baseDatetime = `${uniqueDate}T10:00:00`;
    console.log("baseDatetime", baseDatetime);
    const startDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .subtract(5, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");
    const endDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .add(5, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");

    const entries = createValidShortlistEntries();
    await createShortlistSnapshot("volume-shockers", baseDatetime, entries, tracker);

    const query = {
      type: "volume-shockers",
      start_datetime: startDatetime,
      end_datetime: endDatetime,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.data.type).toBe("volume-shockers");
    expect(body.data.totalSnapshots).toBe(1);
    expect(body.data.instruments.length).toBe(entries.length);
  });

  test("should calculate percentage correctly", async ({ tracker }) => {
    const uniqueDate = generateUniqueTestDate();
    const baseDatetime = `${uniqueDate}T10:00:00`;
    const startDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .subtract(5, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");
    const endDatetime = dayjs
      .tz(baseDatetime, "Asia/Kolkata")
      .add(5, "minute")
      .format("YYYY-MM-DDTHH:mm:ss");

    // Create 4 snapshots, symbol appears in all 4
    const entries = [{ nseSymbol: "SYMBOL_A", name: "Symbol A", price: 100 }];
    await createShortlistSnapshot("top-gainers", baseDatetime, entries, tracker);
    await createShortlistSnapshot(
      "top-gainers",
      dayjs.tz(baseDatetime, "Asia/Kolkata").add(1, "minute").format("YYYY-MM-DDTHH:mm:ss"),
      entries,
      tracker
    );
    await createShortlistSnapshot(
      "top-gainers",
      dayjs.tz(baseDatetime, "Asia/Kolkata").add(2, "minute").format("YYYY-MM-DDTHH:mm:ss"),
      entries,
      tracker
    );
    await createShortlistSnapshot(
      "top-gainers",
      dayjs.tz(baseDatetime, "Asia/Kolkata").add(3, "minute").format("YYYY-MM-DDTHH:mm:ss"),
      entries,
      tracker
    );

    const query = {
      type: "top-gainers",
      start_datetime: startDatetime,
      end_datetime: endDatetime,
    };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/shortlists/persistence?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.data.totalSnapshots).toBe(4);
    expect(body.data.instruments[0].appearanceCount).toBe(4);
    expect(body.data.instruments[0].percentage).toBe(100);
  });
});
