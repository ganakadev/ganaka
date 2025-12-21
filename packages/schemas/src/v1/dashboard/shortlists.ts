import { shortlistTypeEnum } from "@ganaka/db";
import { z } from "zod";
import { apiResponseSchema } from "../../common";

// ==================== GET /shortlists ====================

const buyerControlMethodSchema = z.enum([
  "simple",
  "total",
  "price-weighted",
  "near-price",
  "volume-weighted",
  "bid-ask",
  "hybrid",
]);

const quoteDataSchema = z.object({
  status: z.enum(["SUCCESS", "FAILURE"]),
  payload: z.object({
    average_price: z.number().nullable(),
    bid_quantity: z.number().nullable(),
    bid_price: z.number().nullable(),
    day_change: z.number(),
    day_change_perc: z.number(),
    upper_circuit_limit: z.number(),
    lower_circuit_limit: z.number(),
    ohlc: z.object({
      open: z.number(),
      high: z.number(),
      low: z.number(),
      close: z.number(),
    }),
    depth: z.object({
      buy: z.array(
        z.object({
          price: z.number(),
          quantity: z.number(),
        })
      ),
      sell: z.array(
        z.object({
          price: z.number(),
          quantity: z.number(),
        })
      ),
    }),
    high_trade_range: z.null(),
    implied_volatility: z.null(),
    last_trade_quantity: z.number(),
    last_trade_time: z.number(),
    low_trade_range: z.null(),
    last_price: z.number(),
    market_cap: z.null(),
    offer_price: z.null(),
    offer_quantity: z.null(),
    oi_day_change: z.number(),
    oi_day_change_percentage: z.number(),
    open_interest: z.number().nullable(),
    previous_open_interest: z.null(),
    total_buy_quantity: z.number(),
    total_sell_quantity: z.number(),
    volume: z.number(),
    week_52_high: z.number(),
    week_52_low: z.number(),
  }),
});

export const getShortlists = {
  query: z.object({
    date: z.string(),
    type: z.enum(shortlistTypeEnum),
    method: buyerControlMethodSchema.optional(),
  }),
  response: apiResponseSchema.extend({
    data: z.object({
      shortlist: z
        .object({
          id: z.string(),
          timestamp: z.date(),
          shortlistType: z.enum(shortlistTypeEnum),
          entries: z.array(
            z.object({
              nseSymbol: z.string(),
              name: z.string(),
              price: z.number(),
              quoteData: quoteDataSchema,
              buyerControlPercentage: z.number(),
            })
          ),
        })
        .nullable(),
    }),
  }),
};
