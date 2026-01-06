import { v1_developer_groww_schemas } from "@ganaka/schemas";
import axios from "axios";
import z from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { logger } from "../utils/logger";

dayjs.extend(utc);
dayjs.extend(timezone);

export const fetchNiftyQuote =
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
    params: z.infer<typeof v1_developer_groww_schemas.getGrowwNiftyQuote.query>
  ): Promise<
    z.infer<typeof v1_developer_groww_schemas.getGrowwNiftyQuote.response>["data"] | null
  > => {
    if (!developerToken) {
      throw new Error("Developer token not found. Please set DEVELOPER_KEY environment variable.");
    }

    try {
      // Validate input params
      const validatedParams = v1_developer_groww_schemas.getGrowwNiftyQuote.query.parse(params);

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

      // response
      const response = await axios.get<
        z.infer<typeof v1_developer_groww_schemas.getGrowwNiftyQuote.response>
      >(`${apiDomain}/v1/developer/groww/nifty`, {
        params: validatedParams,
        headers,
      });

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Error fetching NIFTY quote: ${error.message}`);
        throw new Error(
          `Failed to fetch NIFTY quote: ${error.response?.data?.message || error.message}`
        );
      }
      logger.error(`Unexpected error fetching NIFTY quote: ${error}`);
      throw error;
    }
  };
