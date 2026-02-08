import { prisma } from "../utils/prisma";
import { fetchInstrumentsFromCSV, syncInstrumentsToDb } from "./instruments";
import { determineFetchRequests, fetchAndStoreCandles } from "./candles";
import { holidayCheck } from "../utils/holidayCheck";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Main orchestrator for NSE sync process
 */
export async function runNseSync(): Promise<void> {
  console.log("=".repeat(60));
  console.log("Starting NSE sync...");
  console.log("=".repeat(60));

  // Check if holiday using existing checkIfHoliday() function
  const isHoliday = await holidayCheck();
  if (isHoliday) {
    const nowIST = dayjs().tz("Asia/Kolkata");
    console.log(
      `Today is marked as an NSE holiday. Skipping NSE sync. Current date: ${nowIST.format("YYYY-MM-DD")} IST`
    );
    return;
  }

  try {
    // Step 1: Fetch and sync instruments
    console.log("\n[Step 1/4] Fetching instruments from CSV...");
    const csvInstruments = await fetchInstrumentsFromCSV();
    console.log(`✓ Fetched ${csvInstruments.length} instruments from CSV`);

    console.log("\n[Step 2/4] Syncing instruments to database...");
    const { newInstruments, existingCount } = await syncInstrumentsToDb(csvInstruments);
    console.log(`✓ Instruments: ${newInstruments.length} new, ${existingCount} existing`);

    // Step 2: Get all instruments from DB
    console.log("\n[Step 3/4] Determining candle fetch requirements...");
    const allInstruments = await prisma.nseIntrument.findMany();
    console.log(`✓ Found ${allInstruments.length} total instruments in database`);

    // Step 3: Determine what candles to fetch
    const fetchRequests = await determineFetchRequests(allInstruments);
    console.log(`✓ Candle fetch requests: ${fetchRequests.length}`);

    if (fetchRequests.length === 0) {
      console.log("\n✓ No candles to fetch. All instruments are up to date.");
      return;
    }

    // Step 4: Fetch candles with rate limiting
    console.log("\n[Step 4/4] Fetching and storing candles...");
    const result = await fetchAndStoreCandles(fetchRequests);

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("NSE Sync Complete");
    console.log("=".repeat(60));
    console.log(`Instruments processed: ${allInstruments.length}`);
    console.log(`New instruments added: ${newInstruments.length}`);
    console.log(`Candles fetched: ${result.fetched}`);
    console.log(`Candles inserted: ${result.inserted}`);
    if (result.errors.length > 0) {
      console.log(`Errors: ${result.errors.length}`);
      console.log("\nError details:");
      result.errors.forEach((e) => console.log(`  - ${e.symbol}: ${e.error}`));
    }
    console.log("=".repeat(60));
  } catch (error) {
    console.error("\n" + "=".repeat(60));
    console.error("NSE Sync Failed");
    console.error("=".repeat(60));
    console.error("Error:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error("Stack:", error.stack);
    }
    console.error("=".repeat(60));
    throw error;
  }
}
