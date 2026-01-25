import { z } from "zod";
import {
  apiResponseSchema,
  datetimeFormatSchema,
  dateFormatSchema,
  growwQuoteSchema,
  timezoneSchema,
} from "../../../common";
import { ShortlistType, shortlistScopeEnum } from "@ganaka/db";

// ==================== Schemas ====================

export const shortlistEntrySchema = z.object({
  nseSymbol: z.string(),
  name: z.string(),
  price: z.number(),
  quoteData: growwQuoteSchema.nullable().optional(),
});

export const shortlistTypeSchema = z.enum<ShortlistType[]>(["TOP_GAINERS", "VOLUME_SHOCKERS"]);

export const shortlistScopeSchema = z.enum(shortlistScopeEnum);

export const quoteSnapshotDataSchema = z.object({
  nseSymbol: z.string(),
  quoteData: growwQuoteSchema,
});

// ==================== POST /shortlists ====================

export const createShortlistSnapshot = {
  body: z.object({
    data: z.object({
      timestamp: datetimeFormatSchema,
      timezone: timezoneSchema.optional(),
      shortlistType: shortlistTypeSchema,
      entries: z.array(shortlistEntrySchema),
      scope: shortlistScopeSchema.optional(),
    }),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      id: z.string(),
      timestamp: z.string(), // Format: YYYY-MM-DDTHH:mm:ss (UTC)
      shortlistType: shortlistTypeSchema,
      entriesCount: z.number(),
    }),
  }),
};

// ==================== POST /quotes ====================

export const createQuoteSnapshots = {
  body: z.object({
    data: z.object({
      timestamp: datetimeFormatSchema,
      timezone: timezoneSchema.optional(),
      quotes: z.array(quoteSnapshotDataSchema),
    }),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      count: z.number(),
      timestamp: z.string(), // Format: YYYY-MM-DDTHH:mm:ss (UTC)
    }),
  }),
};

// ==================== POST /nifty ====================

export const createNiftyQuote = {
  body: z.object({
    data: z.object({
      timestamp: datetimeFormatSchema,
      timezone: timezoneSchema.optional(),
      quoteData: growwQuoteSchema,
      dayChangePerc: z.number(),
    }),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      id: z.string(),
      timestamp: z.string(), // Format: YYYY-MM-DDTHH:mm:ss (UTC)
      dayChangePerc: z.number(),
    }),
  }),
};

// ==================== GET /check-holiday ====================

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
