import dotenv from "dotenv";
import { logger } from "./utils/logger";
dotenv.config();

export interface RunContext {
  stop: () => void;
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
      });
    } catch (error) {
      logger.error("Error running function in interval");
      stop("internal")();
      throw error;
    }
  }, loopIntervalSeconds * 1000);

  return { stop: stop("callingFunction") };
}
