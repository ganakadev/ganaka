import { v1_dashboard_schemas } from "@ganaka/schemas";
import { logger } from "../utils/logger";
import { ApiClient } from "../utils/apiClient";
import { z } from "zod";

export interface PlaceOrderData {
  nseSymbol: string;
  stopLossPrice: number;
  takeProfitPrice: number;
  entryPrice: number;
  timestamp: Date;
}

export const placeOrder =
  ({ runId, apiClient }: { runId: string | null; apiClient: ApiClient }) =>
  (data: PlaceOrderData) => {
    // Keep existing console.log for backward compatibility
    console.log(data);

    // Persist to database via API if runId is available
    if (runId) {
      // Fire-and-forget async operation (don't await to maintain void signature)
      apiClient
        .post<
          z.infer<
            typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.createOrder.response
          >
        >(`/v1/dashboard/runs/${runId}/orders`, {
          nseSymbol: data.nseSymbol,
          entryPrice: data.entryPrice,
          stopLossPrice: data.stopLossPrice,
          takeProfitPrice: data.takeProfitPrice,
          timestamp: data.timestamp.toISOString(),
        })
        .then(() => {
          logger.debug(`Order persisted for ${data.nseSymbol} in runId: ${runId}`);
        })
        .catch((error) => {
          logger.error(
            `Failed to persist order for ${data.nseSymbol} in runId: ${runId}: ${error}`
          );
        });
    }
  };
