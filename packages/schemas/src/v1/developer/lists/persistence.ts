import { z } from "zod";
import {
  apiResponseSchema,
  datetimeFormatSchema,
  timezoneSchema,
  shortlistScopeSchema,
} from "../../../common";

// ==================== GET /shortlists/persistence ====================

export const getShortlistPersistence = {
  query: z.object({
    type: z.enum(["top-gainers", "volume-shockers"]),
    start_datetime: datetimeFormatSchema,
    end_datetime: datetimeFormatSchema,
    timezone: timezoneSchema.optional(),
    scope: shortlistScopeSchema.optional(),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      start_datetime: z.string(),
      end_datetime: z.string(),
      type: z.enum(["top-gainers", "volume-shockers"]),
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
