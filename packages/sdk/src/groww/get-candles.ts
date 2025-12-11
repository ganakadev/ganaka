import { growwApiRequest } from "../utils/api";

export interface GrowwCandles {
  status: "SUCCESS" | "FAILURE";
  payload: {
    // [timestamp, open, high, low, close, volume, turnover]
    candles: [string, number, number, number, number, number, number][];
    closing_price: number | null;
    start_time: string;
    end_time: string;
    interval_in_minutes: number;
  };
}

export const getGrowwCandles = async ({
  symbol,
  interval,
  start_time,
  end_time,
}: {
  symbol: string;
  start_time: string;
  end_time: string;
  interval: "5minute" | "15minute" | "30minute" | "1hour" | "4hour";
}) => {
  return growwApiRequest<GrowwCandles>({
    method: "get",
    url: `https://api.groww.in/v1/historical/candles`,
    params: {
      candle_interval: interval,
      start_time: start_time,
      end_time: end_time,
      exchange: "NSE",
      segment: "CASH",
      groww_symbol: encodeURIComponent(`NSE-${symbol}`),
    },
  });
};
