import { z } from "zod";

/**
 * Standard API response wrapper
 */
export const apiResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.unknown(),
});

export const apiErrorResponseSchema = z.object({
  error: z.string(),
  statusCode: z.number(),
  message: z.string(),
});

export const validCandleIntervals = [
  "1minute",
  "2minute",
  "3minute",
  "5minute",
  "10minute",
  "15minute",
  "30minute",
  "1hour",
  "4hour",
] as const;

export const datetimeFormatSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, {
    message: "datetime must be in format YYYY-MM-DDTHH:mm:ss (e.g., 2025-12-26T11:06:00)",
  })
  .refine(
    (val) => {
      // Validate that it's a valid datetime
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    {
      message: "datetime must be a valid date and time",
    }
  );

export const dateFormatSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "date must be in format YYYY-MM-DD (e.g., 2025-12-26)",
  })
  .refine(
    (val) => {
      // Validate that it's a valid date
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    {
      message: "date must be a valid date",
    }
  );
