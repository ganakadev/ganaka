import { z } from "zod";
import { ShortlistType } from "@prisma/client";
import { BuyerControlMethod } from "@/utils/buyerControl";
import dayjs from "dayjs";

/**
 * Validates a date string using dayjs
 */
const dateStringSchema = z.string().refine(
  (val) => {
    const parsed = dayjs(val);
    return parsed.isValid();
  },
  {
    message: "Invalid date format",
  }
);

/**
 * Schema for ShortlistType enum
 */
const shortlistTypeSchema = z.nativeEnum(ShortlistType, {
  errorMap: () => ({
    message: `Invalid type. Must be one of: ${Object.values(ShortlistType).join(
      ", "
    )}`,
  }),
});

/**
 * Schema for BuyerControlMethod
 */
const buyerControlMethodSchema = z.enum(
  [
    "simple",
    "total",
    "price-weighted",
    "near-price",
    "volume-weighted",
    "bid-ask",
    "hybrid",
  ],
  {
    errorMap: () => ({
      message:
        "Invalid method parameter. Supported methods: simple, total, price-weighted, near-price, volume-weighted, bid-ask, hybrid",
    }),
  }
);

/**
 * Query parameter schema for /api/shortlists
 * All parameters are optional
 */
export const shortlistsQuerySchema = z.object({
  date: dateStringSchema.optional(),
  type: shortlistTypeSchema.optional(),
  method: buyerControlMethodSchema.optional(),
});

/**
 * Query parameter schema for /api/daily-persistent-companies
 * Both date and type are required
 */
export const dailyPersistentCompaniesQuerySchema = z.object({
  date: dateStringSchema,
  type: z.enum([ShortlistType.TOP_GAINERS, ShortlistType.VOLUME_SHOCKERS], {
    errorMap: () => ({
      message: "Invalid type. Must be TOP_GAINERS or VOLUME_SHOCKERS",
    }),
  }),
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
