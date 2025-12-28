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

// ==================== GET /runs/:runId/orders ====================

const orderSchema = z.object({
  id: z.uuid(),
  nseSymbol: z.string(),
  entryPrice: z.coerce.number(),
  stopLossPrice: z.coerce.number(),
  takeProfitPrice: z.coerce.number(),
  timestamp: z.coerce.date(),
  runId: z.uuid(),
  // Gain analysis fields
  maxGainPercentage: z.number().optional(),
  timeToMaxGainMinutes: z.number().optional(),
  targetGainPercentage: z.number().optional(),
  targetAchieved: z.boolean().optional(),
  targetGainPercentageActual: z.number().optional(),
  timeToTargetMinutes: z.number().optional(),
});

export const getRunOrders = {
  params: z.object({
    runId: z.uuid(),
  }),
  query: z.object({
    targetGainPercentage: z.coerce.number().optional(),
  }),
  response: apiResponseSchema.extend({
    data: z.array(orderSchema),
  }),
};

// ==================== POST /runs ====================

const createRunBodySchema = z.object({
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

const createRunResponseSchema = z.object({
  id: z.string().uuid(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  completed: z.boolean(),
});

export const createRun = {
  body: createRunBodySchema,
  response: apiResponseSchema.extend({
    data: createRunResponseSchema,
  }),
};

// ==================== PATCH /runs/:runId ====================

const updateRunBodySchema = z.object({
  completed: z.boolean().optional(),
});

const updateRunResponseSchema = z.object({
  id: z.uuid(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  completed: z.boolean(),
});

export const updateRun = {
  params: z.object({
    runId: z.uuid(),
  }),
  body: updateRunBodySchema,
  response: apiResponseSchema.extend({
    data: updateRunResponseSchema,
  }),
};

// ==================== DELETE /runs/:runId ====================

export const deleteRun = {
  params: z.object({
    runId: z.uuid(),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      id: z.string().uuid(),
    }),
  }),
};

// ==================== POST /runs/:runId/orders ====================

const createOrderBodySchema = z.object({
  nseSymbol: z.string(),
  entryPrice: z.coerce.number(),
  stopLossPrice: z.coerce.number(),
  takeProfitPrice: z.coerce.number(),
  timestamp: z.coerce.date(),
});

const createOrderResponseSchema = z.object({
  id: z.uuid(),
  nseSymbol: z.string(),
  entryPrice: z.coerce.number(),
  stopLossPrice: z.coerce.number(),
  takeProfitPrice: z.coerce.number(),
  timestamp: z.coerce.date(),
  runId: z.uuid(),
});

export const createOrder = {
  params: z.object({
    runId: z.uuid(),
  }),
  body: createOrderBodySchema,
  response: apiResponseSchema.extend({
    data: createOrderResponseSchema,
  }),
};
