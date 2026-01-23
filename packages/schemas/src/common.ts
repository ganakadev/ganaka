import { z } from "zod";
import { shortlistScopeEnum } from "@ganaka/db";

export const growwQuotePayloadSchema = z.object({
  average_price: z.number().nullable(),
  bid_quantity: z.number().nullable(),
  bid_price: z.number().nullable(),
  day_change: z.number().nullable(),
  day_change_perc: z.number().nullable(),
  upper_circuit_limit: z.number().nullable(),
  lower_circuit_limit: z.number().nullable(),
  ohlc: z
    .object({
      open: z.number().nullable(),
      high: z.number().nullable(),
      low: z.number().nullable(),
      close: z.number().nullable(),
    })
    .nullable(),
  depth: z
    .object({
      buy: z.array(
        z.object({
          price: z.number().nullable(),
          quantity: z.number().nullable(),
        })
      ),
      sell: z.array(
        z.object({
          price: z.number().nullable(),
          quantity: z.number().nullable(),
        })
      ),
    })
    .nullable(),
  high_trade_range: z.null().nullable(),
  implied_volatility: z.null().nullable(),
  last_trade_quantity: z.number().nullable(),
  last_trade_time: z.number().nullable(),
  low_trade_range: z.null().nullable(),
  last_price: z.number().nullable(),
  market_cap: z.number().nullable(),
  offer_price: z.number().nullable(),
  offer_quantity: z.number().nullable(),
  oi_day_change: z.number().nullable(),
  oi_day_change_percentage: z.number().nullable(),
  open_interest: z.number().nullable(),
  previous_open_interest: z.null().nullable(),
  total_buy_quantity: z.number().nullable(),
  total_sell_quantity: z.number().nullable(),
  volume: z.number().nullable(),
  week_52_high: z.number().nullable(),
  week_52_low: z.number().nullable(),
});

export const growwQuoteSchema = z.object({
  status: z.enum(["SUCCESS", "FAILURE"]),
  payload: growwQuotePayloadSchema,
});

export const shortlistEntrySchema = z.object({
  nseSymbol: z.string(),
  name: z.string(),
  price: z.number(),
  quoteData: growwQuoteSchema.nullable().optional(),
});

export const shortlistScopeSchema = z.enum(shortlistScopeEnum);

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
