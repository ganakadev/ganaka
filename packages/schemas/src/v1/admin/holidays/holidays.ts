import { z } from "zod";
import { apiResponseSchema, dateFormatSchema } from "../../../common";

// ==================== GET /v1/admin/holidays ====================

export const getHolidays = {
  response: apiResponseSchema.extend({
    data: z.object({
      holidays: z.array(
        z.object({
          id: z.string().uuid(),
          date: dateFormatSchema,
          createdAt: z.date(),
          updatedAt: z.date(),
        })
      ),
    }),
  }),
};

// ==================== POST /v1/admin/holidays ====================

export const addHolidays = {
  body: z.object({
    dates: z.array(dateFormatSchema).min(1),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      holidays: z.array(
        z.object({
          id: z.string().uuid(),
          date: dateFormatSchema,
          createdAt: z.date(),
          updatedAt: z.date(),
        })
      ),
    }),
  }),
};

// ==================== DELETE /v1/admin/holidays ====================

export const removeHolidays = {
  body: z.object({
    dates: z.array(dateFormatSchema).min(1),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      deleted: z.object({
        count: z.number(),
        dates: z.array(dateFormatSchema),
      }),
    }),
  }),
};
