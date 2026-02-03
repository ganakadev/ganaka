import { z } from "zod";
import { apiResponseSchema } from "../../common";

// ==================== GET /groww/token ====================

export const getGrowwToken = {
  response: apiResponseSchema.extend({
    data: z.string(),
  }),
};
