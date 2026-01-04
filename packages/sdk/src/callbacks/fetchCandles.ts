import { v1_developer_groww_schemas } from "@ganaka/schemas";
import axios from "axios";
import z from "zod";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { logger } from "../utils/logger";

dayjs.extend(timezone);

export const fetchCandles =
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
    params: z.infer<typeof v1_developer_groww_schemas.getGrowwHistoricalCandles.query>
  ): Promise<
    z.infer<typeof v1_developer_groww_schemas.getGrowwHistoricalCandles.response>["data"]
  > => {
    if (!developerToken) {
      throw new Error(
        "Developer token not found. Please set DEVELOPER_TOKEN or GANAKA_TOKEN environment variable."
      );
    }

    try {
      // Validate input params
      const validatedParams =
        v1_developer_groww_schemas.getGrowwHistoricalCandles.query.parse(params);

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
        z.infer<typeof v1_developer_groww_schemas.getGrowwHistoricalCandles.response>
      >(`${apiDomain}/v1/developer/groww/historical-candles`, {
        params: validatedParams,
        headers,
      });

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Error fetching candles for ${params.symbol}: ${error.message}`);
        throw new Error(
          `Failed to fetch candles: ${error.response?.data?.message || error.message}`
        );
      }
      logger.error(`Unexpected error fetching candles: ${error}`);
      throw error;
    }
  };
