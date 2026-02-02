import { z } from "zod";
import { apiResponseSchema, datetimeFormatSchema, timezoneSchema } from "../../../common";

// ==================== GET /runs ====================

const runSchema = z.object({
  id: z.uuid(),
  start_datetime: z.string(),
  end_datetime: z.string(),
  completed: z.boolean(),
  orderCount: z.number(),
  name: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
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
  timestamp: z.string(),
  runId: z.uuid(),
  // Gain analysis fields
  targetGainPercentage: z.number().optional(),
  targetAchieved: z.boolean().optional(),
  targetGainPercentageActual: z.number().optional(),
  timeToTargetMinutes: z.number().optional(),
  targetTimestamp: z.string().optional(),
  dynamicTakeProfitPrice: z.coerce.number().optional(),
  // Stop loss analysis fields
  stopLossHit: z.boolean().optional(),
  stopLossTimestamp: z.string().optional(),
  timeToStopLossMinutes: z.number().optional(),
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
  start_datetime: datetimeFormatSchema,
  end_datetime: datetimeFormatSchema,
  timezone: timezoneSchema.optional(),
  name: z.string().optional(),
  tags: z.array(z.string().min(1).max(50)).optional(),
});

const createRunResponseSchema = z.object({
  id: z.uuid(),
  start_datetime: datetimeFormatSchema,
  end_datetime: datetimeFormatSchema,
  completed: z.boolean(),
  name: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
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
  name: z.string().nullable().optional(),
  tags: z.array(z.string().min(1).max(50)).optional(),
});

const updateRunResponseSchema = z.object({
  id: z.uuid(),
  start_datetime: z.string(),
  end_datetime: z.string(),
  completed: z.boolean(),
  name: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
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
      id: z.uuid(),
    }),
  }),
};

// ==================== POST /runs/:runId/orders ====================

const createOrderBodySchema = z.object({
  nseSymbol: z.string(),
  entryPrice: z.coerce.number(),
  stopLossPrice: z.coerce.number(),
  takeProfitPrice: z.coerce.number(),
  datetime: datetimeFormatSchema,
  timezone: timezoneSchema.optional(),
});

const createOrderResponseSchema = z.object({
  id: z.uuid(),
  nseSymbol: z.string(),
  entryPrice: z.coerce.number(),
  stopLossPrice: z.coerce.number(),
  takeProfitPrice: z.coerce.number(),
  datetime: z.string(),
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
