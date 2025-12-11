import { Candle, VolumeTrend } from "../types";
import { VWAP_CROSSOVER_LOOKBACK_CANDLES } from "../config";
import { calculateVWAP } from "./vwap";

export function calculateVolumeTrend(candles: Candle[]): VolumeTrend | null {
  if (candles.length < 6) {
    return null; // Need at least 6 candles to compare
  }

  // Get recent 3 candles (last 3)
  const recentCandles = candles.slice(-3);
  const recentVolumes = recentCandles.map((candle) => candle[5]); // volume is at index 5
  const recentAvg =
    recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length;

  // Get earlier 3 candles (before the recent ones)
  const earlierCandles = candles.slice(-6, -3);
  const earlierVolumes = earlierCandles.map((candle) => candle[5]);
  const earlierAvg =
    earlierVolumes.reduce((sum, vol) => sum + vol, 0) / earlierVolumes.length;

  return {
    isIncreasing: recentAvg > earlierAvg,
    recentAvg,
    earlierAvg,
  };
}

export function calculateRSI(
  closePrices: number[],
  period: number
): number | null {
  if (closePrices.length < period + 1) {
    return null;
  }

  const gains: number[] = [];
  const losses: number[] = [];

  // Calculate initial gains and losses
  for (let i = 1; i < closePrices.length; i++) {
    const change = closePrices[i] - closePrices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  // Calculate initial average gain and loss (first period)
  let avgGain =
    gains.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
  let avgLoss =
    losses.slice(0, period).reduce((sum, val) => sum + val, 0) / period;

  // Apply Wilder's smoothing method for remaining periods
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
  }

  if (avgLoss === 0) {
    return 100; // All gains, no losses
  }

  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);
  return rsi;
}

export function detectVWAPCrossover(
  currentPrice: number,
  candles: Candle[],
  vwap: number
): { crossedAbove: boolean; candlesSinceCross: number } {
  if (candles.length < 2) {
    return { crossedAbove: false, candlesSinceCross: -1 };
  }

  // Check if currently above VWAP
  const currentlyAbove = currentPrice > vwap;

  // Calculate VWAP for each recent candle to detect crossover
  const lookbackCandles = Math.min(
    VWAP_CROSSOVER_LOOKBACK_CANDLES,
    candles.length
  );
  const startIndex = Math.max(0, candles.length - lookbackCandles);

  // Check if price crossed above VWAP in recent candles
  for (let i = candles.length - 1; i >= startIndex + 1; i--) {
    const candle = candles[i];
    const prevCandle = candles[i - 1];
    const [, , , , close] = candle;
    const [, , , , prevClose] = prevCandle;

    // Calculate VWAP up to this point (including current candle)
    const candlesUpToThisPoint = candles.slice(0, i + 1);
    const vwapAtThisPoint = calculateVWAP(candlesUpToThisPoint);

    if (vwapAtThisPoint === null) continue;

    // Check if price crossed above VWAP
    if (prevClose <= vwapAtThisPoint && close > vwapAtThisPoint) {
      const candlesSinceCross = candles.length - 1 - i;
      return { crossedAbove: true, candlesSinceCross };
    }
  }

  // If currently above but no recent crossover detected, check if it was already above
  if (currentlyAbove && startIndex > 0) {
    // Check if price was below VWAP earlier
    const earlierCandles = candles.slice(0, startIndex);
    if (earlierCandles.length > 0) {
      const earlierVWAP = calculateVWAP(earlierCandles);
      if (earlierVWAP !== null) {
        const [, , , , earlierClose] =
          earlierCandles[earlierCandles.length - 1];
        if (earlierClose <= earlierVWAP) {
          // Price was below earlier, so it must have crossed
          return { crossedAbove: true, candlesSinceCross: lookbackCandles };
        }
      }
    }
  }

  return { crossedAbove: false, candlesSinceCross: -1 };
}
