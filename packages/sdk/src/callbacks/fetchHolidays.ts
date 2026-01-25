import { v1_developer_holidays_schemas } from "@ganaka/schemas";
import axios from "axios";
import z from "zod";
import { logger } from "../utils/logger";

export const fetchHolidays =
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
  async (): Promise<
    z.infer<typeof v1_developer_holidays_schemas.getHolidays.response>["data"]
  > => {
    if (!developerToken) {
      throw new Error(
        "Developer token not found. Please set DEVELOPER_TOKEN environment variable."
      );
    }

    try {
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
        z.infer<typeof v1_developer_holidays_schemas.getHolidays.response>
      >(`${apiDomain}/v1/developer/holidays`, {
        headers,
      });

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Error fetching holidays: ${error.message}`);
        throw new Error(
          `Failed to fetch holidays: ${error.response?.data?.message || error.message}`
        );
      }
      logger.error(`Unexpected error fetching holidays: ${error}`);
      throw error;
    }
  };
