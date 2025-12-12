import dotenv from "dotenv";
import { Cron } from "croner";
import { ganaka } from "@ganaka-algos/sdk";
import { isWithinCollectionWindow } from "./utils/time";
import { collectMarketData } from "./collector";
import { prisma } from "./utils/prisma";

dotenv.config();

async function runCollection(): Promise<void> {
  // Log current time in UTC and IST
  const now = new Date();

  // Format UTC time: YYYY-MM-DD HH:mm:ss UTC
  const utcTime = now.toISOString().replace("T", " ").slice(0, 19) + " UTC";

  // Format IST time: YYYY-MM-DD HH:mm:ss
  const istFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const istTime = istFormatter.format(now).replace("T", " ");
  console.log(`\nCron job triggered - UTC: ${utcTime}, IST: ${istTime} IST`);

  // // Check if we're within the collection window (8:45 AM - 3:30 PM IST, weekdays only)
  // if (!isWithinCollectionWindow()) {
  //   const now = new Date();
  //   console.log(
  //     `Outside collection window. Current time: ${now.toLocaleString("en-US", {
  //       timeZone: "Asia/Kolkata",
  //     })} IST`
  //   );
  //   console.log(`   Collection window: 8:45 AM - 3:30 PM IST, Monday-Friday`);
  //   return;
  // }

  // Run within ganaka SDK to access SDK functions
  await ganaka({
    fn: async ({ getGrowwShortlist, getGrowwQuote }) => {
      try {
        await collectMarketData(getGrowwShortlist, getGrowwQuote);
        console.log("Market data collection completed successfully");
      } catch (error) {
        console.error("Failed to collect market data:", error);
        // Don't throw - let the cron job continue running
      }
    },
    disableActivityFiles: true,
  });
}

function main() {
  // Set up cron job: every minute on weekdays (Monday-Friday)
  // Cron expression: * * * * 1-5 (every minute, Monday through Friday)
  const job = new Cron(
    "* * * * 1-5",
    {
      timezone: "Asia/Kolkata",
    },
    async () => {
      await runCollection();
    }
  );

  console.log(
    "Market data collector started. Running every minute on weekdays (8:45 AM - 3:30 PM IST)"
  );
  console.log("Cron schedule: * * * * 1-5 (every minute, Monday-Friday)");
  console.log("Timezone: Asia/Kolkata (IST)");

  // Set up graceful shutdown handlers
  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}, shutting down gracefully...`);
    job.stop();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Keep the process alive
  // The cron job will continue running
}

main();
