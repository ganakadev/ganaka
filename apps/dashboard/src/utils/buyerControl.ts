/**
 * Buyer Control Percentage Calculation Utilities
 *
 * Multiple methods to calculate buyer control percentage from order book data
 * for day trading decision making.
 */

import { z } from "zod";

// Type definitions matching Groww API structure
export interface QuotePayload {
  average_price: number | null;
  bid_quantity: number | null;
  bid_price: number | null;
  day_change: number;
  day_change_perc: number;
  upper_circuit_limit: number;
  lower_circuit_limit: number;
  ohlc: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
  depth: {
    buy: { price: number; quantity: number }[];
    sell: { price: number; quantity: number }[];
  };
  last_trade_quantity: number;
  last_trade_time: number;
  last_price: number;
  total_buy_quantity: number;
  total_sell_quantity: number;
  volume: number;
  week_52_high: number;
  week_52_low: number;
}

export interface QuoteData {
  status: "SUCCESS" | "FAILURE";
  payload: QuotePayload;
}

export type BuyerControlMethod =
  | "simple"
  | "total"
  | "price-weighted"
  | "near-price"
  | "volume-weighted"
  | "bid-ask"
  | "hybrid";

export const BUYER_CONTROL_METHODS: BuyerControlMethod[] = [
  "simple",
  "total",
  "price-weighted",
  "near-price",
  "volume-weighted",
  "bid-ask",
  "hybrid",
];

/**
 * Zod schema for order book depth entry
 */
const depthEntrySchema = z.object({
  price: z.number(),
  quantity: z.number(),
});

/**
 * Zod schema for OHLC data
 */
const ohlcSchema = z.object({
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
});

/**
 * Zod schema for order book depth
 */
const depthSchema = z.object({
  buy: z.array(depthEntrySchema),
  sell: z.array(depthEntrySchema),
});

/**
 * Zod schema for QuotePayload matching Groww API structure
 */
const quotePayloadSchema = z.object({
  average_price: z.number().nullable(),
  bid_quantity: z.number().nullable(),
  bid_price: z.number().nullable(),
  day_change: z.number(),
  day_change_perc: z.number(),
  upper_circuit_limit: z.number(),
  lower_circuit_limit: z.number(),
  ohlc: ohlcSchema,
  depth: depthSchema,
  last_trade_quantity: z.number(),
  last_trade_time: z.number(),
  last_price: z.number(),
  total_buy_quantity: z.number(),
  total_sell_quantity: z.number(),
  volume: z.number(),
  week_52_high: z.number(),
  week_52_low: z.number(),
});

/**
 * Zod schema for QuoteData matching Groww API structure
 */
const quoteDataSchema = z.object({
  status: z.enum(["SUCCESS", "FAILURE"]),
  payload: quotePayloadSchema,
});

/**
 * Simple Quantity Ratio (Current Collector Method)
 *
 * Calculates buyer control as the ratio of total buy depth to total depth.
 * Simple and fast, but doesn't consider price proximity or order size distribution.
 *
 * Formula: (totalDepthBuy / (totalDepthBuy + totalDepthSell)) * 100
 */
function calculateSimpleQuantityRatio(quoteData: QuoteData): number | null {
  if (quoteData.status !== "SUCCESS" || !quoteData.payload.depth) {
    return null;
  }

  const totalDepthBuy = quoteData.payload.depth.buy.reduce(
    (acc, curr) => acc + curr.quantity,
    0
  );
  const totalDepthSell = quoteData.payload.depth.sell.reduce(
    (acc, curr) => acc + curr.quantity,
    0
  );

  const total = totalDepthBuy + totalDepthSell;
  if (total === 0) {
    return null;
  }

  return (totalDepthBuy / total) * 100;
}

/**
 * Total Quantity Method
 *
 * Uses pre-calculated total_buy_quantity and total_sell_quantity from API.
 * Uses aggregate data which may include more comprehensive order data,
 * but doesn't weight by price proximity.
 *
 * Formula: (total_buy_quantity / (total_buy_quantity + total_sell_quantity)) * 100
 */
function calculateTotalQuantityMethod(quoteData: QuoteData): number | null {
  if (quoteData.status !== "SUCCESS") {
    return null;
  }

  const { total_buy_quantity, total_sell_quantity } = quoteData.payload;
  const total = total_buy_quantity + total_sell_quantity;

  if (total === 0) {
    return null;
  }

  return (total_buy_quantity / total) * 100;
}

