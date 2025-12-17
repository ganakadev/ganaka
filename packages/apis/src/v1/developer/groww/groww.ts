import { v1_developer_groww_schemas } from "@ganaka/schemas";
import axios from "axios";
import z from "zod";
import { API_DOMAIN } from "../../../utils/constants";

// ==================== GET /historical/candles ====================

export const getHistoricalCandles =
  (developerKey: string) =>
  async ({
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
    >(`${API_DOMAIN}/v1/developer/groww/historical-candles`, {
      params,
      headers: {
        Authorization: `Bearer ${developerKey}`,
      },
    });
  };

// ==================== GET /quote ====================

export const getGrowwQuote =
  (developerKey: string) => async (symbol: string) => {
    const params: z.infer<
      typeof v1_developer_groww_schemas.getGrowwQuote.query
    > = {
      symbol: encodeURIComponent(symbol),
    };

    return axios.get<
      z.infer<typeof v1_developer_groww_schemas.getGrowwQuote.response>
    >(`${API_DOMAIN}/v1/developer/groww/quote`, {
      params,
      headers: {
        Authorization: `Bearer ${developerKey}`,
      },
    });
  };
