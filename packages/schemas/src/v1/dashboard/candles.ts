import { z } from "zod";
import { apiResponseSchema } from "../../common";

// ==================== GET /candles ====================

export const getCandles = {
  query: z.object({
    symbol: z.string(),
    date: z.string(),
    interval: z
      .enum(["5minute", "15minute", "30minute", "1hour", "4hour"])
      .optional(),
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
      start_time: z.string(),
      end_time: z.string(),
      interval_in_minutes: z.number(),
    }),
  }),
};
