import { ScoredQuote, ScoreBreakdown, VolumeTrend } from "../types";
import { MIN_VOLUME, CIRCUIT_BUFFER_PERCENTAGE } from "../config";

export function calculateScore(
  quote: Omit<ScoredQuote, "score" | "scoreBreakdown" | "rejectionReason">,
  buyerControlOfStockPercentage: number,
  takeProfitPrice: number,
  rsi?: number | null,
  vwap?: number | null,
  vwapCrossover?: { crossedAbove: boolean; candlesSinceCross: number },
  volumeTrend?: VolumeTrend | null
): { score: number; breakdown: ScoreBreakdown; rejectionReason?: string } {
  const payload = quote.payload;
  const breakdown: ScoreBreakdown = {
    volumeScore: 0,
    pricePositionScore: 0,
    orderBookImbalanceScore: 0,
    buyerControlScore: 0,
    circuitLimitScore: 0,
    rsiScore: 0,
    vwapScore: 0,
  };

  // Volume Score (0-25 points)
  if (payload.volume < MIN_VOLUME) {
    return {
      score: 0,
      breakdown,
      rejectionReason: `Low volume: ${payload.volume} < ${MIN_VOLUME}`,
    };
  }
  // Scale volume score: 100k = 10 points, 500k = 20 points, 1M+ = 25 points
  let baseVolumeScore = Math.min(
    25,
    Math.max(10, (payload.volume / 40000) * 1)
  );

  // Apply volume trend penalty/bonus
  if (volumeTrend) {
    if (!volumeTrend.isIncreasing) {
      // Reduce score if volume is decreasing (penalty of up to 10 points)
      const volumeDeclinePercent =
        ((volumeTrend.earlierAvg - volumeTrend.recentAvg) /
          volumeTrend.earlierAvg) *
        100;
      const penalty = Math.min(10, volumeDeclinePercent * 0.5); // Max 10 point penalty
      baseVolumeScore = Math.max(0, baseVolumeScore - penalty);
    }
    // If volume is increasing, keep the base score (no bonus to avoid over-scoring)
  }

  breakdown.volumeScore = baseVolumeScore;

  // Price Position Score (0-20 points)
  // Calculate: (last_price - ohlc.low) / (ohlc.high - ohlc.low) * 100
  const priceRange = payload.ohlc.high - payload.ohlc.low;
  if (priceRange > 0) {
    const pricePositionPercent =
      ((payload.last_price - payload.ohlc.low) / priceRange) * 100;
    // Stocks near day's high (>80% of range) score higher
    if (pricePositionPercent >= 80) {
      breakdown.pricePositionScore = 20;
    } else if (pricePositionPercent >= 60) {
      breakdown.pricePositionScore = 15;
    } else if (pricePositionPercent >= 40) {
      breakdown.pricePositionScore = 10;
    } else {
      breakdown.pricePositionScore = 5;
    }
  } else {
    breakdown.pricePositionScore = 10; // Neutral if no range
  }

  // Order Book Imbalance Score (0-25 points)
  // Use total_buy_quantity vs total_sell_quantity (more reliable than depth)
  const totalQuantity =
    payload.total_buy_quantity + payload.total_sell_quantity;
  if (totalQuantity > 0) {
    const buyImbalancePercent =
      (payload.total_buy_quantity / totalQuantity) * 100;
    // Scale: 50% = 12.5 points, 60% = 15 points, 70% = 17.5 points, 80%+ = 25 points
    breakdown.orderBookImbalanceScore = Math.min(
      25,
      Math.max(0, (buyImbalancePercent - 50) * 0.5 + 12.5)
    );
  }

  // Buyer Control Score (0-20 points)
  // Scale from 0-20 based on percentage
  breakdown.buyerControlScore = Math.min(
    20,
    buyerControlOfStockPercentage * 0.2
  );

  // Circuit Limit Check (0-10 points)
  // Ensure takeProfitPrice < upper_circuit_limit * (1 - buffer)
  const maxAllowedPrice =
    payload.upper_circuit_limit * (1 - CIRCUIT_BUFFER_PERCENTAGE);
  if (takeProfitPrice >= maxAllowedPrice) {
    return {
      score: 0,
      breakdown,
      rejectionReason: `No room for 2% gain: takeProfit ${takeProfitPrice.toFixed(
        2
      )} >= circuit limit ${maxAllowedPrice.toFixed(2)}`,
    };
  }
  breakdown.circuitLimitScore = 10;

  // RSI Score (0-15 points)
  if (rsi !== null && rsi !== undefined) {
    if (rsi >= 60 && rsi <= 70) {
      breakdown.rsiScore = 15; // Optimal momentum
    } else if (rsi >= 50 && rsi < 60) {
      breakdown.rsiScore = 12; // Good momentum
    } else if (rsi > 70 && rsi <= 75) {
      breakdown.rsiScore = 8; // Overbought but still acceptable
    } else if (rsi >= 40 && rsi < 50) {
      breakdown.rsiScore = 5; // Weak momentum
    } else if (rsi > 75 && rsi <= 80) {
      breakdown.rsiScore = 3; // Very overbought
    } else {
      breakdown.rsiScore = 0; // Too weak (< 40) or too overbought (> 80)
    }
  }

  // VWAP Score (0-20 points)
  if (vwap !== null && vwap !== undefined) {
    const currentPrice = payload.last_price;
    const priceDiffPercent = ((currentPrice - vwap) / vwap) * 100;

    if (vwapCrossover?.crossedAbove) {
      const candlesSinceCross = vwapCrossover.candlesSinceCross;
      if (candlesSinceCross >= 0 && candlesSinceCross <= 2) {
        breakdown.vwapScore = 20; // Recent crossover (within last 2-3 candles)
      } else if (candlesSinceCross >= 3 && candlesSinceCross <= 4) {
        breakdown.vwapScore = 15; // Crossed 4-5 candles ago
      } else {
        breakdown.vwapScore = 12; // Crossed earlier but still above
      }
    } else if (currentPrice > vwap) {
      breakdown.vwapScore = 12; // Above VWAP but no recent crossover
    } else if (Math.abs(priceDiffPercent) <= 0.5) {
      breakdown.vwapScore = 8; // Near VWAP (±0.5%)
    } else if (priceDiffPercent < 0 && priceDiffPercent >= -1) {
      breakdown.vwapScore = 5; // Below VWAP but close (< 1%)
    } else {
      breakdown.vwapScore = 0; // Significantly below VWAP (> 1%)
    }
  }

  const totalScore =
    breakdown.volumeScore +
    breakdown.pricePositionScore +
    breakdown.orderBookImbalanceScore +
    breakdown.buyerControlScore +
    breakdown.circuitLimitScore +
    breakdown.rsiScore +
    breakdown.vwapScore;

  return { score: totalScore, breakdown };
}
