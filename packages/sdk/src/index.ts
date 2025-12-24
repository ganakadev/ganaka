import {
  v1_developer_groww_schemas,
  v1_developer_lists_schemas,
} from "@ganaka/schemas";
import dotenv from "dotenv";
import { z } from "zod";
import { fetchCandles } from "./callbacks/fetchCandles";
import { fetchQuote } from "./callbacks/fetchQuote";
import { fetchShortlist } from "./callbacks/fetchShortlist";
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
  fetchShortlist: (
    type: z.infer<typeof v1_developer_lists_schemas.getLists.query>["type"]
  ) => Promise<
    z.infer<typeof v1_developer_lists_schemas.getLists.response>["data"]
  >;
}

export async function ganaka<T>({
  fn,
  startTime,
  endTime,
}: {
  fn: (context: RunContext) => Promise<T>;
  startTime: Date;
  endTime: Date;
}) {
  // Resolve username from developer token
  let runId: string | null = null;
  const developerToken = process.env.DEVELOPER_KEY;

  if (developerToken) {
    try {
      const developer = await prisma.developer.findUnique({
        where: { token: developerToken },
      });
      if (developer) {
        // create a new run
        const run = await prisma.run.create({
          data: {
            startTime: startTime,
            endTime: endTime,
            developer: {
              connect: {
                id: developer.id,
              },
            },
          },
        });
        if (run) {
          logger.debug(`Created run: ${run.id}`);
          runId = run.id;
        } else {
          throw new Error("Failed to create run");
        }
      } else {
        throw new Error(
          `Developer not found in database. Please check your DEVELOPER_KEY environment variable.`
        );
      }
    } catch (error) {
      throw new Error(`Error creating run: ${error}`);
    }
  } else {
    throw new Error(
      "No developer token found in environment variables (DEVELOPER_TOKEN). Please set DEVELOPER_TOKEN environment variable."
    );
  }

  // Get API domain from environment or use default
  const apiDomain = process.env.API_DOMAIN || "https://api.ganaka.live";

  try {
    await fn({
      placeOrder: placeOrder({ runId }),
      fetchCandles: fetchCandles({
        developerToken,
        apiDomain,
      }),
      fetchQuote: fetchQuote({
        developerToken,
        apiDomain,
      }),
      fetchShortlist: fetchShortlist({
        developerToken,
        apiDomain,
      }),
    });
  } catch (error) {
    logger.error("Error running function for the first time");
    throw error;
  }
}
