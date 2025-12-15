import {
  MARKET_OPEN_HOUR,
  MARKET_OPEN_MINUTE,
  MARKET_CLOSE_HOUR,
  MARKET_CLOSE_MINUTE,
  TRADING_WINDOW_START_MINUTES,
  TRADING_WINDOW_END_MINUTES,
} from "../config";

export function isWithinTradingWindow(): boolean {
  const now = new Date();
  // Get current time in IST (UTC+5:30)
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const currentHour = parseInt(
    parts.find((p) => p.type === "hour")?.value || "0",
    10
  );
  const currentMinute = parseInt(
    parts.find((p) => p.type === "minute")?.value || "0",
    10
  );
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // Trading window start: 9:45 AM IST = 9*60 + 45 = 585 minutes
  const tradingWindowStartInMinutes =
    MARKET_OPEN_HOUR * 60 + MARKET_OPEN_MINUTE + TRADING_WINDOW_START_MINUTES;

  // Trading window end: 3:00 PM IST = 15*60 + 0 = 900 minutes
  const tradingWindowEndInMinutes =
    MARKET_CLOSE_HOUR * 60 + MARKET_CLOSE_MINUTE - TRADING_WINDOW_END_MINUTES;

  return (
    currentTimeInMinutes >= tradingWindowStartInMinutes &&
    currentTimeInMinutes <= tradingWindowEndInMinutes
  );
}

export function getMarketOpenTime(): Date {
  const now = new Date();
  // Get current date components in IST
  const dateFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Get today's date string in YYYY-MM-DD format (en-CA gives this format)
  const dateStr = dateFormatter.format(now);

  // Create ISO string for market open time (9:15 AM IST = UTC-5:30)
  // Format: YYYY-MM-DDTHH:mm:ss+05:30
  const istDateStr = `${dateStr}T${String(MARKET_OPEN_HOUR).padStart(
    2,
    "0"
  )}:${String(MARKET_OPEN_MINUTE).padStart(2, "0")}:00+05:30`;

  // Parse as IST - Date will convert to UTC internally
  return new Date(istDateStr);
}
