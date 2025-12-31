import { z } from "zod";
import {
  apiResponseSchema,
  datetimeFormatSchema,
  growwQuoteSchema,
  timezoneSchema,
} from "../../../common";
import { ShortlistType } from "@ganaka/db";

// ==================== Schemas ====================

export const shortlistEntrySchema = z.object({
  nseSymbol: z.string(),
  name: z.string(),
  price: z.number(),
  quoteData: growwQuoteSchema.nullable().optional(),
});

export const shortlistTypeSchema = z.enum<ShortlistType[]>(["TOP_GAINERS", "VOLUME_SHOCKERS"]);

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
    }),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      id: z.string(),
      timestamp: z.string(),
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
      timestamp: z.string(),
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
      timestamp: z.string(),
      dayChangePerc: z.number(),
    }),
  }),
};
