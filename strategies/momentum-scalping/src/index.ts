import { ganaka } from "@ganaka/sdk";
import dayjs from "dayjs";
import dotenv from "dotenv";
dotenv.config();

const tradingWindowStart = dayjs().set("date", 23).set("hour", 9).set("minute", 0);
const tradingWindowEnd = dayjs().set("date", 23).set("hour", 15).set("minute", 0);

async function main() {
  await ganaka({
    fn: async ({ fetchShortlist, fetchQuote, fetchCandles, placeOrder, currentTimestamp }) => {
      const currentTime = dayjs(currentTimestamp);

      const shortlist = await fetchShortlist("top-gainers", currentTimestamp);

      if (!shortlist) {
        return;
      }

      const firstCompany = shortlist[0];
      if (!firstCompany) {
        return;
      }

      const quote = await fetchQuote(firstCompany.nseSymbol, currentTimestamp);
      if (!quote) {
        return;
      }

      if (currentTime.hour() === 14 && currentTime.minute() === 30) {
        placeOrder({
          entryPrice: quote.payload.last_price,
          nseSymbol: firstCompany.nseSymbol,
          stopLossPrice: quote.payload.last_price * 0.95,
          takeProfitPrice: quote.payload.last_price * 1.05,
          timestamp: currentTimestamp,
        });
        console.log("Placed order at 14:30");
      }
      if (currentTime.hour() === 11 && currentTime.minute() === 24) {
        placeOrder({
          entryPrice: quote.payload.last_price,
          nseSymbol: firstCompany.nseSymbol,
          stopLossPrice: quote.payload.last_price * 0.95,
          takeProfitPrice: quote.payload.last_price * 1.05,
          timestamp: currentTimestamp,
        });
        console.log("Placed order at 11:24");
      }

      return;
    },
    intervalMinutes: 5,
    startTime: tradingWindowStart.toDate(),
    endTime: tradingWindowEnd.toDate(),
    deleteRunAfterCompletion: false,
  });
}

main();
