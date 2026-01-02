import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

/**
 * Formats a Date object to YYYY-MM-DDTHH:mm:ss format (UTC) for API datetime parameters
 * @param date - Date object to format
 * @returns Formatted datetime string in UTC (e.g., "2025-12-26T11:06:00")
 */
export function formatDateTimeForAPI(date: Date | null | undefined): string {
  if (!date) return "";
  return dayjs(date).format("YYYY-MM-DDTHH:mm:ss");
}

/**
 * Formats a Date object to YYYY-MM-DD format (UTC) for API date-only parameters
 * @param date - Date object to format
 * @returns Formatted date string in UTC (e.g., "2025-12-26")
 */
export function formatDateForAPI(date: Date | null | undefined): string {
  if (!date) return "";
  return dayjs(date).format("YYYY-MM-DD");
}
