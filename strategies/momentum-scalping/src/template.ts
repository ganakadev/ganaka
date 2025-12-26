import { ganaka } from "@ganaka/sdk";
import dayjs from "dayjs";
import dotenv from "dotenv";
dotenv.config();

const tradingWindowStart = dayjs()
  .set("date", 23)
  .set("hour", 16)
  .set("minute", 0);
const tradingWindowEnd = dayjs()
  .set("date", 23)
  .set("hour", 18)
  .set("minute", 30);

async function main() {
  await ganaka({
    fn: async ({
      fetchShortlist,
      fetchQuote,
      fetchCandles,
      placeOrder,
      currentTimestamp,
    }) => {
      console.log(dayjs(currentTimestamp).format("YYYY-MM-DD HH:mm:ss"));
      return;
    },
    intervalMinutes: 60,
    startTime: tradingWindowStart.toDate(),
    endTime: tradingWindowEnd.toDate(),
    deleteRunAfterCompletion: true,
  });
}

main();
