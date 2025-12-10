import { growwApiRequest } from "../utils/api";

export interface GrowwQuote {
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
      buy: {
        price: number;
        quantity: number;
      }[];
      sell: {
        price: number;
        quantity: number;
      }[];
    };
    high_trade_range: null;
    implied_volatility: null;
    last_trade_quantity: number;
    last_trade_time: number;
    low_trade_range: null;
    last_price: number;
    market_cap: null;
    offer_price: null;
    offer_quantity: null;
    oi_day_change: number;
    oi_day_change_percentage: number;
    open_interest: number | null;
    previous_open_interest: null;
    total_buy_quantity: number;
    total_sell_quantity: number;
    volume: number;
    week_52_high: number;
    week_52_low: number;
  };
}

export const getGrowwQuote = async (symbol: string) => {
  return growwApiRequest<GrowwQuote>({
    method: "get",
    url: `https://api.groww.in/v1/live-data/quote?exchange=NSE&segment=CASH&trading_symbol=${encodeURIComponent(
      symbol
    )}`,
  });
};
