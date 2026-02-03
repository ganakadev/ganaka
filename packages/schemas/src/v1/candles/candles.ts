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

// ==================== GET /candles ====================
// Unified endpoint for both dashboard and developer access

export const getCandles = {
  query: z.object({
    symbol: z.string(),
    date: dateFormatSchema,
    interval: z.enum(validCandleIntervals).optional(),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      candles: z.array(
        z.object({
          time: z.number(),
          open: z.number(),
          high: z.number(),
          low: z.number(),
          close: z.number(),
        })
      ),
      start_time: z.string().nullable(),
      end_time: z.string().nullable(),
      interval_in_minutes: z.number(),
    }),
  }),
};

// ==================== GET /candles (historical) ====================
// For developer access with datetime range

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
