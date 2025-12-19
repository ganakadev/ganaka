import { z } from "zod";
import { apiResponseSchema } from "../../common";
import { ShortlistType } from "@ganaka/db";

// ==================== GET /daily-unique-companies ====================

export const getDailyUniqueCompanies = {
  query: z.object({
    date: z.string(),
    type: z.enum([ShortlistType.TOP_GAINERS, ShortlistType.VOLUME_SHOCKERS]),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      date: z.string(),
      type: z.enum([ShortlistType.TOP_GAINERS, ShortlistType.VOLUME_SHOCKERS]),
      uniqueCount: z.number(),
    }),
  }),
};
