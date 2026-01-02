import { shortlistTypeEnum } from "@ganaka/db";
import { z } from "zod";
import {
  apiResponseSchema,
  datetimeFormatSchema,
  shortlistEntrySchema,
  timezoneSchema,
} from "../../common";

// ==================== GET /shortlists ====================

export const getShortlists = {
  query: z.object({
    datetime: datetimeFormatSchema,
    timezone: timezoneSchema.optional(),
    type: z.enum(shortlistTypeEnum),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      shortlist: z
        .object({
          id: z.string(),
          timestamp: z.string(), // Format: YYYY-MM-DDTHH:mm:ss (UTC)
          shortlistType: z.enum(shortlistTypeEnum),
          entries: z.array(shortlistEntrySchema),
        })
        .nullable(),
    }),
  }),
};
