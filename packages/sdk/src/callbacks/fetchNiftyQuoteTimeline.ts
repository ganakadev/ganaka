import { v1_developer_groww_schemas } from "@ganaka/schemas";
import axios from "axios";
import z from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { logger } from "../utils/logger";

dayjs.extend(utc);
dayjs.extend(timezone);

export const fetchNiftyQuoteTimeline =
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
    /**
     * End datetime in IST string format (YYYY-MM-DDTHH:mm:ss)
     */
    end_datetime: string,
  ): Promise<
    z.infer<
      typeof v1_developer_groww_schemas.getGrowwNiftyQuoteTimeline.response
    >["data"]["niftyTimeline"]
  > => {
    if (!developerToken) {
      throw new Error("Developer token not found. Please set DEVELOPER_KEY environment variable.");
    }

    try {
      const validatedParams = v1_developer_groww_schemas.getGrowwNiftyQuoteTimeline.query.parse({
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
        z.infer<typeof v1_developer_groww_schemas.getGrowwNiftyQuoteTimeline.response>
      >(`${apiDomain}/v1/developer/groww/nifty-timeline`, {
        params: validatedParams,
        headers,
      });

      return response.data.data.niftyTimeline;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Error fetching NIFTY timeline: ${error.message}`);
        throw new Error(
          `Failed to fetch NIFTY timeline: ${error.response?.data?.message || error.message}`
        );
      }
      logger.error(`Unexpected error fetching NIFTY timeline: ${error}`);
      throw error;
    }
  };