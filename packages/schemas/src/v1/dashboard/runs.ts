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
});

export const getRunOrders = {
  params: z.object({
    runId: z.uuid(),
  }),
  response: apiResponseSchema.extend({
    data: z.array(orderSchema),
  }),
};

