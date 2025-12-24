import { v1_developer_lists_schemas } from "@ganaka/schemas";
import axios from "axios";
import z from "zod";
import { logger } from "../utils/logger";

export const fetchShortlist =
  ({
    developerToken,
    apiDomain,
  }: {
    developerToken: string;
    apiDomain: string;
  }) =>
  async (
    type: z.infer<typeof v1_developer_lists_schemas.getLists.query>["type"],
    datetime?: Date
  ): Promise<
    z.infer<typeof v1_developer_lists_schemas.getLists.response>["data"] | null
  > => {
    if (!developerToken) {
      throw new Error(
        "Developer token not found. Please set DEVELOPER_TOKEN environment variable."
      );
    }

    try {
      // Validate input params
      const params: {
        type: z.infer<typeof v1_developer_lists_schemas.getLists.query>["type"];
        datetime?: string;
      } = {
        type,
      };

      // If datetime is provided, convert to ISO string and include in params
      if (datetime) {
        params.datetime = datetime.toISOString();
      }

      const validatedParams =
        v1_developer_lists_schemas.getLists.query.parse(params);

      const response = await axios.get<
        z.infer<typeof v1_developer_lists_schemas.getLists.response>
      >(`${apiDomain}/v1/developer/lists`, {
        params: validatedParams,
        headers: {
          Authorization: `Bearer ${developerToken}`,
        },
      });

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Error fetching shortlist for ${type}: ${error.message}`);
        throw new Error(
          `Failed to fetch shortlist: ${
            error.response?.data?.message || error.message
          }`
        );
      }
      logger.error(`Unexpected error fetching shortlist: ${error}`);
      throw error;
    }
  };
