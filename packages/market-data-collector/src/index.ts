import dotenv from "dotenv";
import { ganaka } from "@ganaka-algos/sdk";
import { isWithinCollectionWindow } from "./utils/time";
import { collectMarketData } from "./collector";

dotenv.config();

async function main() {
  // Check if we're within the collection window (8:45 AM - 3:30 PM IST)
  // if (!isWithinCollectionWindow()) {
  //   const now = new Date();
  //   console.log(
  //     `Outside collection window. Current time: ${now.toLocaleString("en-US", {
  //       timeZone: "Asia/Kolkata",
  //     })} IST`
  //   );
  //   console.log(`   Collection window: 8:45 AM - 3:30 PM IST`);
  //   process.exit(0);
  // }

  // Run within ganaka SDK to access SDK functions
  await ganaka({
    fn: async ({ getGrowwShortlist, getGrowwQuote }) => {
      try {
        await collectMarketData(getGrowwShortlist, getGrowwQuote);
        console.log("Market data collection completed successfully");
        process.exit(0);
      } catch (error) {
        console.error("Failed to collect market data:", error);
        process.exit(1);
      }
    },
  });
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
