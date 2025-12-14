import { isWithinTradingWindow } from "../utils/time";

export function validateTradingWindow(): boolean {
  if (!isWithinTradingWindow()) {
    const now = new Date();
    console.log(
      `⏰ Outside trading window. Current time: ${now.toLocaleString()}`
    );
    console.log(`   Trading window: 9:45 AM - 3:00 PM IST`);
    return false;
  }
  return true;
}
