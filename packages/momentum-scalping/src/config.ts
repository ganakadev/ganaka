import dotenv from "dotenv";
dotenv.config();

const GROWW_API_KEY = process.env.GROWW_API_KEY;
const GROWW_API_SECRET = process.env.GROWW_API_SECRET;

if (!GROWW_API_KEY || !GROWW_API_SECRET) {
  throw new Error("GROWW_API_KEY and GROWW_API_SECRET are required");
}

// Configuration thresholds
export const MIN_SCORE_THRESHOLD = 80;
export const MIN_VOLUME = 100000;
export const STOP_LOSS_PERCENTAGE = 0.02; // 2%
export const CIRCUIT_BUFFER_PERCENTAGE = 0.02; // 2% buffer
export const RSI_PERIOD = 9;
export const RSI_CANDLE_INTERVAL = "5minute" as const;
export const VWAP_CROSSOVER_LOOKBACK_CANDLES = 3;
export const TOP_STOCKS_LIMIT = 10;

// Market hours (IST)
export const MARKET_OPEN_HOUR = 9;
export const MARKET_OPEN_MINUTE = 15;
export const MARKET_CLOSE_HOUR = 15;
export const MARKET_CLOSE_MINUTE = 30;
export const TRADING_WINDOW_START_MINUTES = 30; // Avoid first 30 minutes (9:15-9:45)
export const TRADING_WINDOW_END_MINUTES = 30; // Avoid last 30 minutes (3:00-3:30)
