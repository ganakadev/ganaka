import { shortlistTypeEnum } from "@ganaka/db";
import { z } from "zod";
import {
  apiResponseSchema,
  datetimeFormatSchema,
  shortlistEntrySchema,
  timezoneSchema,
} from "../../common";

// ==================== GET /shortlists ====================

const buyerControlMethodSchema = z.enum([
  "simple",
  "total",
  "price-weighted",
  "near-price",
  "volume-weighted",
  "bid-ask",
  "hybrid",
]);

export const getShortlists = {
  query: z.object({
    datetime: datetimeFormatSchema,
    timezone: timezoneSchema.optional(),
    type: z.enum(shortlistTypeEnum),
    method: buyerControlMethodSchema.optional(),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      shortlist: z
        .object({
          id: z.string(),
          timestamp: z.string(),
          shortlistType: z.enum(shortlistTypeEnum),
          entries: z.array(shortlistEntrySchema),
        })
        .nullable(),
    }),
  }),
};
