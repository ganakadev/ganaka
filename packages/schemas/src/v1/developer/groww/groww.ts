import { z } from "zod";
import {
  apiResponseSchema,
  dateFormatSchema,
  datetimeFormatSchema,
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
    day_change: z.number(),
    day_change_perc: z.number(),
    upper_circuit_limit: z.number(),
    lower_circuit_limit: z.number(),
    ohlc: z.object({
      open: z.number(),
      high: z.number(),
      low: z.number(),
      close: z.number(),
    }),
    depth: z.object({
      buy: z.array(
        z.object({
          price: z.number(),
          quantity: z.number(),
        })
      ),
      sell: z.array(
        z.object({
          price: z.number(),
          quantity: z.number(),
        })
      ),
    }),
    high_trade_range: z.null(),
    implied_volatility: z.null(),
    last_trade_quantity: z.number(),
    last_trade_time: z.number(),
    low_trade_range: z.null(),
    last_price: z.number(),
    market_cap: z.null(),
    offer_price: z.null(),
    offer_quantity: z.null(),
    oi_day_change: z.number(),
    oi_day_change_percentage: z.number(),
    open_interest: z.number().nullable(),
    previous_open_interest: z.null(),
    total_buy_quantity: z.number(),
    total_sell_quantity: z.number(),
    volume: z.number(),
    week_52_high: z.number(),
    week_52_low: z.number(),
  }),
});

// ==================== GET /historical-candles ====================

export const getGrowwHistoricalCandles = {
  query: z.object({
    symbol: z.string(),
    interval: z.enum(validCandleIntervals),
    start_time: datetimeFormatSchema,
    end_time: datetimeFormatSchema,
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
