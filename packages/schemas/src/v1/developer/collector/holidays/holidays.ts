import { z } from "zod";
import { apiResponseSchema, dateFormatSchema } from "../../../../common";

// ==================== GET /check-holiday ====================

export const checkHoliday = {
  query: z.object({
    date: dateFormatSchema,
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      isHoliday: z.boolean(),
      date: dateFormatSchema,
    }),
  }),
};
