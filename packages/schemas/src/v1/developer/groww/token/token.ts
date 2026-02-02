import { z } from "zod";
import { apiResponseSchema } from "../../../../common";

// ==================== GET /token ====================

export const getGrowwToken = {
  response: apiResponseSchema.extend({
    data: z.string(),
  }),
};
