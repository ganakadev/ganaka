import { growwQuotePayloadSchema, growwQuoteSchema, v1_dashboard_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dotenv from "dotenv";
import { z } from "zod";
import { fetchCandles } from "./callbacks/fetchCandles";
import { fetchQuote } from "./callbacks/fetchQuote";
import { fetchQuoteTimeline } from "./callbacks/fetchQuoteTimeline";
import { fetchShortlist } from "./callbacks/fetchShortlist";
import { fetchShortlistPersistence } from "./callbacks/fetchShortlistPersistence";
import { fetchNiftyQuote } from "./callbacks/fetchNiftyQuote";
import { placeOrder } from "./callbacks/placeOrder";
import { ApiClient } from "./utils/apiClient";
import { logger } from "./utils/logger";
import { runMinuteLoop } from "./utils/minute-loop";

dotenv.config();
dayjs.extend(utc);
dayjs.extend(timezone);

export { growwQuotePayloadSchema, growwQuoteSchema };

export type FetchQuoteTimelineResponse = Awaited<ReturnType<ReturnType<typeof fetchQuoteTimeline>>>;
export type FetchQuoteResponse = Awaited<ReturnType<ReturnType<typeof fetchQuote>>>;
export type FetchNiftyQuoteResponse = Awaited<ReturnType<ReturnType<typeof fetchNiftyQuote>>>;
export type FetchCandlesResponse = Awaited<ReturnType<ReturnType<typeof fetchCandles>>>;
export type FetchShortlistResponse = Awaited<ReturnType<ReturnType<typeof fetchShortlist>>>;

export interface RunContext {
  placeOrder: ReturnType<typeof placeOrder>;
  fetchCandles: ReturnType<typeof fetchCandles>;
  fetchQuote: ReturnType<typeof fetchQuote>;
  fetchNiftyQuote: ReturnType<typeof fetchNiftyQuote>;
  /**
   * Given a symbol and a end_datetime, returns the quote timeline for the given date
   */
  fetchQuoteTimeline: ReturnType<typeof fetchQuoteTimeline>;
  fetchShortlist: ReturnType<typeof fetchShortlist>;
  /**
   * Given a shortlist type and a start and end datetime,
   * returns the list of instruments that appeared in the shortlist during the time range
   * in descending order of appearance count
   *
   * This helps identify the stocks that have been consistently appearing in the shortlist
   * over a given period of time.
   */
  fetchShortlistPersistence: ReturnType<typeof fetchShortlistPersistence>;
  /**
   * Current timestamp in IST string format (YYYY-MM-DDTHH:mm:ss)
   * for every loop iteration
   */
  currentTimestamp: string;
}

export async function ganaka<T>({
  fn,
  startTime,
  endTime,
  intervalMinutes = 1,
  deleteRunAfterCompletion = false,
  name,
  tags,
}: {
  fn: (context: RunContext) => Promise<T>;
  /** Start time in IST string format (YYYY-MM-DDTHH:mm:ss) */
  startTime: string;
  /** End time in IST string format (YYYY-MM-DDTHH:mm:ss) */
  endTime: string;
  intervalMinutes: number;
  /**
   * Delete run after completion.
   * Used to test the function without keeping the run and related data in the database
   * @default false
   */
  deleteRunAfterCompletion?: boolean;
  /**
   * Optional name for the run
   */
  name?: string;
  /**
   * Optional array of tags to classify and group the run
   */
  tags?: string[];
}) {
  // Get developer token and API domain
  const developerToken = process.env.DEVELOPER_KEY;
  const apiDomain = process.env.API_DOMAIN || "https://api.ganaka.live";

  if (!developerToken) {
    throw new Error(
      "No developer token found in environment variables (DEVELOPER_KEY). Please set DEVELOPER_KEY environment variable."
    );
  }

  // ------------------------------------------------------------------------------------------------

  const apiClient = new ApiClient({ developerToken, apiDomain });
  const startTimeDayJS = dayjs.tz(startTime, "Asia/Kolkata");
  const endTimeDayJS = dayjs.tz(endTime, "Asia/Kolkata");

  if (startTimeDayJS.isAfter(endTimeDayJS)) {
    throw new Error("Start time cannot be after end time");
  }

  // ------------------------------------------------------------------------------------------------

  // Create a new run via API
  let runId: string | null = null;
  const createRunBody: z.infer<
    typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.createRun.body
  > = {
    start_datetime: startTime,
    end_datetime: endTime,
    timezone: "Asia/Kolkata",
    ...(name !== undefined && { name }),
    ...(tags !== undefined && { tags }),
  };
  try {
    const createRunResponse = await apiClient.post<
      z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.createRun.response>
    >("/v1/dashboard/runs", createRunBody);

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

  // ------------------------------------------------------------------------------------------------

  try {
    await runMinuteLoop({
      startTimeDayJS,
      endTimeDayJS,
      intervalMinutes,
      callback: async (currentTimestamp) => {
        await fn({
          placeOrder: placeOrder({ runId, apiClient }),
          fetchCandles: fetchCandles({
            developerToken,
            apiDomain,
            runId,
            currentTimestamp,
            currentTimezone: "Asia/Kolkata",
          }),
          fetchQuote: fetchQuote({
            developerToken,
            apiDomain,
            runId,
            currentTimestamp,
            currentTimezone: "Asia/Kolkata",
          }),
          fetchNiftyQuote: fetchNiftyQuote({
            developerToken,
            apiDomain,
            runId,
            currentTimestamp,
            currentTimezone: "Asia/Kolkata",
          }),
          fetchQuoteTimeline: fetchQuoteTimeline({
            developerToken,
            apiDomain,
            runId,
            currentTimestamp,
            currentTimezone: "Asia/Kolkata",
          }),
          fetchShortlist: fetchShortlist({
            developerToken,
            apiDomain,
            runId,
            currentTimestamp,
            currentTimezone: "Asia/Kolkata",
          }),
          fetchShortlistPersistence: fetchShortlistPersistence({
            developerToken,
            apiDomain,
            runId,
            currentTimestamp,
            currentTimezone: "Asia/Kolkata",
          }),
          currentTimestamp,
        });
      },
    });

    // Mark the run as completed
    logger.info(`Marking run as completed: ${runId}`);
    try {
      await apiClient.patch<
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.updateRun.response>
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
          z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.deleteRun.response>
        >(`/v1/dashboard/runs/${runId}`);
      } catch (error) {
        logger.error(`Failed to delete run: ${error}`);
        // Don't throw - cleanup failure shouldn't break the flow
      }
    }
  }
}
