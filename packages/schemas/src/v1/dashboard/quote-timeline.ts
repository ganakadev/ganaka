import { z } from "zod";
import {
  apiResponseSchema,
  dateFormatSchema,
  growwQuoteSchema,
  timezoneSchema,
} from "../../common";

// ==================== GET /quote-timeline ====================

export const getQuoteTimeline = {
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
