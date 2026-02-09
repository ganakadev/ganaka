import { z } from "zod";
import {
  apiResponseSchema,
  dateFormatSchema,
  datetimeFormatSchema,
  timezoneSchema,
  validCandleIntervals,
} from "../../common";

// ==================== Schemas ====================

const candleSourceSchema = z.enum(["db", "broker"]);

export const candlesSchema = z.object({
  status: z.enum(["SUCCESS", "FAILURE"]),
  payload: z.object({
    /**
     * [timestamp, open, high, low, close, volume, turnover]
     */
    candles: z.array(z.array(z.union([z.string(), z.number()]).nullable())),
    source: candleSourceSchema,
    closing_price: z.number().nullable(),
    start_time: z.string().nullable(),
    end_time: z.string().nullable(),
    interval_in_minutes: z.number().nullable(),
  }),
});

// ==================== GET /candles (dashboard) ====================
// Unified endpoint for both dashboard and developer access

export const getDashboardCandles = {
  query: z.object({
    symbol: z.string(),
    date: dateFormatSchema,
    ignoreDb: z.coerce.boolean().optional(),
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
      source: candleSourceSchema,
      start_time: z.string().nullable(),
      end_time: z.string().nullable(),
      interval_in_minutes: z.number(),
    }),
  }),
};

// ==================== GET /candles (developer) ====================
// For developer access with datetime range

export const getDeveloperCandles = {
  query: z.object({
    symbol: z.string(),
    interval: z.enum(validCandleIntervals),
    start_datetime: datetimeFormatSchema,
    end_datetime: datetimeFormatSchema,
    ignoreDb: z.coerce.boolean().optional(),
    timezone: timezoneSchema.optional(),
  }),
  response: apiResponseSchema.extend({
    data: candlesSchema,
  }),
};
