import { v1_developer_groww_schemas } from "@ganaka/schemas";
import { expect, test } from "../../helpers/test-fixtures";
import {
  createGrowwQuoteQuery,
  createHistoricalCandlesQuery,
  createQuoteTimelineQuery,
  createValidGrowwQuotePayload,
  TEST_DATE,
  TEST_DATETIME,
  TEST_SYMBOL,
} from "../../fixtures/test-data";
import { authenticatedGet, unauthenticatedGet } from "../../helpers/api-client";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import { createMultipleQuoteSnapshots, createQuoteSnapshot } from "../../helpers/db-helpers";
import { TestDataTracker } from "../../helpers/test-tracker";

// Helper function to convert query object to URLSearchParams-compatible format
function buildQueryString(query: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      params.append(key, value);
    }
  }
  return params.toString();
}

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

test.describe("GET /v1/developer/groww/token", () => {
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet("/v1/developer/groww/token");

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization header is required");
  });

  test("should return 401 when invalid token is provided", async () => {
    const response = await authenticatedGet("/v1/developer/groww/token", "invalid-token-12345", {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization failed");
  });

  test("should return token successfully with valid developer token", async () => {
    const response = await authenticatedGet("/v1/developer/groww/token", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Token fetched successfully");
    expect(typeof body.data).toBe("string");
    expect(body.data.length).toBeGreaterThan(0);

    // Validate response matches schema
    const validatedData = v1_developer_groww_schemas.getGrowwToken.response.parse(body);
    expect(validatedData.data).toBe(body.data);
  });
});

test.describe("GET /v1/developer/groww/quote", () => {
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet("/v1/developer/groww/quote?symbol=RELIANCE");

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const response = await authenticatedGet(
      "/v1/developer/groww/quote?symbol=RELIANCE",
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when symbol is missing", async () => {
    const response = await authenticatedGet("/v1/developer/groww/quote", developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when datetime format is invalid", async () => {
    const response = await authenticatedGet(
      `/v1/developer/groww/quote?symbol=${TEST_SYMBOL}&datetime=invalid-date`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return snapshot data when valid datetime and symbol are provided", async ({
    tracker,
  }) => {
    const testQuoteData = createValidGrowwQuotePayload();
    await createQuoteSnapshot(TEST_SYMBOL, TEST_DATETIME, testQuoteData, tracker);

    const query = createGrowwQuoteQuery(TEST_SYMBOL, TEST_DATETIME);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/groww/quote?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Quote fetched successfully");
    expect(body.data).not.toBeNull();

    // Validate response matches schema
    const validatedData = v1_developer_groww_schemas.getGrowwQuote.response.parse(body);
    expect(validatedData.data).not.toBeNull();

    // Validate data structure matches stored snapshot
    if (validatedData.data) {
      expect(validatedData.data.status).toBe("SUCCESS");
      expect(validatedData.data.payload.ohlc).toHaveProperty("open");
      expect(typeof validatedData.data.payload.ohlc.open).toBe("number");
      expect(validatedData.data.payload.ohlc).toHaveProperty("high");
      expect(validatedData.data.payload.ohlc).toHaveProperty("low");
      expect(validatedData.data.payload.ohlc).toHaveProperty("close");
      expect(validatedData.data.payload.depth.buy).toBeInstanceOf(Array);
      expect(validatedData.data.payload.depth.sell).toBeInstanceOf(Array);
      expect(typeof validatedData.data.payload.day_change).toBe("number");
      expect(typeof validatedData.data.payload.day_change_perc).toBe("number");
      expect(typeof validatedData.data.payload.volume).toBe("number");

      // Validate exact snapshot data values
      // OHLC values
      expect(validatedData.data.payload.ohlc.open).toBe(2475);
      expect(validatedData.data.payload.ohlc.high).toBe(2510);
      expect(validatedData.data.payload.ohlc.low).toBe(2470);
      expect(validatedData.data.payload.ohlc.close).toBe(2500);

      // Depth buy array
      expect(validatedData.data.payload.depth.buy).toHaveLength(3);
      expect(validatedData.data.payload.depth.buy[0]).toEqual({ price: 2500, quantity: 100 });
      expect(validatedData.data.payload.depth.buy[1]).toEqual({ price: 2499.5, quantity: 200 });
      expect(validatedData.data.payload.depth.buy[2]).toEqual({ price: 2499, quantity: 150 });

      // Depth sell array
      expect(validatedData.data.payload.depth.sell).toHaveLength(3);
      expect(validatedData.data.payload.depth.sell[0]).toEqual({ price: 2501, quantity: 100 });
      expect(validatedData.data.payload.depth.sell[1]).toEqual({ price: 2501.5, quantity: 200 });
      expect(validatedData.data.payload.depth.sell[2]).toEqual({ price: 2502, quantity: 150 });

      // Numeric fields
      expect(validatedData.data.payload.volume).toBe(50000);
      expect(validatedData.data.payload.bid_price).toBe(2501);
      expect(validatedData.data.payload.day_change).toBe(25.5);
      expect(validatedData.data.payload.last_price).toBe(2500);
      expect(validatedData.data.payload.day_change_perc).toBe(1.03);
      expect(validatedData.data.payload.bid_quantity).toBe(100);
      expect(validatedData.data.payload.week_52_high).toBe(2800);
      expect(validatedData.data.payload.week_52_low).toBe(2200);
      expect(validatedData.data.payload.average_price).toBe(2500.5);
      expect(validatedData.data.payload.oi_day_change).toBe(0);
      expect(validatedData.data.payload.total_buy_quantity).toBe(1000);
      expect(validatedData.data.payload.last_trade_quantity).toBe(50);
      expect(validatedData.data.payload.lower_circuit_limit).toBe(2250);
      expect(validatedData.data.payload.total_sell_quantity).toBe(1200);
      expect(validatedData.data.payload.upper_circuit_limit).toBe(2750);
      expect(validatedData.data.payload.oi_day_change_percentage).toBe(0);
      expect(validatedData.data.payload.last_trade_time).toBe(1705312200000);

      // Nullable fields
      expect(validatedData.data.payload.market_cap).toBeNull();
      expect(validatedData.data.payload.offer_price).toBeNull();
      expect(validatedData.data.payload.offer_quantity).toBeNull();
      expect(validatedData.data.payload.open_interest).toBeNull();
      expect(validatedData.data.payload.previous_open_interest).toBeNull();
      expect(validatedData.data.payload.low_trade_range).toBeNull();
      expect(validatedData.data.payload.high_trade_range).toBeNull();
      expect(validatedData.data.payload.implied_volatility).toBeNull();
    }
  });

  test("should return null data when snapshot is not found", async () => {
    const futureDatetime = "2099-01-01T10:30:00";
    const query = createGrowwQuoteQuery(TEST_SYMBOL, futureDatetime);
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/developer/groww/quote?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Quote snapshot not found");
    expect(body.data).toBeNull();
  });
});

test.describe("GET /v1/developer/groww/historical-candles", () => {
  test("should return 401 when authorization header is missing", async () => {
    const query = createHistoricalCandlesQuery();
    const queryString = buildQueryString(query);
    const response = await unauthenticatedGet(
      `/v1/developer/groww/historical-candles?${queryString}`
    );

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = createHistoricalCandlesQuery();
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/groww/historical-candles?${queryString}`,
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when symbol is missing", async () => {
    const query = createHistoricalCandlesQuery();
    const { symbol, ...queryWithoutSymbol } = query;
    const queryString = buildQueryString(queryWithoutSymbol);
    const response = await authenticatedGet(
      `/v1/developer/groww/historical-candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when interval is missing", async () => {
    const query = createHistoricalCandlesQuery();
    const { interval, ...queryWithoutInterval } = query;
    const queryString = buildQueryString(queryWithoutInterval);
    const response = await authenticatedGet(
      `/v1/developer/groww/historical-candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when start_time is missing", async () => {
    const query = createHistoricalCandlesQuery();
    const { start_datetime, ...queryWithoutStartTime } = query;
    const queryString = buildQueryString(queryWithoutStartTime);
    const response = await authenticatedGet(
      `/v1/developer/groww/historical-candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when end_time is missing", async () => {
    const query = createHistoricalCandlesQuery();
    const { end_datetime, ...queryWithoutEndTime } = query;
    const queryString = buildQueryString(queryWithoutEndTime);
    const response = await authenticatedGet(
      `/v1/developer/groww/historical-candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when interval is invalid", async () => {
    const query = createHistoricalCandlesQuery();
    const queryWithInvalidInterval = {
      ...query,
      interval: "invalid-interval",
    };
    const queryString = buildQueryString(queryWithInvalidInterval);
    const response = await authenticatedGet(
      `/v1/developer/groww/historical-candles?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return candles data with correct structure", async () => {
    const query = createHistoricalCandlesQuery();
    const queryString = new URLSearchParams(query).toString();
    const response = await authenticatedGet(
      `/v1/developer/groww/historical-candles?${queryString}`,
      developerToken
    );

    // Note: This test may fail if external API is unavailable, but structure validation should still work
    if (response.status === 200) {
      const body = response.data;
      expect(body.statusCode).toBe(200);
      expect(body.message).toBe("Historical candles fetched successfully");

      // Validate response matches schema
      const validatedData =
        v1_developer_groww_schemas.getGrowwHistoricalCandles.response.parse(body);
      expect(validatedData.data.status).toBe("SUCCESS");
      expect(validatedData.data.payload.candles).toBeInstanceOf(Array);
      expect(typeof validatedData.data.payload.start_time).toBe("string");
      expect(typeof validatedData.data.payload.end_time).toBe("string");
      expect(typeof validatedData.data.payload.interval_in_minutes).toBe("number");

      // Validate payload structure matches expected values
      expect(validatedData.data.payload.start_time).toBe(query.start_datetime);
      expect(validatedData.data.payload.end_time).toBe(query.end_datetime);
      expect(validatedData.data.payload.interval_in_minutes).toBe(5); // 5minute interval
      expect(validatedData.data.payload.closing_price).toBeNull();

      // Validate candle structure if candles exist
      if (validatedData.data.payload.candles.length > 0) {
        // Validate first candle structure
        const firstCandle = validatedData.data.payload.candles[0];
        expect(firstCandle).toBeInstanceOf(Array);
        expect(firstCandle.length).toBe(7); // [timestamp, open, high, low, close, volume, turnover]
        expect(typeof firstCandle[0]).toBe("string"); // timestamp
        expect(typeof firstCandle[1]).toBe("number"); // open
        expect(typeof firstCandle[2]).toBe("number"); // high
        expect(typeof firstCandle[3]).toBe("number"); // low
        expect(typeof firstCandle[4]).toBe("number"); // close
        expect(typeof firstCandle[5]).toBe("number"); // volume
        expect(firstCandle[6]).toBeNull(); // turnover

        // Validate all candles have correct structure
        validatedData.data.payload.candles.forEach((candle, index) => {
          expect(candle).toBeInstanceOf(Array);
          expect(candle.length).toBe(7);
          expect(typeof candle[0]).toBe("string"); // timestamp
          expect(typeof candle[1]).toBe("number"); // open
          expect(typeof candle[2]).toBe("number"); // high
          expect(typeof candle[3]).toBe("number"); // low
          expect(typeof candle[4]).toBe("number"); // close
          expect(typeof candle[5]).toBe("number"); // volume
          // Turnover can be null or number
          expect(candle[6] === null || typeof candle[6] === "number").toBe(true);
        });

        // Validate candles are ordered chronologically (timestamps should be ascending)
        for (let i = 1; i < validatedData.data.payload.candles.length; i++) {
          const prevTimestamp = validatedData.data.payload.candles[i - 1][0] as string;
          const currTimestamp = validatedData.data.payload.candles[i][0] as string;
          expect(new Date(currTimestamp).getTime()).toBeGreaterThanOrEqual(
            new Date(prevTimestamp).getTime()
          );
        }

        // Validate exact candle values from response
        const candles = validatedData.data.payload.candles;
        if (candles.length >= 1) {
          // First candle: ["2025-12-26T09:15:00", 1558.1, 1560.2, 1554.6, 1559.5, 102889, null]
          expect(candles[0][0]).toBe("2025-12-26T09:15:00"); // timestamp
          expect(candles[0][1]).toBe(1558.1); // open
          expect(candles[0][2]).toBe(1560.2); // high
          expect(candles[0][3]).toBe(1554.6); // low
          expect(candles[0][4]).toBe(1559.5); // close
          expect(candles[0][5]).toBe(102889); // volume
          expect(candles[0][6]).toBeNull(); // turnover
        }

        if (candles.length >= 2) {
          // Second candle: ["2025-12-26T09:20:00", 1560, 1560.1, 1555.7, 1557, 56459, null]
          expect(candles[1][0]).toBe("2025-12-26T09:20:00"); // timestamp
          expect(candles[1][1]).toBe(1560); // open
          expect(candles[1][2]).toBe(1560.1); // high
          expect(candles[1][3]).toBe(1555.7); // low
          expect(candles[1][4]).toBe(1557); // close
          expect(candles[1][5]).toBe(56459); // volume
          expect(candles[1][6]).toBeNull(); // turnover
        }

        if (candles.length >= 3) {
          // Third candle: ["2025-12-26T09:25:00", 1556.9, 1559, 1555.2, 1558.2, 43518, null]
          expect(candles[2][0]).toBe("2025-12-26T09:25:00"); // timestamp
          expect(candles[2][1]).toBe(1556.9); // open
          expect(candles[2][2]).toBe(1559); // high
          expect(candles[2][3]).toBe(1555.2); // low
          expect(candles[2][4]).toBe(1558.2); // close
          expect(candles[2][5]).toBe(43518); // volume
          expect(candles[2][6]).toBeNull(); // turnover
        }

        if (candles.length >= 4) {
          // Fourth candle: ["2025-12-26T09:30:00", 1558.6, 1558.7, 1555.5, 1557, 28010, null]
          expect(candles[3][0]).toBe("2025-12-26T09:30:00"); // timestamp
          expect(candles[3][1]).toBe(1558.6); // open
          expect(candles[3][2]).toBe(1558.7); // high
          expect(candles[3][3]).toBe(1555.5); // low
          expect(candles[3][4]).toBe(1557); // close
          expect(candles[3][5]).toBe(28010); // volume
          expect(candles[3][6]).toBeNull(); // turnover
        }

        if (candles.length >= 5) {
          // Fifth candle: ["2025-12-26T09:35:00", 1556.7, 1559.3, 1556.5, 1559.1, 15992, null]
          expect(candles[4][0]).toBe("2025-12-26T09:35:00"); // timestamp
          expect(candles[4][1]).toBe(1556.7); // open
          expect(candles[4][2]).toBe(1559.3); // high
          expect(candles[4][3]).toBe(1556.5); // low
          expect(candles[4][4]).toBe(1559.1); // close
          expect(candles[4][5]).toBe(15992); // volume
          expect(candles[4][6]).toBeNull(); // turnover
        }

        if (candles.length >= 6) {
          // Sixth candle: ["2025-12-26T09:40:00", 1559.2, 1559.2, 1556.1, 1557.9, 28023, null]
          expect(candles[5][0]).toBe("2025-12-26T09:40:00"); // timestamp
          expect(candles[5][1]).toBe(1559.2); // open
          expect(candles[5][2]).toBe(1559.2); // high
          expect(candles[5][3]).toBe(1556.1); // low
          expect(candles[5][4]).toBe(1557.9); // close
          expect(candles[5][5]).toBe(28023); // volume
          expect(candles[5][6]).toBeNull(); // turnover
        }

        if (candles.length >= 7) {
          // Seventh candle: ["2025-12-26T09:45:00", 1557.8, 1558, 1556.6, 1558, 17891, null]
          expect(candles[6][0]).toBe("2025-12-26T09:45:00"); // timestamp
          expect(candles[6][1]).toBe(1557.8); // open
          expect(candles[6][2]).toBe(1558); // high
          expect(candles[6][3]).toBe(1556.6); // low
          expect(candles[6][4]).toBe(1558); // close
          expect(candles[6][5]).toBe(17891); // volume
          expect(candles[6][6]).toBeNull(); // turnover
        }

        if (candles.length >= 8) {
          // Eighth candle: ["2025-12-26T09:50:00", 1557.7, 1558.4, 1555.1, 1556.5, 19948, null]
          expect(candles[7][0]).toBe("2025-12-26T09:50:00"); // timestamp
          expect(candles[7][1]).toBe(1557.7); // open
          expect(candles[7][2]).toBe(1558.4); // high
          expect(candles[7][3]).toBe(1555.1); // low
          expect(candles[7][4]).toBe(1556.5); // close
          expect(candles[7][5]).toBe(19948); // volume
          expect(candles[7][6]).toBeNull(); // turnover
        }

        if (candles.length >= 9) {
          // Ninth candle: ["2025-12-26T09:55:00", 1556.4, 1558.9, 1556.3, 1558, 15522, null]
          expect(candles[8][0]).toBe("2025-12-26T09:55:00"); // timestamp
          expect(candles[8][1]).toBe(1556.4); // open
          expect(candles[8][2]).toBe(1558.9); // high
          expect(candles[8][3]).toBe(1556.3); // low
          expect(candles[8][4]).toBe(1558); // close
          expect(candles[8][5]).toBe(15522); // volume
          expect(candles[8][6]).toBeNull(); // turnover
        }

        if (candles.length >= 10) {
          // Tenth candle: ["2025-12-26T10:00:00", 1558.2, 1558.5, 1557.7, 1558.3, 3467, null]
          expect(candles[9][0]).toBe("2025-12-26T10:00:00"); // timestamp
          expect(candles[9][1]).toBe(1558.2); // open
          expect(candles[9][2]).toBe(1558.5); // high
          expect(candles[9][3]).toBe(1557.7); // low
          expect(candles[9][4]).toBe(1558.3); // close
          expect(candles[9][5]).toBe(3467); // volume
          expect(candles[9][6]).toBeNull(); // turnover
        }
      }
    } else {
      // External API failure - should return 500
      expect(response.status).toBe(500);
    }
  });
});

test.describe("GET /v1/developer/groww/quote-timeline", () => {
  test("should return 401 when authorization header is missing", async () => {
    const query = createQuoteTimelineQuery();
    const queryString = buildQueryString(query);
    const response = await unauthenticatedGet(`/v1/developer/groww/quote-timeline?${queryString}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const query = createQuoteTimelineQuery();
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/groww/quote-timeline?${queryString}`,
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when symbol is missing", async () => {
    const query = createQuoteTimelineQuery();
    const { symbol, ...queryWithoutSymbol } = query;
    const queryString = buildQueryString(queryWithoutSymbol);
    const response = await authenticatedGet(
      `/v1/developer/groww/quote-timeline?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when date is missing", async () => {
    const query = createQuoteTimelineQuery();
    const { date, ...queryWithoutDate } = query;
    const queryString = buildQueryString(queryWithoutDate);
    const response = await authenticatedGet(
      `/v1/developer/groww/quote-timeline?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return empty array when no snapshots exist", async () => {
    const futureDate = "2099-01-01";
    const query = createQuoteTimelineQuery(TEST_SYMBOL, futureDate);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/groww/quote-timeline?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Quote timeline fetched successfully");
    expect(body.data.quoteTimeline).toBeInstanceOf(Array);
    expect(body.data.quoteTimeline.length).toBe(0);
  });

  test("should return timeline array for valid date with known symbol", async ({ tracker }) => {
    const testSymbol = TEST_SYMBOL;
    const testDate = TEST_DATE;
    const snapshotCount = 5;

    // Create multiple snapshots for the date
    await createMultipleQuoteSnapshots(testSymbol, testDate, snapshotCount, tracker);

    const query = createQuoteTimelineQuery(testSymbol, testDate);
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/groww/quote-timeline?${queryString}`,
      developerToken
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Quote timeline fetched successfully");

    // Validate response matches schema
    const validatedData = v1_developer_groww_schemas.getGrowwQuoteTimeline.response.parse(body);
    expect(validatedData.data.quoteTimeline).toBeInstanceOf(Array);
    expect(validatedData.data.quoteTimeline.length).toBeGreaterThanOrEqual(snapshotCount);

    // Validate each timeline entry structure (only first 6 entries)
    validatedData.data.quoteTimeline.slice(0, 6).forEach((entry, index) => {
      expect(entry).toHaveProperty("id");
      expect(entry).toHaveProperty("timestamp");
      expect(entry).toHaveProperty("nseSymbol");
      expect(entry).toHaveProperty("quoteData");
      expect(entry).toHaveProperty("createdAt");
      expect(entry).toHaveProperty("updatedAt");

      expect(entry.nseSymbol).toBe(testSymbol);

      // Validate quoteData structure
      expect(["SUCCESS", "FAILURE"]).toContain(entry.quoteData.status);
      expect(entry.quoteData.payload).toHaveProperty("ohlc");
      expect(entry.quoteData.payload).toHaveProperty("depth");
      expect(entry.quoteData.payload.ohlc).toHaveProperty("open");
      expect(entry.quoteData.payload.ohlc).toHaveProperty("high");
      expect(entry.quoteData.payload.ohlc).toHaveProperty("low");
      expect(entry.quoteData.payload.ohlc).toHaveProperty("close");
    });

    // Validate exact values for first 6 entries
    const timeline = validatedData.data.quoteTimeline;
    if (timeline.length >= 1) {
      // First entry
      expect(timeline[0].timestamp).toBe("2025-12-26T03:45:00.000Z");
      expect(timeline[0].nseSymbol).toBe(testSymbol);
      expect(timeline[0].quoteData.status).toBe("SUCCESS");
      expect(timeline[0].quoteData.payload.ohlc.low).toBe(2470);
      expect(timeline[0].quoteData.payload.ohlc.high).toBe(2510);
      expect(timeline[0].quoteData.payload.ohlc.open).toBe(2475);
      expect(timeline[0].quoteData.payload.ohlc.close).toBe(2500);
      expect(timeline[0].quoteData.payload.depth.buy).toEqual([{ price: 2500, quantity: 100 }]);
      expect(timeline[0].quoteData.payload.depth.sell).toEqual([{ price: 2501, quantity: 100 }]);
    }

    // Validate timeline entries are ordered by timestamp (ascending)
    for (let i = 1; i < validatedData.data.quoteTimeline.length; i++) {
      const prevTimestamp = new Date(validatedData.data.quoteTimeline[i - 1].timestamp).getTime();
      const currTimestamp = new Date(validatedData.data.quoteTimeline[i].timestamp).getTime();
      expect(currTimestamp).toBeGreaterThanOrEqual(prevTimestamp);
    }
  });
});
