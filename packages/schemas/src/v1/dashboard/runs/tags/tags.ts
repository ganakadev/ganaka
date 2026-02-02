import { z } from "zod";
import { apiResponseSchema } from "../../../../common";

// ==================== GET /runs/tags ====================

export const getRunTags = {
  response: apiResponseSchema.extend({
    data: z.array(z.string()),
  }),
};
