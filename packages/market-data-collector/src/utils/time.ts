import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function isWithinCollectionWindow(): boolean {
  const nowIST = dayjs().tz("Asia/Kolkata");

  // Check if it's a weekday (Monday-Friday)
  // dayjs uses 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const dayOfWeek = nowIST.day();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    // Sunday or Saturday
    return false;
  }

  // Get current time in minutes
  const currentHour = nowIST.hour();
  const currentMinute = nowIST.minute();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // Collection window start: 8:45 AM IST = 8*60 + 45 = 525 minutes
  const collectionWindowStartInMinutes = 8 * 60 + 0; // 8:45 AM

  // Collection window end: 3:30 PM IST = 15*60 + 30 = 930 minutes
  const collectionWindowEndInMinutes = 15 * 60 + 30; // 3:30 PM

  return (
    currentTimeInMinutes >= collectionWindowStartInMinutes &&
    currentTimeInMinutes <= collectionWindowEndInMinutes
  );
}

export function getCurrentISTTime(): Date {
  // Get current time in IST timezone and convert to Date object
  const nowIST = dayjs().tz("Asia/Kolkata");
  return nowIST.toDate();
}
