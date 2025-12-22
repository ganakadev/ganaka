import { v1_developer_groww_schemas } from "@ganaka/schemas";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { z } from "zod";
import { fetchCandles } from "./callbacks/fetchCandles";
import { fetchQuote } from "./callbacks/fetchQuote";
import { logger } from "./utils/logger";
import { prisma } from "./utils/prisma";
import { placeOrder, PlaceOrderData } from "./callbacks/placeOrder";
dotenv.config();

export interface RunContext {
  placeOrder: (data: PlaceOrderData) => void;
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
    symbol: string
  ) => Promise<
    z.infer<typeof v1_developer_groww_schemas.getGrowwQuote.response>["data"]
  >;
}

export async function ganaka<T>({
  fn,
}: {
  fn: (context: RunContext) => Promise<T>;
}) {
  // Generate unique runId for this invocation
  const runId = randomUUID();
  logger.debug(`Generated runId: ${runId}`);

  // Resolve username from developer token
  let username: string | null = null;
  const developerToken =
    process.env.DEVELOPER_TOKEN || process.env.GANAKA_TOKEN;

  if (developerToken) {
    try {
      const tokenRecord = await prisma.developerToken.findUnique({
        where: { token: developerToken },
      });
      if (tokenRecord) {
        username = tokenRecord.username;
        logger.debug(`Resolved username: ${username} for runId: ${runId}`);
      } else {
        throw new Error(
          `Developer token not found in database. Please set DEVELOPER_TOKEN environment variable.`
        );
      }
    } catch (error) {
      throw new Error(
        `Error resolving username from developer token: ${error}`
      );
    }
  } else {
    throw new Error(
      "No developer token found in environment variables (DEVELOPER_TOKEN). Please set DEVELOPER_TOKEN environment variable."
    );
  }

  // Get API domain from environment or use default
  const apiDomain = process.env.API_DOMAIN || "https://api.ganaka.live";

  // Run the function immediately on first call
  try {
    logger.debug("Running function for the first time");
    await fn({
      placeOrder: placeOrder({ username, runId }),
      fetchCandles: fetchCandles({
        developerToken,
        apiDomain,
      }),
      fetchQuote: fetchQuote({
        developerToken,
        apiDomain,
      }),
    });
  } catch (error) {
    logger.error("Error running function for the first time");
    throw error;
  }
}
