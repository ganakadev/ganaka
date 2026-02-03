import { v1_lists_schemas } from "@ganaka/schemas";
import axios from "axios";
import z from "zod";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { logger } from "../utils/logger";

dayjs.extend(utc);
dayjs.extend(timezone);

export const fetchShortlistPersistence =
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
    queryParams: z.infer<typeof v1_lists_schemas.getShortlistPersistence.query>
  ): Promise<z.infer<typeof v1_lists_schemas.getShortlistPersistence.response>["data"] | null> => {
    if (!developerToken) {
      throw new Error(
        "Developer token not found. Please set DEVELOPER_TOKEN environment variable."
      );
    }

    try {
      const validatedParams = v1_lists_schemas.getShortlistPersistence.query.parse(queryParams);

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
        z.infer<typeof v1_lists_schemas.getShortlistPersistence.response>
      >(`${apiDomain}/v1/lists/persistence`, {
        params: validatedParams,
        headers,
      });

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `Error fetching shortlist persistence for ${queryParams.type}: ${error.message}`
        );
        throw new Error(
          `Failed to fetch shortlist persistence: ${error.response?.data?.message || error.message}`
        );
      }
      logger.error(`Unexpected error fetching shortlist persistence: ${error}`);
      throw error;
    }
  };
