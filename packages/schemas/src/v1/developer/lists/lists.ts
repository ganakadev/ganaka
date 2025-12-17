import { z } from "zod";
import { apiResponseSchema } from "../../../common";

// ==================== Schemas ====================

export const listSchema = z.object({
  name: z.string(),
  price: z.number(),
  nseSymbol: z.string(),
});

// ==================== GET /lists ====================

export const getLists = {
  query: z.object({
    type: z.enum(["top-gainers", "volume-shockers"]),
  }),
  response: apiResponseSchema.extend({
    data: z.array(listSchema),
  }),
};
