import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import calendar from "dayjs/plugin/calendar";
import relativeTime from "dayjs/plugin/relativeTime";
import { logger } from "./logger";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(calendar);
dayjs.extend(relativeTime);

/**
 * Sleeps for a specified number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Runs a callback function at specified interval boundaries between startTime and endTime.
 * @param startTime - The start time for the loop
 * @param endTime - The end time for the loop
 * @param callback - The callback function to execute at each interval
 * @param intervalMinutes - The interval in minutes (default: 1)
 */
export async function runMinuteLoop({
  startTimeDayJS,
  endTimeDayJS,
  intervalMinutes,
  callback,
}: {
  startTimeDayJS: dayjs.Dayjs;
  endTimeDayJS: dayjs.Dayjs;
  callback: (currentTimestamp: string) => Promise<void>;
  intervalMinutes: number;
}): Promise<void> {
  let currentISTDayJS = dayjs.utc().tz("Asia/Kolkata");

  logger.debug(`currentIST: ${currentISTDayJS.format("YYYY-MM-DDTHH:mm:ss")}`);
  logger.debug(`startTime: ${startTimeDayJS.format("YYYY-MM-DDTHH:mm:ss")}`);
  logger.debug(`endTime: ${endTimeDayJS.format("YYYY-MM-DDTHH:mm:ss")}`);

  // Check if current time is after endTime (past run - use simulation mode)
  const isSimulationMode = currentISTDayJS.isAfter(endTimeDayJS);
  if (isSimulationMode) {
    logger.info("Current time is after endTime, simulating loop");
  }

  // If current time is before startTime, wait until startTime arrives
  if (currentISTDayJS.isBefore(startTimeDayJS)) {
    const delayUntilStart = startTimeDayJS.diff(currentISTDayJS, "millisecond");
    logger.info(
      `Starting loop ${startTimeDayJS.from(currentISTDayJS)} at ${startTimeDayJS.format(
        "YYYY-MM-DD HH:mm"
      )}`
    );
    await sleep(delayUntilStart);
    currentISTDayJS = currentISTDayJS.add(delayUntilStart, "millisecond");
  }

  // if current time is after startTime but before endTime, set startTime to current time
  if (currentISTDayJS.isAfter(startTimeDayJS) && currentISTDayJS.isBefore(endTimeDayJS)) {
    startTimeDayJS = currentISTDayJS;
  }

  /**
   * Calculate the first interval boundary from startTime
   * For a given intervalMinutes, boundaries are the exact times when the callback should run.
   *
   * Example with intervalMinutes = 2:
   * Boundaries: 9:00:00.000, 9:02:00.000, 9:04:00.000, 9:06:00.000, etc.
   * Not boundaries: 9:01:00.000, 9:03:00.000, 9:05:00.000, etc.
   *
   * Example with intervalMinutes = 5:
   * Boundaries: 9:00:00.000, 9:05:00.000, 9:10:00.000, 9:15:00.000, etc.
   * Not boundaries: 9:01:00.000, 9:07:00.000, 9:13:00.000, etc.
   *
   * The problem without boundaries:
   * If you start a loop at 9:01:30 with intervalMinutes = 2 and just add 2 minutes each time:
   * Without boundaries:
   * 9:01:30, 9:03:30, 9:05:30, 9:07:30, etc.
   * This creates drift and inconsistency.
   */
  const startMinute = startTimeDayJS.minute();
  const minutesToFirstBoundary = intervalMinutes - (startMinute % intervalMinutes);

  // If startTime is exactly on a boundary, use it; otherwise go to next boundary
  const isOnBoundary =
    startMinute % intervalMinutes === 0 &&
    startTimeDayJS.second() === 0 &&
    startTimeDayJS.millisecond() === 0;

  let nextBoundaryDayJS: dayjs.Dayjs;
  if (isOnBoundary) {
    nextBoundaryDayJS = startTimeDayJS;
  } else {
    nextBoundaryDayJS = startTimeDayJS
      .add(minutesToFirstBoundary, "minute")
      .second(0)
      .millisecond(0);
  }

  logger.debug(`nextBoundary: ${nextBoundaryDayJS.format("YYYY-MM-DDTHH:mm:ss")}`);

  // In simulation mode (past runs), execute all callbacks immediately without delays
  if (isSimulationMode) {
    while (nextBoundaryDayJS.isBefore(endTimeDayJS) || nextBoundaryDayJS.isSame(endTimeDayJS)) {
      // Execute the callback with error handling
      try {
        await callback(nextBoundaryDayJS.format("YYYY-MM-DDTHH:mm:ss"));
      } catch (error) {
        console.error(
          `Error executing callback at ${nextBoundaryDayJS.format("YYYY-MM-DDTHH:mm:ss")}:`,
          error
        );
        // Continue to next interval even if callback fails
      }

      // Calculate the next interval boundary
      nextBoundaryDayJS = nextBoundaryDayJS.add(intervalMinutes, "minute");
    }
    return;
  }

  // Normal mode: wait for each interval boundary
  while (nextBoundaryDayJS.isBefore(endTimeDayJS) || nextBoundaryDayJS.isSame(endTimeDayJS)) {
    // if we need to wait for the next boundary, wait for the delay
    const delay = nextBoundaryDayJS.diff(currentISTDayJS, "millisecond");
    if (delay > 0) {
      logger.info(
        `Waiting for ${nextBoundaryDayJS.from(
          currentISTDayJS,
          true
        )} to reach next execution time: ${nextBoundaryDayJS.format("YYYY-MM-DD HH:mm:ss")}`
      );
      await sleep(delay);
    }

    // Execute the callback with error handling
    try {
      await callback(nextBoundaryDayJS.format("YYYY-MM-DDTHH:mm:ss"));
    } catch (error) {
      console.error(
        `Error executing callback at ${nextBoundaryDayJS.format("YYYY-MM-DDTHH:mm:ss")}:`,
        error
      );
      // Continue to next interval even if callback fails
    }

    // Calculate the next interval boundary
    nextBoundaryDayJS = nextBoundaryDayJS.add(intervalMinutes, "minute");
  }
}
