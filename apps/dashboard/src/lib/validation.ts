import { ShortlistType } from "@ganaka/db";
import dayjs from "dayjs";
import { z } from "zod";

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
const shortlistTypeSchema = z.enum(ShortlistType, {
  error: () => ({
    message: `Invalid type. Must be one of: ${Object.values(ShortlistType).join(
      ", "
    )}`,
  }),
});

/**
 * Schema for BuyerControlMethod
 */
const buyerControlMethodSchema = z.enum(
  {
    simple: "simple",
    total: "total",
    "price-weighted": "price-weighted",
    "near-price": "near-price",
    "volume-weighted": "volume-weighted",
    "bid-ask": "bid-ask",
    hybrid: "hybrid",
  },
  {
    error: () => ({
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
  type: z.enum(
    {
      TOP_GAINERS: ShortlistType.TOP_GAINERS,
      VOLUME_SHOCKERS: ShortlistType.VOLUME_SHOCKERS,
    },
    {
      error: () => ({
        message: "Invalid type. Must be TOP_GAINERS or VOLUME_SHOCKERS",
      }),
    }
  ),
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
