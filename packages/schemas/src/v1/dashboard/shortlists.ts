import { shortlistTypeEnum } from "@ganaka/db";
import { z } from "zod";
import {
  apiResponseSchema,
  datetimeFormatSchema,
  shortlistEntrySchema,
  timezoneSchema,
} from "../../common";

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

// ==================== GET /shortlists ====================

export const getShortlists = {
  query: z.object({
    datetime: datetimeFormatSchema,
    timezone: timezoneSchema.optional(),
    type: z.enum(shortlistTypeEnum),
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
