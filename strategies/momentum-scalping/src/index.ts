import { ganaka } from "@ganaka/sdk";
import dayjs from "dayjs";
import dotenv from "dotenv";
dotenv.config();

const tradingWindowStart = dayjs()
  .set("date", 23)
  .set("hour", 9)
  .set("minute", 0);
const tradingWindowEnd = dayjs()
  .set("date", 23)
  .set("hour", 10)
  .set("minute", 0);

async function main() {
  await ganaka({
    fn: async ({
      fetchShortlist,
      fetchQuote,
      fetchCandles,
      placeOrder,
      currentTimestamp,
    }) => {
      const currentTime = dayjs(currentTimestamp);

      const shortlist = await fetchShortlist("top-gainers", currentTimestamp);
      console.log(shortlist);

      if (!shortlist) {
        return;
      }

      const firstCompany = shortlist[0];
      console.log(firstCompany);
      if (!firstCompany) {
        return;
      }

      const quote = await fetchQuote(firstCompany.nseSymbol, currentTimestamp);
      console.log(quote);
      if (!quote) {
        return;
      }

      // place order if time is 11AM or 1:30PM
      if (currentTime.hour() === 9 && currentTime.minute() === 50) {
        placeOrder({
          entryPrice: quote.payload.last_price,
          nseSymbol: firstCompany.nseSymbol,
          stopLossPrice: quote.payload.last_price * 0.95,
          takeProfitPrice: quote.payload.last_price * 1.05,
        });
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
