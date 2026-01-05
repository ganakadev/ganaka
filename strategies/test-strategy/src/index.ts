import { ganaka } from "@ganaka/sdk";
import dayjs from "dayjs";
import dotenv from "dotenv";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dotenv.config();

dayjs.extend(utc);
dayjs.extend(timezone);

// the time window is assumed to be set in IST
const tradingWindowStart = "2026-01-05T17:00:00";
const tradingWindowEnd = "2026-01-05T17:15:00";

async function main() {
  await ganaka({
    fn: async ({ fetchShortlist, fetchQuote, fetchCandles, placeOrder, currentTimestamp }) => {
      const currentTimestampForRequest = dayjs
        .tz(currentTimestamp, "Asia/Kolkata")
        .subtract(1, "minute")
        .format("YYYY-MM-DDTHH:mm:ss");

      console.log(currentTimestampForRequest);

      const fetchShortlistResponse = await fetchShortlist({
        type: "top-gainers",
        datetime: currentTimestampForRequest,
      });
      console.log(fetchShortlistResponse);

      const fetchQuoteResponse = await fetchQuote({
        symbol: "TARC",
        datetime: currentTimestampForRequest,
      });
      console.log(fetchQuoteResponse);

      const fetchCandlesResponse = await fetchCandles({
        symbol: "TARC",
        interval: "1minute",
        start_datetime: dayjs
          .tz(currentTimestampForRequest, "Asia/Kolkata")
          .subtract(1, "hour")
          .format("YYYY-MM-DDTHH:mm:ss"),
        end_datetime: currentTimestampForRequest,
      });
      console.log(fetchCandlesResponse);

      await placeOrder({
        nseSymbol: "TARC",
        entryPrice: 100,
        stopLossPrice: 90,
        takeProfitPrice: 110,
        datetime: currentTimestamp,
      });

      return;
    },
    intervalMinutes: 1,
    startTime: tradingWindowStart,
    endTime: tradingWindowEnd,
    deleteRunAfterCompletion: true,
  });
}

main();
