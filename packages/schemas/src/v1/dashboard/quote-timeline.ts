import { z } from "zod";
import { apiResponseSchema, dateFormatSchema, growwQuoteSchema } from "../../common";

// ==================== GET /quote-timeline ====================

export const getQuoteTimeline = {
  query: z.object({
    symbol: z.string(),
    date: dateFormatSchema,
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
