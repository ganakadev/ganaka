import dotenv from "dotenv";
import { logger } from "./utils/logger";
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
  // Create logMarketDepth function that writes asynchronously
  const placeOrder = (data: PlaceOrderData) => {
    console.log(data);
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
