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
    currentTimestamp: Date;
    currentTimezone?: string;
  }) =>
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
      const dateStr = dayjs.tz(date, currentTimezone).format("YYYY-MM-DD");

      const validatedParams = v1_developer_groww_schemas.getGrowwQuoteTimeline.query.parse({
        symbol,
        date: dateStr,
      });

      const headers: Record<string, string> = {
        Authorization: `Bearer ${developerToken}`,
      };

      if (runId) {
        headers["X-Run-Id"] = runId;
      }
      if (currentTimestamp) {
        // Format timestamp in the specified timezone (YYYY-MM-DDTHH:mm:ss format)
        const timestampStr = dayjs
          .tz(currentTimestamp, currentTimezone)
          .format("YYYY-MM-DDTHH:mm:ss");
        headers["X-Current-Timestamp"] = timestampStr;
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
