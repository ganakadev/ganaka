import dotenv from "dotenv";
import { logger } from "./utils/logger";
import { MarketDepthWriter, MarketDepthData } from "./utils/writer";
dotenv.config();

export type { MarketDepthData } from "./utils/writer";

export interface RunContext {
  stop: () => void;
  placeOrder: (data: MarketDepthData) => void;
}

export async function ganaka<T>({
  fn,
  settings: { loopIntervalSeconds },
}: {
  fn: (context: RunContext) => Promise<T>;
  settings: {
    loopIntervalSeconds: number;
  };
}) {
  // VARIABLES
  let stopped = false;
  let intervalId: NodeJS.Timeout | null = null;

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

  // HANDLERS
  const stop =
    (source: "strategy" | "callingFunction" | "internal") =>
    (forced?: boolean) => {
      logger.info(
        `Stopping execution${forced ? " (forced)" : ""} from ${source}`
      );
      stopped = true;
      logger.debug("Stopped flag set to true");
      if (intervalId) {
        logger.debug("Clearing interval");
        clearInterval(intervalId);
        intervalId = null;
        logger.debug("Interval cleared");
      }
      logger.debug("Execution stopped");
    };

  // Run the function immediately on first call
  try {
    logger.debug("Running function for the first time");
    await fn({
      stop: stop("strategy"),
      placeOrder,
    });
  } catch (error) {
    logger.error("Error running function for the first time");
    stop("internal")();
    throw error;
  }

  // If stopped during first execution, return early
  if (stopped) {
    logger.debug("Execution stopped during first execution, returning early");
    return;
  }

  // Set up interval for subsequent calls
  intervalId = setInterval(async () => {
    if (stopped) {
      logger.debug("Execution stopped, returning early");
      return;
    }

    try {
      logger.debug("Running function in interval");
      await fn({
        stop: stop("strategy"),
        placeOrder,
      });
    } catch (error) {
      logger.error("Error running function in interval");
      stop("internal")();
      throw error;
    }
  }, loopIntervalSeconds * 1000);

  return { stop: stop("callingFunction") };
}
