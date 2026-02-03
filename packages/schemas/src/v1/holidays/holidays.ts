import { z } from "zod";
import { apiResponseSchema, dateFormatSchema } from "../../../common";

// ==================== GET /holidays ====================

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

// ==================== POST /holidays ====================
// Admin only

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
          createdAt: z.coerce.date(),
          updatedAt: z.coerce.date(),
        })
      ),
    }),
  }),
};

// ==================== DELETE /holidays ====================
// Admin only

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

// ==================== GET /holidays/check ====================

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
