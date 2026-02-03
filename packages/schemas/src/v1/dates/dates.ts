import { z } from "zod";
import { apiResponseSchema, dateFormatSchema } from "../../common";

// ==================== GET /dates ====================
// Role-based: returns different data for admin vs developer

// Developer response (with timestamps)
export const getAvailableDates = {
  query: z.object({}),
  response: apiResponseSchema.extend({
    data: z.object({
      dates: z.array(
        z.object({
          date: z.string(), // Format: YYYY-MM-DD
          timestamps: z.array(z.string()), // Format: YYYY-MM-DDTHH:mm:ss (UTC)
        })
      ),
    }),
  }),
};

// Admin response (with counts)
export const getAvailableDatesAdmin = {
  query: z.object({}),
  response: apiResponseSchema.extend({
    data: z.object({
      dates: z.array(
        z.object({
          date: dateFormatSchema,
          shortlistCount: z.number(),
        })
      ),
    }),
  }),
};

// Dashboard response (with timestamps) - same as developer
export const getAvailableDatetimes = {
  query: z.object({}),
  response: apiResponseSchema.extend({
    data: z.object({
      dates: z.array(
        z.object({
          date: z.string(), // Format: YYYY-MM-DD
          timestamps: z.array(z.string()), // Format: YYYY-MM-DDTHH:mm:ss (UTC)
        })
      ),
    }),
  }),
};

// ==================== DELETE /dates ====================
// Admin only

export const deleteDates = {
  body: z.object({
    dates: z.array(dateFormatSchema).min(1),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      deleted: z.object({
        shortlists: z.number(),
      }),
    }),
  }),
};
