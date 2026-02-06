import { v1_candles_schemas } from "@ganaka/schemas";
import axios from "axios";
import z from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { logger } from "../utils/logger";
import { growwRateLimiter } from "../utils/rateLimiterRegistry";

dayjs.extend(utc);
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
    currentTimestamp: string;
    currentTimezone?: string;
  }) =>
  async (
    params: z.infer<typeof v1_candles_schemas.getDeveloperCandles.query>
  ): Promise<z.infer<typeof v1_candles_schemas.getDeveloperCandles.response>["data"]> => {
    if (!developerToken) {
      throw new Error(
        "Developer token not found. Please set DEVELOPER_TOKEN or GANAKA_TOKEN environment variable."
      );
    }

    try {
      // Validate input params
      const validatedParams = v1_candles_schemas.getDeveloperCandles.query.parse(params);

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

      const response = await growwRateLimiter.execute(() =>
        axios.get<z.infer<typeof v1_candles_schemas.getDeveloperCandles.response>>(
          `${apiDomain}/v1/candles`,
          {
            params: validatedParams,
            headers,
          }
        )
      );

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
