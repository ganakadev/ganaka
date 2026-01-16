import { z } from "zod";
import {
  apiResponseSchema,
  dateFormatSchema,
  datetimeFormatSchema,
  growwQuoteSchema,
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
    end_datetime: datetimeFormatSchema,
    timezone: timezoneSchema.optional(),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      quoteTimeline: z.array(
        z.object({
          id: z.string(),
          timestamp: z.string(), // Format: YYYY-MM-DDTHH:mm:ss (UTC)
          nseSymbol: z.string(),
          quoteData: growwQuoteSchema,
          createdAt: z.string(), // Format: YYYY-MM-DDTHH:mm:ss (UTC)
          updatedAt: z.string(), // Format: YYYY-MM-DDTHH:mm:ss (UTC)
        })
      ),
    }),
  }),
};

// ==================== GET /nifty ====================

export const getGrowwNiftyQuote = {
  query: z.object({
    datetime: datetimeFormatSchema.optional(),
    timezone: timezoneSchema.optional(),
  }),
  response: apiResponseSchema.extend({
    data: growwQuoteSchema.nullable(),
  }),
};
