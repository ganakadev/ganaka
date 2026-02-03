import { shortlistTypeEnum } from "@ganaka/db";
import { z } from "zod";
import {
  apiResponseSchema,
  datetimeFormatSchema,
  shortlistEntrySchema,
  timezoneSchema,
  shortlistScopeSchema,
  growwQuoteSchema,
} from "../../common";

// ==================== Schemas ====================

export const shortlistTypeSchema = z.enum<typeof shortlistTypeEnum>(shortlistTypeEnum);

// Extended shortlist entry with trade recommendation fields
export const shortlistEntryWithMetricsSchema = shortlistEntrySchema.extend({
  // Target and stop loss prices
  targetPrice: z.number().optional(),
  stopLossPrice: z.number().optional(),
  // Trade outcome
  targetAchieved: z.boolean().optional(),
  stopLossHit: z.boolean().optional(),
  // Timing information
  timeToTargetMinutes: z.number().optional(),
  timeToStopLossMinutes: z.number().optional(),
  targetTimestamp: z.string().optional(),
  stopLossTimestamp: z.string().optional(),
});

export const listSchema = z.object({
  name: z.string(),
  price: z.number(),
  nseSymbol: z.string(),
});

// ==================== GET /lists ====================
// Get shortlist snapshot (with optional trade metrics)

export const getShortlists = {
  query: z.object({
    datetime: datetimeFormatSchema,
    timezone: timezoneSchema.optional(),
    type: z.enum(shortlistTypeEnum),
    scope: shortlistScopeSchema.optional(),
    takeProfitPercentage: z.coerce.number().min(0).optional().default(2),
    stopLossPercentage: z.coerce.number().min(0).max(100).optional().default(1.5),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      shortlist: z
        .object({
          id: z.string(),
          timestamp: z.string(), // Format: YYYY-MM-DDTHH:mm:ss (UTC)
          shortlistType: z.enum(shortlistTypeEnum),
          entries: z.array(shortlistEntryWithMetricsSchema),
        })
        .nullable(),
    }),
  }),
};

// ==================== GET /lists (developer) ====================
// Get shortlist snapshot (stored or scrap)

export const getLists = {
  query: z.object({
    type: z.enum(["top-gainers", "volume-shockers"]),
    datetime: datetimeFormatSchema.optional(),
    timezone: timezoneSchema.optional(),
    scope: shortlistScopeSchema.optional(),
  }),
  response: apiResponseSchema.extend({
    data: z.array(listSchema).nullable(),
  }),
};

// ==================== POST /lists ====================
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

// ==================== GET /lists/scrap ====================
// Scrape live lists from Groww or fetch from snapshot

export const getListsScrap = {
  query: z.object({
    type: z.enum(["TOP_GAINERS", "VOLUME_SHOCKERS"]),
  }),
  response: apiResponseSchema.extend({
    data: z.array(listSchema).nullable(),
  }),
};

// ==================== GET /lists/persistence ====================

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
