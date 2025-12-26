import dayjs from "dayjs";

/**
 * Calculates the next interval boundary from a given timestamp.
 * Rounds up to the next interval boundary based on intervalMinutes.
 * @param timestamp - The current timestamp
 * @param intervalMinutes - The interval in minutes (e.g., 1, 2, 5)
 * @returns The next interval boundary Date
 */
function getNextIntervalBoundary(
  timestamp: Date,
  intervalMinutes: number
): Date {
  const date = dayjs(timestamp);
  const currentMinute = date.minute();
  const currentSecond = date.second();
  const currentMillisecond = date.millisecond();

  // Calculate how many minutes into the current hour we are
  const minutesIntoHour = currentMinute % intervalMinutes;

  // If we're exactly on a boundary and at 0 seconds, return the next boundary
  if (
    minutesIntoHour === 0 &&
    currentSecond === 0 &&
    currentMillisecond === 0
  ) {
    return date.add(intervalMinutes, "minute").toDate();
  }

  // Calculate minutes to add to reach the next boundary
  const minutesToAdd = intervalMinutes - minutesIntoHour;

  // Round up to the next interval boundary
  return date.add(minutesToAdd, "minute").second(0).millisecond(0).toDate();
}

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
  startTime,
  endTime,
  callback,
  intervalMinutes,
}: {
  startTime: Date;
  endTime: Date;
  callback: (currentTimestamp: Date) => Promise<void>;
  intervalMinutes: number;
}): Promise<void> {
  const now = new Date();

  // Check if current time is outside the specified range
  const isSimulationMode = now < startTime || now > endTime;
  if (isSimulationMode) {
    console.log("Current time is outside the specified range, simulating loop");
  }

  // Calculate the first interval boundary from startTime
  // This ensures intervals align consistently (e.g., interval=2 runs at 9:00, 9:02, 9:04...)
  const startDate = dayjs(startTime);
  const startMinute = startDate.minute();
  const minutesToFirstBoundary =
    intervalMinutes - (startMinute % intervalMinutes);

  // If startTime is exactly on a boundary, use it; otherwise go to next boundary
  const isOnBoundary =
    startMinute % intervalMinutes === 0 &&
    startDate.second() === 0 &&
    startDate.millisecond() === 0;

  let nextBoundary: Date;
  if (isOnBoundary) {
    nextBoundary = startTime;
  } else {
    nextBoundary = startDate
      .add(minutesToFirstBoundary, "minute")
      .second(0)
      .millisecond(0)
      .toDate();
  }

  // In simulation mode, execute all callbacks immediately without delays
  if (isSimulationMode) {
    while (nextBoundary <= endTime) {
      // Execute the callback with error handling
      try {
        await callback(nextBoundary);
      } catch (error) {
        console.error(
          `Error executing callback at ${nextBoundary.toISOString()}:`,
          error
        );
        // Continue to next interval even if callback fails
      }

      // Calculate the next interval boundary
      nextBoundary = dayjs(nextBoundary)
        .add(intervalMinutes, "minute")
        .toDate();
    }
    return;
  }

  // Normal mode: wait for each interval boundary
  // If startTime is in the past and we've missed the first boundary, start from current interval
  if (startTime < now && nextBoundary < now) {
    nextBoundary = getNextIntervalBoundary(now, intervalMinutes);
  }

  while (nextBoundary <= endTime) {
    // Wait until the exact interval boundary arrives
    const delay = nextBoundary.getTime() - Date.now();
    if (delay > 0) {
      await sleep(delay);
    }

    // Execute the callback with error handling
    try {
      await callback(nextBoundary);
    } catch (error) {
      console.error(
        `Error executing callback at ${nextBoundary.toISOString()}:`,
        error
      );
      // Continue to next interval even if callback fails
    }

    // Calculate the next interval boundary
    nextBoundary = dayjs(nextBoundary).add(intervalMinutes, "minute").toDate();
  }
}
