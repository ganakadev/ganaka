import dotenv from "dotenv";
import { scrapeGrowwShortlist } from "./groww/scrape-shortlist";
import { logger } from "./utils/logger";
import { PlaceOrderData, MarketDepthWriter } from "./utils/writer";
import { getNiftyTrend } from "./groww/get-nifty-trend";
dotenv.config();

export type { GrowwShortlistItem } from "./groww/scrape-shortlist";
export type { PlaceOrderData } from "./utils/writer";
export type { NiftyTrend } from "./groww/get-nifty-trend";

export interface RunContext {
  scrapeGrowwShortlist: typeof scrapeGrowwShortlist;
  getNiftyTrend: typeof getNiftyTrend;
  placeOrder: (data: PlaceOrderData) => void;
}

export async function ganaka<T>({
  fn,
  disableActivityFiles,
}: {
  fn: (context: RunContext) => Promise<T>;
  disableActivityFiles?: boolean;
}) {
  // Initialize market depth writer only if activity files are not disabled
  let marketDepthWriter: MarketDepthWriter | null = null;
  if (!disableActivityFiles) {
    const projectRoot = process.cwd();
    marketDepthWriter = new MarketDepthWriter(projectRoot);
    await marketDepthWriter.initialize();
  }

  // Create logMarketDepth function that writes asynchronously
  const placeOrder = (data: PlaceOrderData) => {
    if (marketDepthWriter) {
      // Fire and forget - don't await to avoid blocking
      marketDepthWriter.write(data).catch((error) => {
        logger.error(`Failed to write market depth data: ${error}`);
      });
    }
  };

  // Run the function immediately on first call
  try {
    logger.debug("Running function for the first time");
    await fn({
      placeOrder,
      getGrowwQuote,
      getGrowwHistoricalCandles,
      scrapeGrowwShortlist,
      getNiftyTrend,
    });
  } catch (error) {
    logger.error("Error running function for the first time");
    throw error;
  }
}
