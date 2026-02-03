import { z } from "zod";
import {
  apiResponseSchema,
  datetimeFormatSchema,
  growwQuoteSchema,
  timezoneSchema,
} from "../../../common";

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

// ==================== POST /nifty ====================

export const createNiftyQuote = {
  body: z.object({
    data: z.object({
      timestamp: datetimeFormatSchema,
      timezone: timezoneSchema.optional(),
      quoteData: growwQuoteSchema,
      dayChangePerc: z.number(),
    }),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      id: z.string(),
      timestamp: z.string(), // Format: YYYY-MM-DDTHH:mm:ss (UTC)
      dayChangePerc: z.number(),
    }),
  }),
};
