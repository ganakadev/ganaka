import { ganaka } from "@ganaka/sdk";
import dayjs from "dayjs";

async function main() {
  await ganaka({
    fn: async ({ fetchShortlist, fetchQuote, fetchCandles, placeOrder }) => {
      const tradingWindowStart = dayjs().set("hour", 11).set("minute", 0);
      const tradingWindowEnd = dayjs().set("hour", 15).set("minute", 30);

      console.log(tradingWindowStart.toDate(), tradingWindowEnd.toDate());
    },
  });
}

main();
