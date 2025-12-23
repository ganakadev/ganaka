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
