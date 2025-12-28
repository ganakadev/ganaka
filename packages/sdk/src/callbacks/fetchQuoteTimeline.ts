import { v1_developer_groww_schemas } from "@ganaka/schemas";
import axios from "axios";
import z from "zod";
import { logger } from "../utils/logger";

export const fetchQuoteTimeline =
  ({ developerToken, apiDomain }: { developerToken: string; apiDomain: string }) =>
  async (
    symbol: string,
    date: Date
  ): Promise<
    z.infer<
      typeof v1_developer_groww_schemas.getGrowwQuoteTimeline.response
    >["data"]["quoteTimeline"]
  > => {
    if (!developerToken) {
      throw new Error("Developer token not found. Please set DEVELOPER_KEY environment variable.");
    }

    try {
      // Format date as YYYY-MM-DD
      const dateStr = date.toISOString().split("T")[0];

      const validatedParams = v1_developer_groww_schemas.getGrowwQuoteTimeline.query.parse({
        symbol,
        date: dateStr,
      });

      const response = await axios.get<
        z.infer<typeof v1_developer_groww_schemas.getGrowwQuoteTimeline.response>
      >(`${apiDomain}/v1/developer/groww/quote-timeline`, {
        params: validatedParams,
        headers: {
          Authorization: `Bearer ${developerToken}`,
        },
      });

      return response.data.data.quoteTimeline;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Error fetching quote timeline for ${symbol}: ${error.message}`);
        throw new Error(
          `Failed to fetch quote timeline: ${error.response?.data?.message || error.message}`
        );
      }
      logger.error(`Unexpected error fetching quote timeline: ${error}`);
      throw error;
    }
  };
