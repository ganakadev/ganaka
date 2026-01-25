import { z } from "zod";
import { apiResponseSchema, dateFormatSchema } from "../../../common";

// ==================== GET /v1/admin/data/available-dates ====================

export const getAvailableDates = {
  query: z.object({}),
  response: apiResponseSchema.extend({
    data: z.object({
      dates: z.array(
        z.object({
          date: dateFormatSchema,
          shortlistCount: z.number(),
          quoteCount: z.number(),
          niftyCount: z.number(),
        })
      ),
    }),
  }),
};

// ==================== DELETE /v1/admin/data/dates ====================

export const deleteDates = {
  body: z.object({
    dates: z.array(dateFormatSchema).min(1),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      deleted: z.object({
        shortlists: z.number(),
        quotes: z.number(),
        niftyQuotes: z.number(),
      }),
    }),
  }),
};
