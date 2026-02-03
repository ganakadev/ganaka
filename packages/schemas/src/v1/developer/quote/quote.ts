import { z } from "zod";
import { apiResponseSchema, growwQuoteSchema } from "../../../common";

// ==================== GET /quote ====================

export const getGrowwQuote = {
  query: z.object({
    symbol: z.string(),
    exchange: z.enum(["NSE", "BSE"]).optional(),
    segment: z.enum(["CASH"]).optional(),
  }),
  response: apiResponseSchema.extend({
    data: growwQuoteSchema.nullable(),
  }),
};
