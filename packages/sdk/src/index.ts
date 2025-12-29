import {
  v1_developer_groww_schemas,
  v1_developer_lists_schemas,
  v1_dashboard_schemas,
} from "@ganaka/schemas";
import dotenv from "dotenv";
import { z } from "zod";
import { fetchCandles } from "./callbacks/fetchCandles";
import { fetchQuote } from "./callbacks/fetchQuote";
import { fetchQuoteTimeline } from "./callbacks/fetchQuoteTimeline";
import { fetchShortlist } from "./callbacks/fetchShortlist";
import { logger } from "./utils/logger";
import { ApiClient } from "./utils/apiClient";
import { placeOrder, PlaceOrderData } from "./callbacks/placeOrder";
import { runMinuteLoop } from "./utils/minute-loop";
dotenv.config();

export interface RunContext {
  placeOrder: (data: PlaceOrderData) => Promise<void>;
  fetchCandles: (
    params: z.infer<
      typeof v1_developer_groww_schemas.getGrowwHistoricalCandles.query
    >
  ) => Promise<
    z.infer<
      typeof v1_developer_groww_schemas.getGrowwHistoricalCandles.response
    >["data"]
  >;
  fetchQuote: (
    symbol: string,
    datetime?: Date
  ) => Promise<
    | z.infer<typeof v1_developer_groww_schemas.getGrowwQuote.response>["data"]
    | null
  >;
  fetchQuoteTimeline: (
    symbol: string,
    date: Date
  ) => Promise<
    z.infer<
      typeof v1_developer_groww_schemas.getGrowwQuoteTimeline.response
    >["data"]["quoteTimeline"]
  >;
  fetchShortlist: (
    type: z.infer<typeof v1_developer_lists_schemas.getLists.query>["type"],
    datetime?: Date
  ) => Promise<
    z.infer<typeof v1_developer_lists_schemas.getLists.response>["data"] | null
  >;
  currentTimestamp: Date;
}

export async function ganaka<T>({
  fn,
  startTime,
  endTime,
  intervalMinutes = 1,
  deleteRunAfterCompletion = false,
}: {
  fn: (context: RunContext) => Promise<T>;
  startTime: Date;
  endTime: Date;
  intervalMinutes: number;
  /**
   * Delete run after completion.
   * Used to test the function without keeping the run and related data in the database
   * @default false
   */
  deleteRunAfterCompletion?: boolean;
}) {
  // Get developer token and API domain
  const developerToken = process.env.DEVELOPER_KEY;
  const apiDomain = process.env.API_DOMAIN || "https://api.ganaka.live";

  if (!developerToken) {
    throw new Error(
      "No developer token found in environment variables (DEVELOPER_KEY). Please set DEVELOPER_KEY environment variable."
    );
  }

  // Create API client
  const apiClient = new ApiClient({ developerToken, apiDomain });

  // Create a new run via API
  let runId: string | null = null;
  try {
    const createRunResponse = await apiClient.post<
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.createRun.response
      >
    >("/v1/dashboard/runs", {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });

    if (createRunResponse.data) {
      runId = createRunResponse.data.id;
      logger.debug(`Created run: ${runId}`);
    } else {
      throw new Error("Failed to create run: No data in response");
    }
  } catch (error) {
    if (error instanceof Error) {
      // Check if it's an authentication error
      if (error.message.includes("unauthorized") || error.message.includes("Developer not found")) {
        throw new Error(
          `Developer not found or invalid token. Please check your DEVELOPER_KEY environment variable. Original error: ${error.message}`
        );
      }
      throw new Error(`Error creating run: ${error.message}`);
    }
    throw new Error(`Error creating run: ${error}`);
  }

  try {
    await runMinuteLoop({
      startTime,
      endTime,
      intervalMinutes,
      callback: async (currentTimestamp) => {
        await fn({
          placeOrder: placeOrder({ runId, apiClient }),
          fetchCandles: fetchCandles({
            developerToken,
            apiDomain,
          }),
          fetchQuote: fetchQuote({
            developerToken,
            apiDomain,
          }),
          fetchQuoteTimeline: fetchQuoteTimeline({
            developerToken,
            apiDomain,
          }),
          fetchShortlist: fetchShortlist({
            developerToken,
            apiDomain,
          }),
          currentTimestamp,
        });
      },
    });

    // Mark the run as completed
    logger.info(`Marking run as completed: ${runId}`);
    try {
      await apiClient.patch<
        z.infer<
          typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.updateRun.response
        >
      >(`/v1/dashboard/runs/${runId}`, {
        completed: true,
      });
    } catch (error) {
      logger.error(`Failed to mark run as completed: ${error}`);
      // Don't throw - we still want to continue with cleanup if needed
    }
  } catch (error) {
    logger.error("Error running function for the first time");
    throw error;
  } finally {
    if (deleteRunAfterCompletion && runId) {
      logger.info(`Deleting run after completion: ${runId}`);
      try {
        await apiClient.delete<
          z.infer<
            typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.deleteRun.response
          >
        >(`/v1/dashboard/runs/${runId}`);
      } catch (error) {
        logger.error(`Failed to delete run: ${error}`);
        // Don't throw - cleanup failure shouldn't break the flow
      }
    }
  }
}
