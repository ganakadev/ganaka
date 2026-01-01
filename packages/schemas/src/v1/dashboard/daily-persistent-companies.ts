import { shortlistTypeEnum } from "@ganaka/db";
import { z } from "zod";
import { apiResponseSchema, dateFormatSchema } from "../../common";

// ==================== GET /daily-persistent-companies ====================

export const getDailyPersistentCompanies = {
  query: z.object({
    date: dateFormatSchema,
    type: z.enum(shortlistTypeEnum),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      date: z.string(),
      type: z.enum(shortlistTypeEnum),
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
