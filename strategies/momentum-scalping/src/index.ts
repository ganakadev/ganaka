import { ganaka } from "@ganaka/sdk";
import dayjs from "dayjs";

const tradingWindowStart = dayjs()
  .set("date", 23)
  .set("hour", 11)
  .set("minute", 0);
const tradingWindowEnd = dayjs()
  .set("date", 23)
  .set("hour", 15)
  .set("minute", 30);

async function main() {
  await ganaka({
    fn: async ({ fetchShortlist, fetchQuote, fetchCandles, placeOrder }) => {
      console.log(tradingWindowStart.toDate(), tradingWindowEnd.toDate());
    },
    startTime: tradingWindowStart.toDate(),
    endTime: tradingWindowEnd.toDate(),
  });
}

main();
