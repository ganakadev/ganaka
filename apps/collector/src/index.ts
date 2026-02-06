import dotenv from "dotenv";
import { Cron } from "croner";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { runNseSync } from "./nse-sync";

dayjs.extend(utc);
dayjs.extend(timezone);

dotenv.config();

function main() {
  console.log(
    "Starting collector service at",
    dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")
  );

  // NSE sync cron at 11PM IST on weekdays
  const nseSyncJob = new Cron(
    "35 12 * * 1-5",
    {
      timezone: "Asia/Kolkata",
    },
    async () => {
      try {
        await runNseSync();
      } catch (error) {
        console.error("NSE sync failed:", error);
        // Don't throw - let the cron job continue running
      }
    }
  );
  console.log("NSE sync schedule: 0 23 * * 1-5 (11:00 PM IST, Monday-Friday)");

  // Set up graceful shutdown handlers
  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}, shutting down gracefully...`);
    nseSyncJob.stop();
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Keep the process alive
  // The cron job will continue running
}

main();
