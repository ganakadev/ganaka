export interface ScoredQuote {
  status: "SUCCESS" | "FAILURE";
  payload: {
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
  };
  buyerControlOfStockPercentage: number;
  instrument: string;
  nseSymbol: string;
  score: number;
  scoreBreakdown: {
    volumeScore: number;
    pricePositionScore: number;
    orderBookImbalanceScore: number;
    buyerControlScore: number;
    circuitLimitScore: number;
    rsiScore: number;
    vwapScore: number;
  };
  rsi?: number;
  vwap?: number;
  vwapCrossover?: { crossedAbove: boolean; candlesSinceCross: number };
  volumeTrend?: VolumeTrend | null;
  rejectionReason?: string;
}

export interface ScoreBreakdown {
  volumeScore: number;
  pricePositionScore: number;
  orderBookImbalanceScore: number;
  buyerControlScore: number;
  circuitLimitScore: number;
  rsiScore: number;
  vwapScore: number;
}

export type Candle = [string, number, number, number, number, number, number]; // [timestamp, open, high, low, close, volume, turnover]

export interface VolumeTrend {
  isIncreasing: boolean;
  recentAvg: number;
  earlierAvg: number;
}
