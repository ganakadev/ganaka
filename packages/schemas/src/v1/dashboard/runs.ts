import { z } from "zod";
import { apiResponseSchema } from "../../common";

// ==================== GET /runs ====================

const runSchema = z.object({
  id: z.string().uuid(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  completed: z.boolean(),
  orderCount: z.number(),
});

const groupedRunsSchema = z.record(
  z.string(), // date string (YYYY-MM-DD)
  z.array(runSchema)
);

export const getRuns = {
  response: apiResponseSchema.extend({
    data: groupedRunsSchema,
  }),
};

