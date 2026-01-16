import { v1_developer_groww_schemas } from "@ganaka/schemas";
import axios from "axios";
import z from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { logger } from "../utils/logger";

dayjs.extend(utc);
dayjs.extend(timezone);

export const fetchQuoteTimeline =
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
    symbol: string,
    /**
     * End datetime in IST string format (YYYY-MM-DDTHH:mm:ss)
     */
    end_datetime: string,
  ): Promise<
    z.infer<
      typeof v1_developer_groww_schemas.getGrowwQuoteTimeline.response
    >["data"]["quoteTimeline"]
  > => {
    if (!developerToken) {
      throw new Error("Developer token not found. Please set DEVELOPER_KEY environment variable.");
    }

    try {
      const validatedParams = v1_developer_groww_schemas.getGrowwQuoteTimeline.query.parse({
        symbol,
        end_datetime,
      });

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
        z.infer<typeof v1_developer_groww_schemas.getGrowwQuoteTimeline.response>
      >(`${apiDomain}/v1/developer/groww/quote-timeline`, {
        params: validatedParams,
        headers,
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