/**
 * Price-Weighted Depth (Recommended for Day Trading)
 *
 * Weights orders by proximity to current price using exponential decay.
 * Closer orders have higher weight, making this more relevant for immediate price action.
 *
 * Formula: (weightedBuy / (weightedBuy + weightedSell)) * 100
 * Weight: e^(-distance * decay_factor)
 */
function calculatePriceWeightedDepth(quoteData: QuoteData): number | null {
  if (quoteData.status !== "SUCCESS" || !quoteData.payload.depth) {
    return null;
  }

  const currentPrice = quoteData.payload.last_price;
  if (!currentPrice || currentPrice <= 0) {
    return null;
  }

  const decayFactor = 10; // Tuning parameter: higher = more weight to closer orders

  let weightedBuy = 0;
  let weightedSell = 0;

  // Calculate weighted buy orders
  for (const order of quoteData.payload.depth.buy) {
    const distance = Math.abs(order.price - currentPrice) / currentPrice;
    const weight = Math.exp(-distance * decayFactor);
    weightedBuy += order.quantity * weight;
  }

  // Calculate weighted sell orders
  for (const order of quoteData.payload.depth.sell) {
    const distance = Math.abs(order.price - currentPrice) / currentPrice;
    const weight = Math.exp(-distance * decayFactor);
    weightedSell += order.quantity * weight;
  }

  const total = weightedBuy + weightedSell;
  if (total === 0) {
    return null;
  }

  return (weightedBuy / total) * 100;
}

/**
 * Near-Price Concentration
 *
 * Focuses on orders within a percentage range of current price (default ±0.5%).
 * Only counts orders close to market price, capturing immediate market sentiment.
 *
 * Formula: (nearBuy / (nearBuy + nearSell)) * 100
 */
function calculateNearPriceConcentration(quoteData: QuoteData): number | null {
  if (quoteData.status !== "SUCCESS" || !quoteData.payload.depth) {
    return null;
  }

  const currentPrice = quoteData.payload.last_price;
  if (!currentPrice || currentPrice <= 0) {
    return null;
  }

  const priceRange = 0.005; // ±0.5% of current price
  const minPrice = currentPrice * (1 - priceRange);
  const maxPrice = currentPrice * (1 + priceRange);

  let nearBuy = 0;
  let nearSell = 0;

  // Count buy orders within price range
  for (const order of quoteData.payload.depth.buy) {
    if (order.price >= minPrice && order.price <= maxPrice) {
      nearBuy += order.quantity;
    }
  }

  // Count sell orders within price range
  for (const order of quoteData.payload.depth.sell) {
    if (order.price >= minPrice && order.price <= maxPrice) {
      nearSell += order.quantity;
    }
  }

  const total = nearBuy + nearSell;
  if (total === 0) {
    return null;
  }

  return (nearBuy / total) * 100;
}

/**
 * Volume-Weighted Imbalance
 *
 * Combines quantity with price levels, weighting by both quantity and price distance.
 * Balances quantity and price relevance.
 *
 * Formula: (weightedBuyVolume / (weightedBuyVolume + weightedSellVolume)) * 100
 */
function calculateVolumeWeightedImbalance(quoteData: QuoteData): number | null {
  if (quoteData.status !== "SUCCESS" || !quoteData.payload.depth) {
    return null;
  }

  const currentPrice = quoteData.payload.last_price;
  if (!currentPrice || currentPrice <= 0) {
    return null;
  }

  let weightedBuyVolume = 0;
  let weightedSellVolume = 0;

  // Calculate weighted buy volume
  for (const order of quoteData.payload.depth.buy) {
    const priceRatio = order.price / currentPrice;
    const weight = Math.max(0, 1 - Math.abs(priceRatio - 1)); // Higher weight for prices closer to current
    weightedBuyVolume += order.quantity * weight;
  }

  // Calculate weighted sell volume
  for (const order of quoteData.payload.depth.sell) {
    const priceRatio = order.price / currentPrice;
    const weight = Math.max(0, 1 - Math.abs(priceRatio - 1)); // Higher weight for prices closer to current
    weightedSellVolume += order.quantity * weight;
  }

  const total = weightedBuyVolume + weightedSellVolume;
  if (total === 0) {
    return null;
  }

  return (weightedBuyVolume / total) * 100;
}

