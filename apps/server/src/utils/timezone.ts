import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Parse a date-only string (YYYY-MM-DD) in the specified timezone,
 * interpret as midnight of that date, and return as UTC Date object.
 *
 * @param dateString - Date string in format YYYY-MM-DD
 * @param timezone - IANA timezone identifier (default: "Asia/Kolkata")
 * @returns UTC Date object representing midnight of the specified date in the given timezone
 *
 * @example
 * parseDateInTimezone("2025-12-26", "Asia/Kolkata")
 * // Returns: 2025-12-25T18:30:00.000Z (midnight IST = 18:30 previous day UTC)
 */
export function parseDateInTimezone(dateString: string, timezone: string = "Asia/Kolkata"): Date {
  // Parse the date string in the specified timezone and interpret as midnight
  const dateTimeInTimezone = dayjs.tz(`${dateString} 00:00:00`, timezone);

  // Convert to UTC Date object
  return dateTimeInTimezone.utc().toDate();
}

/**
 * Parse a datetime string in the specified timezone and return as UTC Date object.
 *
 * @param dateTimeString - Datetime string in format YYYY-MM-DDTHH:mm:ss
 * @param timezone - IANA timezone identifier (default: "Asia/Kolkata")
 * @returns UTC Date object representing the specified datetime in the given timezone
 *
 * @example
 * parseDateTimeInTimezone("2025-12-26T11:06:00", "Asia/Kolkata")
 * // Returns: 2025-12-26T05:36:00.000Z
 */
export function parseDateTimeInTimezone(
  dateTimeString: string,
  timezone: string = "Asia/Kolkata"
): Date {
  // Parse the datetime string in the specified timezone
  const dateTimeInTimezone = dayjs.tz(dateTimeString, timezone);

  // Convert to UTC Date object
  return dateTimeInTimezone.utc().toDate();
}
