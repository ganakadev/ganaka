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
