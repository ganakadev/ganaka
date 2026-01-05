import { ganaka } from "@ganaka/sdk";
import dayjs from "dayjs";
import dotenv from "dotenv";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dotenv.config();

dayjs.extend(utc);
dayjs.extend(timezone);

// the time window is assumed to be set in IST
const tradingWindowStart = "2026-01-05T15:05:00";
const tradingWindowEnd = "2026-01-05T15:50:00";

async function main() {
  await ganaka({
    fn: async ({ fetchShortlist, fetchQuote, fetchCandles, placeOrder, currentTimestamp }) => {
      const currentTimestampDayJS = dayjs.tz(currentTimestamp, "Asia/Kolkata");
      console.log(currentTimestampDayJS.format("YYYY-MM-DDTHH:mm:ss"));
    },
    intervalMinutes: 2,
    startTime: tradingWindowStart,
    endTime: tradingWindowEnd,
    deleteRunAfterCompletion: true,
  });
}

main();
