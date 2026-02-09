import { shortlistTypeEnum } from "@ganaka/db";
import { z } from "zod";
import {
  apiResponseSchema,
  datetimeFormatSchema,
  shortlistItemSchema,
  timezoneSchema,
  shortlistScopeSchema,
  growwQuoteSchema,
} from "../../common";

// ==================== Schemas ====================

export const shortlistTypeSchema = z.enum<typeof shortlistTypeEnum>(shortlistTypeEnum);

// ==================== GET /shortlists ====================
// Get shortlist snapshot
export const getShortlists = {
  query: z.object({
    type: shortlistTypeSchema,
    datetime: datetimeFormatSchema,
    timezone: timezoneSchema.optional(),
    scope: shortlistScopeSchema.optional(),
  }),
  response: apiResponseSchema.extend({
    data: z.array(shortlistItemSchema).nullable(),
  }),
};

// ==================== POST /shortlists ====================
// Create shortlist snapshot

export const createShortlistSnapshot = {
  body: z.object({
    data: z.object({
      timestamp: datetimeFormatSchema,
      timezone: timezoneSchema.optional(),
      shortlistType: shortlistTypeSchema,
      entries: z.array(
        z.object({
          nseSymbol: z.string(),
          name: z.string(),
          price: z.number(),
          quoteData: growwQuoteSchema.nullable().optional(),
        })
      ),
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

// ==================== GET /shortlists/scrap ====================
// Scrape live lists from Groww or fetch from snapshot

export const getListsScrap = {
  query: z.object({
    type: z.enum(["TOP_GAINERS", "VOLUME_SHOCKERS"]),
  }),
  response: apiResponseSchema.extend({
    data: z.array(shortlistItemSchema).nullable(),
  }),
};

// ==================== GET /shortlists/persistence ====================

export const getShortlistPersistence = {
  query: z.object({
    type: z.enum(["TOP_GAINERS", "VOLUME_SHOCKERS"]),
    start_datetime: datetimeFormatSchema,
    end_datetime: datetimeFormatSchema,
    timezone: timezoneSchema.optional(),
    scope: shortlistScopeSchema.optional(),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      start_datetime: z.string(),
      end_datetime: z.string(),
      type: z.enum(["TOP_GAINERS", "VOLUME_SHOCKERS"]),
      totalSnapshots: z.number(),
      instruments: z.array(
        z.object({
          nseSymbol: z.string(),
          name: z.string(),
          appearanceCount: z.number(),
          totalSnapshots: z.number(),
          percentage: z.number(),
        })
      ),
    }),
  }),
};
