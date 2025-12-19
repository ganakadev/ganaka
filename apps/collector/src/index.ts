import dotenv from "dotenv";
import { Cron } from "croner";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { isWithinCollectionWindow } from "./utils/time";
import { collectMarketData } from "./collector";
import { prisma } from "./utils/prisma";
import { RedisManager } from "./utils/redis";

dayjs.extend(utc);
dayjs.extend(timezone);

dotenv.config();

async function runCollection(): Promise<void> {
  // // Check if we're within the collection window (8:45 AM - 3:30 PM IST, weekdays only)
  // if (!isWithinCollectionWindow()) {
  //   const nowIST = dayjs().tz("Asia/Kolkata");
  //   console.log(
  //     `Outside collection window. Current time: ${nowIST.format(
  //       "YYYY-MM-DD HH:mm:ss"
  //     )} IST`
  //   );
  //   console.log(`Collection window: 8:45 AM - 3:30 PM IST, Monday-Friday`);
  //   return;
  // }

  // Log current time in UTC and IST
  const now = dayjs();
  const nowIST = dayjs().tz("Asia/Kolkata");

  // Format UTC time: YYYY-MM-DD HH:mm:ss UTC
  const utcTime = now.utc().format("YYYY-MM-DD HH:mm:ss") + " UTC";

  // Format IST time: YYYY-MM-DD HH:mm:ss
  const istTime = nowIST.format("YYYY-MM-DD HH:mm:ss");
  console.log(`\nCron job triggered - UTC: ${utcTime}, IST: ${istTime} IST`);

  try {
    await collectMarketData();
    console.log("Market data collection completed successfully");
  } catch (error) {
    console.error("Failed to collect market data:", error);
    // Don't throw - let the cron job continue running
  }
}

function main() {
  // Initialize Redis connection
  try {
    RedisManager.getInstance();
  } catch (error) {
    console.error("Failed to initialize Redis:", error);
    process.exit(1);
  }

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
    const redisManager = RedisManager.getInstance();
    await redisManager.close();
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Keep the process alive
  // The cron job will continue running
}

main();
