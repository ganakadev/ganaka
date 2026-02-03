import { authenticatedGet, authenticatedDelete } from "../../../helpers/api-client";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";
import {
  createShortlistSnapshot,
  createQuoteSnapshot,
  createNiftyQuoteSnapshot,
} from "../../../helpers/db-helpers";
import { createValidGrowwQuotePayload } from "../../../fixtures/test-data";

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

test.describe("GET /v1/dates", () => {
  test.describe.configure({ mode: "serial" });

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

    const response = await authenticatedGet("/v1/dates", adminToken);

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

test.describe("DELETE /v1/dates", () => {
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

    const response = await authenticatedDelete("/v1/dates", adminToken, {
      data: {
        dates: [date1, date2],
      },
      validateStatus: () => true,
    });

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.data.deleted.shortlists).toBeGreaterThanOrEqual(2);
  });
});
