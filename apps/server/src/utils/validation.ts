import { z } from "zod";

/**
 * Query parameter schema for /quote endpoint
 */
export const quoteQuerySchema = z.object({
  symbol: z.string().min(1, "symbol query parameter is required"),
});

/**
 * Query parameter schema for /historical-candles endpoint
 */
export const historicalCandlesQuerySchema = z.object({
  symbol: z.string().min(1, "symbol query parameter is required"),
  interval: z.enum(["5minute", "15minute", "30minute", "1hour", "4hour"]),
  start_time: z.string().min(1, "start_time query parameter is required"),
  end_time: z.string().min(1, "end_time query parameter is required"),
});

/**
 * Helper function to format Zod validation errors for API responses
 */
export function formatZodError(error: z.ZodError): {
  error: string;
  details?: Record<string, string[]>;
} {
  const issues = error.issues;
  const details: Record<string, string[]> = {};

  issues.forEach((issue) => {
    const path = issue.path.join(".");
    if (!details[path]) {
      details[path] = [];
    }
    details[path].push(issue.message);
  });

  // If there's a single error, return it as the main error message
  if (issues.length === 1) {
    return {
      error: issues[0].message,
      details,
    };
  }

  // Multiple errors - return a general message with details
  return {
    error: "Validation failed",
    details,
  };
}
