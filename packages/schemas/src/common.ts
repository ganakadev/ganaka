import { z } from "zod";
import { growwQuoteSchema } from "./v1/developer/groww/groww";
export { growwQuotePayloadSchema, growwQuoteSchema } from "./v1/developer/groww/groww";

export const shortlistEntrySchema = z.object({
  nseSymbol: z.string(),
  name: z.string(),
  price: z.number(),
  quoteData: growwQuoteSchema.nullable().optional(),
});

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
  "1day",
  "1week",
  "1month",
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

export const timezoneSchema = z
  .string()
  .regex(/^([A-Za-z_]+\/[A-Za-z_]+|[+-]\d{2}:\d{2})$/, {
    message:
      "timezone must be an IANA identifier (e.g., 'Asia/Kolkata') or offset (e.g., '+05:30')",
  })
  .refine(
    (val) => {
      // For IANA identifiers, validate they exist
      if (val.includes("/")) {
        try {
          // This will throw if the timezone is invalid
          new Intl.DateTimeFormat("en-US", { timeZone: val });
          return true;
        } catch {
          return false;
        }
      }
      // For offsets, validate format (+/-HH:MM)
      return /^([+-]\d{2}:\d{2})$/.test(val);
    },
    {
      message: "timezone must be a valid IANA identifier or UTC offset",
    }
  );