/**
 * Bid-Ask Spread Analysis
 *
 * Uses best bid/ask prices and quantities from top of order book.
 * Very fast and captures immediate liquidity, but only uses top of book.
 *
 * Formula: (bid_quantity / (bid_quantity + ask_quantity)) * 100
 */
function calculateBidAskSpread(quoteData: QuoteData): number | null {
  if (quoteData.status !== "SUCCESS") {
    return null;
  }

  const bidQuantity = quoteData.payload.bid_quantity || 0;
  const firstSellOrder = quoteData.payload.depth?.sell?.[0];
  const askQuantity = firstSellOrder?.quantity || 0;

  const total = bidQuantity + askQuantity;
  if (total === 0) {
    return null;
  }

  return (bidQuantity / total) * 100;
}

/**
 * Hybrid Method (Best for Day Trading)
 *
 * Combines multiple factors for comprehensive analysis:
 * - 40% Price-weighted depth (near-term pressure)
 * - 30% Total quantity ratio (overall sentiment)
 * - 20% Near-price concentration (immediate action)
 * - 10% Bid-ask spread (liquidity)
 *
 * Most comprehensive approach, balancing multiple signals.
 */
function calculateHybridMethod(quoteData: QuoteData): number | null {
  const priceWeighted = calculatePriceWeightedDepth(quoteData);
  const totalQuantity = calculateTotalQuantityMethod(quoteData);
  const nearPrice = calculateNearPriceConcentration(quoteData);
  const bidAsk = calculateBidAskSpread(quoteData);

  // If any critical method fails, return null
  if (priceWeighted === null || totalQuantity === null) {
    return null;
  }

  let weightedSum = 0;
  let totalWeight = 0;

  // 40% Price-weighted depth
  if (priceWeighted !== null) {
    weightedSum += priceWeighted * 0.4;
    totalWeight += 0.4;
  }

  // 30% Total quantity ratio
  if (totalQuantity !== null) {
    weightedSum += totalQuantity * 0.3;
    totalWeight += 0.3;
  }

  // 20% Near-price concentration
  if (nearPrice !== null) {
    weightedSum += nearPrice * 0.2;
    totalWeight += 0.2;
  }

  // 10% Bid-ask spread
  if (bidAsk !== null) {
    weightedSum += bidAsk * 0.1;
    totalWeight += 0.1;
  }

  if (totalWeight === 0) {
    return null;
  }

  return weightedSum / totalWeight;
}

/**
 * Main function to calculate buyer control percentage using specified method
 *
 * @param quoteData - The quote data from Groww API
 * @param method - The calculation method to use
 * @returns Buyer control percentage (0-100) or null if calculation fails
 */
export function calculateBuyerControlPercentage(
  quoteData: QuoteData | null | undefined,
  method: BuyerControlMethod = "hybrid"
): number | null {
  if (!quoteData) {
    return null;
  }

  switch (method) {
    case "simple":
      return calculateSimpleQuantityRatio(quoteData);
    case "total":
      return calculateTotalQuantityMethod(quoteData);
    case "price-weighted":
      return calculatePriceWeightedDepth(quoteData);
    case "near-price":
      return calculateNearPriceConcentration(quoteData);
    case "volume-weighted":
      return calculateVolumeWeightedImbalance(quoteData);
    case "bid-ask":
      return calculateBidAskSpread(quoteData);
    case "hybrid":
      return calculateHybridMethod(quoteData);
    default:
      return null;
  }
}

/**
 * Zod schema for BuyerControlMethod
 */
const buyerControlMethodSchema = z.enum([
  "simple",
  "total",
  "price-weighted",
  "near-price",
  "volume-weighted",
  "bid-ask",
  "hybrid",
]);

/**
 * Validates if a method string is a valid BuyerControlMethod
 * Uses Zod for validation
 */
export function isValidBuyerControlMethod(
  method: string | null
): method is BuyerControlMethod {
  if (method === null) {
    return false;
  }
  return buyerControlMethodSchema.safeParse(method).success;
}

/**
 * Type guard to check if data matches QuoteData structure
 * Used to safely cast Prisma.JsonValue to QuoteData
 * Uses Zod for validation
 */
export function isQuoteData(data: unknown): data is QuoteData {
  return quoteDataSchema.safeParse(data).success;
}
