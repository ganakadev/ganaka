import {
  CANDLES_TEST_DATE,
  createCandlesQuery,
  TEST_SYMBOL,
  buildQueryString,
} from "../../../fixtures/test-data";
import { authenticatedGet } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";

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

test.describe("GET /v1/candles", () => {
  test.describe.configure({ mode: "default" });

  test("should return 400 when symbol is missing", async () => {
    const query = { date: CANDLES_TEST_DATE };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when date is missing", async () => {
    const query = { symbol: TEST_SYMBOL };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when date format is invalid", async () => {
    const query = createCandlesQuery(TEST_SYMBOL, "invalid-date");
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when interval is invalid enum value", async () => {
    const query = createCandlesQuery(TEST_SYMBOL, CANDLES_TEST_DATE, "invalid-interval" as any);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should handle external API failures gracefully (500)", async () => {
    // Use a date that likely won't have data (far future or invalid symbol)
    const futureDate = "2099-01-01";
    const query = createCandlesQuery("INVALID_SYMBOL_XYZ", futureDate);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    // Should return 500 when external API fails
    expect([400, 500]).toContain(response.status);
  });
});
