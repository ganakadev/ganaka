import dotenv from "dotenv";
import { logger } from "./utils/logger";
dotenv.config();

export interface RunContext {
  placeOrder: (data: string) => void;
}

export async function ganaka<T>({
  fn,
}: {
  fn: (context: RunContext) => Promise<T>;
}) {
  // Create logMarketDepth function that writes asynchronously
  const placeOrder = (data: string) => {
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
