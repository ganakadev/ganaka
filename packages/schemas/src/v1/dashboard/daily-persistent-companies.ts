import { z } from "zod";
import { apiResponseSchema } from "../../common";
import { ShortlistType } from "@ganaka/db";

// ==================== GET /daily-persistent-companies ====================

export const getDailyPersistentCompanies = {
  query: z.object({
    date: z.string(),
    type: z.enum([ShortlistType.TOP_GAINERS, ShortlistType.VOLUME_SHOCKERS]),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      date: z.string(),
      type: z.enum([ShortlistType.TOP_GAINERS, ShortlistType.VOLUME_SHOCKERS]),
      totalSnapshots: z.number(),
      companies: z.array(
        z.object({
          nseSymbol: z.string(),
          name: z.string(),
          count: z.number(),
          percentage: z.number(),
        })
      ),
    }),
  }),
};
