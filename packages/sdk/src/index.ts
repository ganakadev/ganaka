import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { logger } from "./utils/logger";
import { prisma } from "./utils/prisma";
import { Decimal } from "@ganaka/db/prisma";
dotenv.config();

export interface PlaceOrderData {
  nseSymbol: string;
  stopLossPrice: number;
  takeProfitPrice: number;
  entryPrice: number;
}

export interface RunContext {
  placeOrder: (data: PlaceOrderData) => void;
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
        logger.warn(
          `Developer token not found in database. Orders will not be persisted for runId: ${runId}`
        );
      }
    } catch (error) {
      logger.error(
        `Error resolving username from developer token: ${error}. Orders will not be persisted for runId: ${runId}`
      );
    }
  } else {
    logger.warn(
      `No developer token found in environment variables (DEVELOPER_TOKEN or GANAKA_TOKEN). Orders will not be persisted for runId: ${runId}`
    );
  }

  // Create placeOrder function that persists to database
  const placeOrder = (data: PlaceOrderData) => {
    // Keep existing console.log for backward compatibility
    console.log(data);

    // Persist to database if username is available
    if (username) {
      // Fire-and-forget async operation (don't await to maintain void signature)
      prisma.order
        .create({
          data: {
            nseSymbol: data.nseSymbol,
            entryPrice: new Decimal(data.entryPrice),
            stopLossPrice: new Decimal(data.stopLossPrice),
            takeProfitPrice: new Decimal(data.takeProfitPrice),
            timestamp: new Date(),
            runId,
            username,
          },
        })
        .then(() => {
          logger.debug(
            `Order persisted for ${data.nseSymbol} in runId: ${runId}`
          );
        })
        .catch((error) => {
          logger.error(
            `Failed to persist order for ${data.nseSymbol} in runId: ${runId}: ${error}`
          );
        });
    }
  };

  // Run the function immediately on first call
  try {
    logger.debug("Running function for the first time");
    await fn({
      placeOrder,
    });
  } catch (error) {
    logger.error("Error running function for the first time");
    throw error;
  }
}
