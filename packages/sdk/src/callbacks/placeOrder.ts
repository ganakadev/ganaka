import { Decimal } from "@ganaka/db/prisma";
import { prisma } from "../utils/prisma";
import { logger } from "../utils/logger";

export interface PlaceOrderData {
  nseSymbol: string;
  stopLossPrice: number;
  takeProfitPrice: number;
  entryPrice: number;
}

export const placeOrder =
  ({ username, runId }: { username: string; runId: string }) =>
  (data: PlaceOrderData) => {
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
