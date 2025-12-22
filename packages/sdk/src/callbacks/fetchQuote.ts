import { v1_developer_groww_schemas } from "@ganaka/schemas";
import axios from "axios";
import z from "zod";
import { logger } from "../utils/logger";

export const fetchQuote =
  ({
    developerToken,
    apiDomain,
  }: {
    developerToken: string;
    apiDomain: string;
  }) =>
  async (
    symbol: string
  ): Promise<
    z.infer<typeof v1_developer_groww_schemas.getGrowwQuote.response>["data"]
  > => {
    if (!developerToken) {
      throw new Error(
        "Developer token not found. Please set DEVELOPER_TOKEN or GANAKA_TOKEN environment variable."
      );
    }

    try {
      // Validate input params
      const validatedParams =
        v1_developer_groww_schemas.getGrowwQuote.query.parse({
          symbol,
        });

      const response = await axios.get<
        z.infer<typeof v1_developer_groww_schemas.getGrowwQuote.response>
      >(`${apiDomain}/v1/developer/groww/quote`, {
        params: validatedParams,
        headers: {
          Authorization: `Bearer ${developerToken}`,
        },
      });

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Error fetching quote for ${symbol}: ${error.message}`);
        throw new Error(
          `Failed to fetch quote: ${
            error.response?.data?.message || error.message
          }`
        );
      }
      logger.error(`Unexpected error fetching quote: ${error}`);
      throw error;
    }
  };
