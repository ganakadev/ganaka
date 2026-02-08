import { shortlistTypeEnum } from "@ganaka/db";
import { z } from "zod";
import {
  apiResponseSchema,
  datetimeFormatSchema,
  timezoneSchema,
  shortlistScopeSchema,
  growwQuoteSchema,
  shortlistSchema,
} from "../../common";

// ==================== Schemas ====================

export const shortlistTypeSchema = z.enum<typeof shortlistTypeEnum>(shortlistTypeEnum);

// ==================== GET /lists ====================
// Get shortlist snapshot (stored or scrap)

export const getShortlists = {
  query: z.object({
    type: shortlistTypeSchema,
    datetime: datetimeFormatSchema,
    timezone: timezoneSchema.optional(),
    scope: shortlistScopeSchema.optional(),
  }),
  response: apiResponseSchema.extend({
    data: z.array(shortlistSchema).nullable(),
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

export const getShortlistsScrap = {
  query: z.object({
    type: shortlistTypeSchema,
  }),
  response: apiResponseSchema.extend({
    data: z.array(shortlistSchema).nullable(),
  }),
};

// ==================== GET /lists/persistence ====================

export const getShortlistPersistence = {
  query: z.object({
    type: shortlistTypeSchema,
    start_datetime: datetimeFormatSchema,
    end_datetime: datetimeFormatSchema,
    timezone: timezoneSchema.optional(),
    scope: shortlistScopeSchema.optional(),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      start_datetime: z.string(),
      end_datetime: z.string(),
      type: shortlistTypeSchema,
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
