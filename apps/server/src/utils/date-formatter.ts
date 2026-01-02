/**
 * Utility functions for consistent date and datetime formatting across the API.
 *
 * All functions format dates in UTC timezone to ensure consistency.
 */
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

/**
 * Formats a Date object as YYYY-MM-DDTHH:mm:ss (no timezone suffix, no milliseconds)
 * This matches the Groww API format and our datetimeFormatSchema expectation.
 *
 * @param date - The Date object to format
 * @returns Formatted datetime string in YYYY-MM-DDTHH:mm:ss format
 */
export function formatDateTime(date: Date): string {
  return dayjs.utc(date).format("YYYY-MM-DDTHH:mm:ss");
}

/**
 * Formats a Date object as YYYY-MM-DD (date only)
 * This matches our dateFormatSchema expectation.
 *
 * @param date - The Date object to format
 * @returns Formatted date string in YYYY-MM-DD format
 */
export function formatDate(date: Date): string {
  return dayjs.utc(date).format("YYYY-MM-DD");
}
