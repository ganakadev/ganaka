import { z } from "zod";
import { apiResponseSchema } from "../../../common";

// ==================== Developer Schema ====================

const developerSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ==================== GET /developers ====================

export const getDevelopers = {
  query: z.object({
    limit: z.coerce.number().int().positive().max(100).optional().default(50),
    offset: z.coerce.number().int().nonnegative().optional().default(0),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      developers: z.array(developerSchema),
      total: z.number(),
    }),
  }),
};

// ==================== GET /developers/:id ====================

export const getDeveloper = {
  params: z.object({
    id: z.uuid(),
  }),
  response: apiResponseSchema.extend({
    data: developerSchema,
  }),
};

// ==================== POST /developers ====================

export const createDeveloper = {
  body: z.object({
    username: z.string().min(1).max(255),
  }),
  response: apiResponseSchema.extend({
    data: developerSchema,
  }),
};

// ==================== PATCH /developers/:id/refresh-key ====================

export const refreshDeveloperKey = {
  params: z.object({
    id: z.uuid(),
  }),
  response: apiResponseSchema.extend({
    data: developerSchema,
  }),
};

// ==================== DELETE /developers/:id ====================

export const deleteDeveloper = {
  params: z.object({
    id: z.uuid(),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      id: z.uuid(),
      deleted: z.boolean(),
    }),
  }),
};
