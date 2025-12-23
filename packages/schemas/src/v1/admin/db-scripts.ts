import { z } from "zod";
import { apiResponseSchema } from "../../common";

// ==================== POST /db-scripts ====================

export const dbScriptsSchema = {
  response: apiResponseSchema.extend({
    data: z.object({
      status: z.enum(["completed", "failed"]),
      logs: z.array(z.string()),
      affectedRows: z.record(z.string(), z.number()).optional(),
      error: z.string().optional(),
    }),
  }),
};
