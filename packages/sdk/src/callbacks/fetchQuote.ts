import { v1_developer_quote_schemas } from "@ganaka/schemas";
import axios from "axios";
import z from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { logger } from "../utils/logger";

dayjs.extend(utc);
dayjs.extend(timezone);

export const fetchQuote =
  ({
    developerToken,
    apiDomain,
    runId,
    currentTimestamp,
    currentTimezone = "Asia/Kolkata",
  }: {
    developerToken: string;
    apiDomain: string;
    runId: string | null;
    currentTimestamp: string;
    currentTimezone?: string;
  }) =>
  async (
    params: z.infer<typeof v1_developer_quote_schemas.getGrowwQuote.query>
  ): Promise<z.infer<typeof v1_developer_quote_schemas.getGrowwQuote.response>["data"] | null> => {
    if (!developerToken) {
      throw new Error(
        "Developer token not found. Please set DEVELOPER_TOKEN environment variable."
      );
    }

    try {
      // Validate input params
      const validatedParams = v1_developer_quote_schemas.getGrowwQuote.query.parse(params);

      const headers: Record<string, string> = {
        Authorization: `Bearer ${developerToken}`,
      };

      if (runId) {
        headers["X-Run-Id"] = runId;
      }
      if (currentTimestamp) {
        headers["X-Current-Timestamp"] = currentTimestamp;
      }
      if (currentTimezone) {
        headers["X-Current-Timezone"] = currentTimezone;
      }

      const response = await axios.get<
        z.infer<typeof v1_developer_quote_schemas.getGrowwQuote.response>
      >(`${apiDomain}/v1/developer/quote`, {
        params: validatedParams,
        headers,
      });

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Error fetching quote for ${params.symbol}: ${error.message}`);
        throw new Error(`Failed to fetch quote: ${error.response?.data?.message || error.message}`);
      }
      logger.error(`Unexpected error fetching quote: ${error}`);
      throw error;
    }
  };
