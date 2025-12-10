import dotenv from "dotenv";
import { getGrowwQuote } from "./groww/get-quote";
import { getGrowwTopGainers } from "./groww/get-top-gainers";
import { logger } from "./utils/logger";
import { MarketDepthData, MarketDepthWriter } from "./utils/writer";
dotenv.config();

export type { GrowwTopGainer } from "./groww/get-top-gainers";
export type { MarketDepthData } from "./utils/writer";

export interface RunContext {
  getGrowwQuote: typeof getGrowwQuote;
  getGrowwTopGainers: typeof getGrowwTopGainers;
  placeOrder: (data: MarketDepthData) => void;
}

export async function ganaka<T>({
  fn,
}: {
  fn: (context: RunContext) => Promise<T>;
}) {
  // Initialize market depth writer
  const projectRoot = process.cwd();
  const marketDepthWriter = new MarketDepthWriter(projectRoot);
  await marketDepthWriter.initialize();

  // Create logMarketDepth function that writes asynchronously
  const placeOrder = (data: MarketDepthData) => {
    // Fire and forget - don't await to avoid blocking
    marketDepthWriter.write(data).catch((error) => {
      logger.error(`Failed to write market depth data: ${error}`);
    });
  };

  // Run the function immediately on first call
  try {
    logger.debug("Running function for the first time");
    await fn({
      placeOrder,
      getGrowwQuote,
      getGrowwTopGainers,
    });
  } catch (error) {
    logger.error("Error running function for the first time");
    throw error;
  }
}
