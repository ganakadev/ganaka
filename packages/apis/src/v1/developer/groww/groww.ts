import { v1_developer_groww_schemas } from "@ganaka/schemas";
import axios from "axios";
import z from "zod";

// ==================== GET /historical/candles ====================

export const getHistoricalCandles = async ({
  symbol,
  interval,
  start_time,
  end_time,
}: z.infer<
  typeof v1_developer_groww_schemas.getGrowwHistoricalCandles.query
>) => {
  const params: z.infer<
    typeof v1_developer_groww_schemas.getGrowwHistoricalCandles.query
  > = {
    end_time,
    start_time,
    interval,
    symbol,
  };

  return axios.get<
    z.infer<
      typeof v1_developer_groww_schemas.getGrowwHistoricalCandles.response
    >
  >(`https://api.groww.in/v1/historical/candles`, { params });
};

// ==================== GET /quote ====================

export const getGrowwQuote = async (symbol: string) => {
  const params: z.infer<typeof v1_developer_groww_schemas.getGrowwQuote.query> =
    {
      symbol: encodeURIComponent(symbol),
    };

  return axios.get<
    z.infer<typeof v1_developer_groww_schemas.getGrowwQuote.response>
  >(
    `https://api.groww.in/v1/live-data/quote?exchange=NSE&segment=CASH&trading_symbol=${encodeURIComponent(
      symbol
    )}`,
    {
      params,
    }
  );
};
