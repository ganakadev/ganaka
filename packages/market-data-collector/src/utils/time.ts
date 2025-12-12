export function isWithinCollectionWindow(): boolean {
  const now = new Date();

  // Get current day of week in IST
  const dayFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
  });
  const weekday = dayFormatter.format(now);

  // Check if it's a weekday (Monday-Friday)
  // weekday will be "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", or "Sun"
  if (weekday === "Sat" || weekday === "Sun") {
    return false;
  }

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

  // Collection window start: 8:45 AM IST = 8*60 + 45 = 525 minutes
  const collectionWindowStartInMinutes = 8 * 60 + 45; // 8:45 AM

  // Collection window end: 3:30 PM IST = 15*60 + 30 = 930 minutes
  const collectionWindowEndInMinutes = 15 * 60 + 30; // 3:30 PM

  return (
    currentTimeInMinutes >= collectionWindowStartInMinutes &&
    currentTimeInMinutes <= collectionWindowEndInMinutes
  );
}

export function getCurrentISTTime(): Date {
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
    second: "2-digit",
    hour12: false,
  });

  // Get today's date string in YYYY-MM-DD format
  const dateStr = dateFormatter.format(now);
  const timeStr = timeFormatter.format(now);

  // Create ISO string for current time in IST
  // Format: YYYY-MM-DDTHH:mm:ss+05:30
  const istDateTimeStr = `${dateStr}T${timeStr}+05:30`;

  // Parse as IST - Date will convert to UTC internally
  return new Date(istDateTimeStr);
}
