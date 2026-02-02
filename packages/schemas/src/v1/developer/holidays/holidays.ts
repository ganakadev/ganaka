import { z } from "zod";
import { apiResponseSchema, dateFormatSchema } from "../../../common";

// ==================== GET /v1/developer/holidays ====================

export const getHolidays = {
  response: apiResponseSchema.extend({
    data: z.object({
      holidays: z.array(
        z.object({
          id: z.string().uuid(),
          date: dateFormatSchema,
          createdAt: z.coerce.date(),
          updatedAt: z.coerce.date(),
        })
      ),
    }),
  }),
};
