import { z } from "zod";
import { apiResponseSchema } from "../../common";

// ==================== GET /available-datetimes ====================

export const getAvailableDatetimes = {
  query: z.object({}),
  response: apiResponseSchema.extend({
    data: z.object({
      dates: z.array(
        z.object({
          date: z.string(), // Format: YYYY-MM-DD
          timestamps: z.array(z.string()), // Format: YYYY-MM-DDTHH:mm:ss (UTC)
        })
      ),
    }),
  }),
};
