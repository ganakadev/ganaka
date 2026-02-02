import { z } from "zod";
import {
  apiResponseSchema,
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
