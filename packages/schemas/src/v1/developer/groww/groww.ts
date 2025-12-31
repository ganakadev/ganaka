import { z } from "zod";
import {
  apiResponseSchema,
  dateFormatSchema,
  datetimeFormatSchema,
  timezoneSchema,
  validCandleIntervals,
} from "../../../common";

// ==================== Schemas ====================

export const growwHistoricalCandlesSchema = z.object({
  status: z.enum(["SUCCESS", "FAILURE"]),
  payload: z.object({
    /**
     * [timestamp, open, high, low, close, volume, turnover]
     */
    candles: z.array(z.array(z.union([z.string(), z.number()]).nullable())),
    closing_price: z.number().nullable(),
    start_time: z.string(),
    end_time: z.string(),
    interval_in_minutes: z.number(),
  }),
});

export const growwQuoteSchema = z.object({
  status: z.enum(["SUCCESS", "FAILURE"]),
  payload: z.object({
    average_price: z.number().nullable(),
    bid_quantity: z.number().nullable(),
    bid_price: z.number().nullable(),
    day_change: z.number().nullable(),
    day_change_perc: z.number().nullable(),
    upper_circuit_limit: z.number().nullable(),
    lower_circuit_limit: z.number().nullable(),
    ohlc: z
      .object({
        open: z.number().nullable(),
        high: z.number().nullable(),
        low: z.number().nullable(),
        close: z.number().nullable(),
      })
      .nullable(),
    depth: z
      .object({
        buy: z.array(
          z.object({
            price: z.number().nullable(),
            quantity: z.number().nullable(),
          })
        ),
        sell: z.array(
          z.object({
            price: z.number().nullable(),
            quantity: z.number().nullable(),
          })
        ),
      })
      .nullable(),
    high_trade_range: z.null().nullable(),
    implied_volatility: z.null().nullable(),
    last_trade_quantity: z.number().nullable(),
    last_trade_time: z.number().nullable(),
    low_trade_range: z.null().nullable(),
    last_price: z.number().nullable(),
    market_cap: z.null().nullable(),
    offer_price: z.null().nullable(),
    offer_quantity: z.null().nullable(),
    oi_day_change: z.number().nullable(),
    oi_day_change_percentage: z.number().nullable(),
    open_interest: z.number().nullable(),
    previous_open_interest: z.null().nullable(),
    total_buy_quantity: z.number().nullable(),
    total_sell_quantity: z.number().nullable(),
    volume: z.number().nullable(),
    week_52_high: z.number().nullable(),
    week_52_low: z.number().nullable(),
  }),
});

// ==================== GET /historical-candles ====================

export const getGrowwHistoricalCandles = {
  query: z.object({
    symbol: z.string(),
    interval: z.enum(validCandleIntervals),
    start_datetime: datetimeFormatSchema,
    end_datetime: datetimeFormatSchema,
    timezone: timezoneSchema.optional(),
  }),
  response: apiResponseSchema.extend({
    data: growwHistoricalCandlesSchema,
  }),
};

// ==================== GET /quote ====================

export const getGrowwQuote = {
  query: z.object({
    symbol: z.string(),
    exchange: z.enum(["NSE", "BSE"]).optional(),
    segment: z.enum(["CASH"]).optional(),
    datetime: datetimeFormatSchema.optional(),
    timezone: timezoneSchema.optional(),
  }),
  response: apiResponseSchema.extend({
    data: growwQuoteSchema.nullable(),
  }),
};

// ==================== GET /token ====================

export const getGrowwToken = {
  response: apiResponseSchema.extend({
    data: z.string(),
  }),
};

// ==================== GET /quote-timeline ====================

export const getGrowwQuoteTimeline = {
  query: z.object({
    symbol: z.string(),
    date: dateFormatSchema,
    timezone: timezoneSchema.optional(),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      quoteTimeline: z.array(
        z.object({
          id: z.string(),
          timestamp: z.string(),
          nseSymbol: z.string(),
          quoteData: growwQuoteSchema,
          createdAt: z.string(),
          updatedAt: z.string(),
        })
      ),
    }),
  }),
};
