import { z } from "zod";
import { apiResponseSchema } from "../../common";

// ==================== POST /auth ====================

const developerSchema = z.object({
  id: z.uuid(),
  username: z.string(),
});

export const signIn = {
  body: z.object({
    developerToken: z.string(),
  }),
  response: apiResponseSchema.extend({
    data: developerSchema,
  }),
};
