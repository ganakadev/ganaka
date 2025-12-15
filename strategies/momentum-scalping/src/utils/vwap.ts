import { Candle } from "../types";

export function calculateVWAP(candles: Candle[]): number | null {
  if (candles.length === 0) {
    return null;
  }

  let totalPriceVolume = 0;
  let totalVolume = 0;

  for (const candle of candles) {
    const [, open, high, low, close, volume] = candle;
    const typicalPrice = (high + low + close) / 3;
    totalPriceVolume += typicalPrice * volume;
    totalVolume += volume;
  }

  if (totalVolume === 0) {
    return null;
  }

  return totalPriceVolume / totalVolume;
}
