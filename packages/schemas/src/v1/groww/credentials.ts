import { z } from "zod";
import { apiResponseSchema } from "../../../common";

// ==================== GET /groww/credentials ====================

export const getGrowwCredentials = {
  response: apiResponseSchema.extend({
    data: z.object({
      hasGrowwApiKey: z.boolean(),
      hasGrowwApiSecret: z.boolean(),
      growwApiKeyMasked: z.string().nullable(),
    }),
  }),
};

// ==================== PUT /groww/credentials ====================

export const updateGrowwCredentials = {
  body: z.object({
    growwApiKey: z.string().min(1, "Groww API key is required"),
    growwApiSecret: z.string().min(1, "Groww API secret is required"),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      success: z.boolean(),
    }),
  }),
};

// ==================== DELETE /groww/credentials ====================

export const deleteGrowwCredentials = {
  response: apiResponseSchema.extend({
    data: z.object({
      success: z.boolean(),
    }),
  }),
};
