import { z } from "zod";
import { apiResponseSchema, dateFormatSchema } from "../../common";
import { shortlistTypeEnum } from "@ganaka/db";

// ==================== GET /daily-unique-companies ====================

export const getDailyUniqueCompanies = {
  query: z.object({
    date: dateFormatSchema,
    type: z.enum(shortlistTypeEnum),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      date: z.string(),
      type: z.enum(shortlistTypeEnum),
      uniqueCount: z.number(),
    }),
  }),
};
