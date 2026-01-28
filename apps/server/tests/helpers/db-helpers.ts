/// <reference types="node" />
import { prisma } from "../../src/utils/prisma";
import { randomUUID } from "crypto";
import { encrypt, decrypt } from "../../src/utils/encryption";
import type {
  ShortlistType,
  ShortlistScope,
  QuoteSnapshot,
  ShortlistSnapshot,
  InputJsonValue,
  NiftyQuote,
} from "@ganaka/db";
import type { z } from "zod";
import {
  growwQuoteSchema,
  v1_developer_groww_schemas,
  v1_developer_lists_schemas,
} from "@ganaka/schemas";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Decimal } from "@ganaka/db/prisma";
import { createValidShortlistEntries } from "../fixtures/test-data";
import type { TestDataTracker } from "./test-tracker";
import { parseDateTimeInTimezone } from "../../src/utils/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Cleans up all test data from the database
 * IMPORTANT: This should only be called in global setup/teardown
 * For test-level cleanup, use TestDataTracker instead
 */
export async function cleanupDatabase(): Promise<void> {
  await prisma.order.deleteMany({});
  await prisma.run.deleteMany({});
  await prisma.quoteSnapshot.deleteMany({});
  await prisma.shortlistSnapshot.deleteMany({});
  await prisma.developer.deleteMany({});
  await prisma.niftyQuote.deleteMany({});
  await prisma.collectorError.deleteMany({});
}

/**
 * Cleans up tracked data using a TestDataTracker instance
 * This is called automatically by the test fixture after each test
 */
export async function cleanupTrackedData(tracker: TestDataTracker): Promise<void> {
  await tracker.cleanup();
}

/**
 * Seeds the database with test admin user
 */
export async function seedAdminUser(): Promise<{ id: string; token: string }> {
  // Check if admin exists
  let admin = await prisma.developer.findUnique({
    where: { username: "admin" },
  });

  if (!admin) {
    admin = await prisma.developer.create({
      data: {
        username: "admin",
        token: randomUUID(),
      },
    });
  }

  return {
    id: admin.id,
    token: admin.token,
  };
}

/**
 * Creates a test developer
 */
export async function createTestDeveloper(
  tracker: TestDataTracker,
  username?: string
): Promise<{
  id: string;
  username: string;
  token: string;
}> {
  // check if developer already exists
  const existingDeveloper = await prisma.developer.findUnique({
    where: { username: username || `test-dev-${Date.now()}` },
  });
  if (existingDeveloper) {
    if (tracker) {
      tracker.trackDeveloper(existingDeveloper.id);
    }
    return {
      id: existingDeveloper.id,
      username: existingDeveloper.username,
      token: existingDeveloper.token,
    };
  }

  const developer = await prisma.developer.create({
    data: {
      username: `${username}-${randomUUID()}` || `test-dev-${randomUUID()}`,
      token: randomUUID(),
    },
  });

  if (tracker) {
    tracker.trackDeveloper(developer.id);
  }

  return {
    id: developer.id,
    username: developer.username,
    token: developer.token,
  };
}

/**
 * Gets a developer by ID
 */
export async function getDeveloperById(id: string) {
  return prisma.developer.findUnique({
    where: { id },
  });
}

/**
 * Gets all developers
 */
export async function getAllDevelopers() {
  return prisma.developer.findMany();
}

// ==================== Snapshot Helpers ====================

/**
 * Creates a quote snapshot in DB with specific symbol, datetime, and quote data
 */
export async function createQuoteSnapshot(
  symbol: string,
  datetime: string,
  quoteData: z.infer<typeof growwQuoteSchema>,
  tracker: TestDataTracker,
  timezone?: string
) {
  const timestamp = parseDateTimeInTimezone(datetime, timezone || "Asia/Kolkata");

  const snapshot = await prisma.quoteSnapshot.create({
    data: {
      timestamp,
      nseSymbol: symbol,
      quoteData: quoteData as InputJsonValue,
    },
  });

  if (tracker) {
    tracker.trackQuoteSnapshot(snapshot.id);
  }

  return snapshot;
}

/**
 * Creates a NIFTY quote snapshot in DB with specific datetime, quote data, and day change percentage
 */
export async function createNiftyQuoteSnapshot(
  datetime: string,
  quoteData: z.infer<typeof growwQuoteSchema>,
  tracker: TestDataTracker,
  dayChangePerc: number = 0.5,
  timezone?: string
) {
  const timestamp = parseDateTimeInTimezone(datetime, timezone || "Asia/Kolkata");

  const snapshot = await prisma.niftyQuote.create({
    data: {
      timestamp,
      quoteData: quoteData as InputJsonValue,
      dayChangePerc: new Decimal(dayChangePerc),
    },
  });

  if (tracker) {
    tracker.trackNiftyQuote(snapshot.id);
  }

  return snapshot;
}

/**
 * Creates a shortlist snapshot in DB with specific type, datetime, and entries
 */
export async function createShortlistSnapshot(
  type: z.infer<typeof v1_developer_lists_schemas.getLists.query>["type"],
  datetime: string,
  entries: Array<z.infer<typeof v1_developer_lists_schemas.listSchema>>,
  tracker: TestDataTracker,
  timezone?: string,
  scope?: ShortlistScope
) {
  const timestamp = parseDateTimeInTimezone(datetime, timezone || "Asia/Kolkata");
  const shortlistType: ShortlistType = type === "top-gainers" ? "TOP_GAINERS" : "VOLUME_SHOCKERS";

  const snapshot = await prisma.shortlistSnapshot.create({
    data: {
      timestamp,
      shortlistType,
      entries: entries as InputJsonValue,
      scope: scope || "TOP_5",
    },
  });

  if (tracker) {
    tracker.trackShortlistSnapshot(snapshot.id);
  }

  return snapshot;
}

/**
 * Creates multiple quote snapshots for a symbol on a specific date (for timeline testing)
 */
export async function createMultipleQuoteSnapshots(
  symbol: string,
  date: string,
  count: number,
  tracker: TestDataTracker
): Promise<Array<Pick<QuoteSnapshot, "id" | "timestamp" | "nseSymbol">>> {
  // Parse the date string (YYYY-MM-DD format)
  const dateStr = dayjs.utc(date).format("YYYY-MM-DD");
  const snapshots: Array<Pick<QuoteSnapshot, "id" | "timestamp" | "nseSymbol">> = [];

  // Create snapshots at different times during market hours (9:15 AM - 3:30 PM IST)
  const startHour = 9;
  const startMinute = 15;
  const intervalMinutes = Math.floor((15 * 60 - 15) / count); // Distribute across market hours

  for (let i = 0; i < count; i++) {
    const minutes = startMinute + i * intervalMinutes;
    const hours = startHour + i;
    const finalMinutes = minutes % 60;

    // Create IST time using timezone plugin, then convert to UTC
    const istTime = dayjs.tz(
      `${dateStr} ${String(hours).padStart(2, "0")}:${String(finalMinutes).padStart(2, "0")}:00`,
      "Asia/Kolkata"
    );
    const utcTime = istTime.utc();

    const quoteData = {
      status: "SUCCESS" as const,
      payload: {
        average_price: 2500.0 + i * 10,
        bid_quantity: 100 + i * 10,
        bid_price: 2501.0 + i * 10,
        day_change: 25.5 + i,
        day_change_perc: 1.03 + i * 0.1,
        upper_circuit_limit: 2750.0,
        lower_circuit_limit: 2250.0,
        ohlc: {
          open: 2475.0 + i * 10,
          high: 2510.0 + i * 10,
          low: 2470.0 + i * 10,
          close: 2500.0 + i * 10,
        },
        depth: {
          buy: [{ price: 2500.0 + i * 10, quantity: 100 }],
          sell: [{ price: 2501.0 + i * 10, quantity: 100 }],
        },
        high_trade_range: null,
        implied_volatility: null,
        last_trade_quantity: 50,
        last_trade_time: utcTime.valueOf(),
        low_trade_range: null,
        last_price: 2500.0 + i * 10,
        market_cap: null,
        offer_price: null,
        offer_quantity: null,
        oi_day_change: 0,
        oi_day_change_percentage: 0,
        open_interest: null,
        previous_open_interest: null,
        total_buy_quantity: 1000,
        total_sell_quantity: 1200,
        volume: 50000 + i * 1000,
        week_52_high: 2800.0,
        week_52_low: 2200.0,
      },
    };

    const snapshot = await prisma.quoteSnapshot.create({
      data: {
        timestamp: utcTime.toDate(),
        nseSymbol: symbol,
        quoteData: quoteData as InputJsonValue,
      },
    });

    snapshots.push({
      id: snapshot.id,
      timestamp: snapshot.timestamp,
      nseSymbol: snapshot.nseSymbol,
    });

    if (tracker) {
      tracker.trackQuoteSnapshot(snapshot.id);
    }
  }

  return snapshots;
}

/**
 * Creates multiple NIFTY quote snapshots for testing
 */
export async function createMultipleNiftyQuoteSnapshots(
  date: string,
  count: number,
  tracker: TestDataTracker
): Promise<Array<Pick<NiftyQuote, "id" | "timestamp">>> {
  // Parse the date string (YYYY-MM-DD format)
  const dateStr = dayjs.utc(date).format("YYYY-MM-DD");
  const snapshots: Array<Pick<NiftyQuote, "id" | "timestamp">> = [];

  // Create snapshots at different times during market hours (9:15 AM - 3:30 PM IST)
  const startHour = 9;
  const startMinute = 15;
  const intervalMinutes = Math.floor((15 * 60 - 15) / count); // Distribute across market hours

  for (let i = 0; i < count; i++) {
    const minutes = startMinute + i * intervalMinutes;
    const hours = startHour + i;
    const finalMinutes = minutes % 60;

    // Create IST time using timezone plugin, then convert to UTC
    const istTime = dayjs.tz(
      `${dateStr} ${String(hours).padStart(2, "0")}:${String(finalMinutes).padStart(2, "0")}:00`,
      "Asia/Kolkata"
    );
    const utcTime = istTime.utc();

    const quoteData = {
      status: "SUCCESS" as const,
      payload: {
        average_price: 24000.0 + i * 100,
        bid_quantity: 1000 + i * 100,
        bid_price: 24001.0 + i * 100,
        day_change: 255.5 + i,
        day_change_perc: 1.08 + i * 0.1,
        upper_circuit_limit: 27500.0,
        lower_circuit_limit: 20500.0,
        ohlc: {
          open: 23750.0 + i * 100,
          high: 24100.0 + i * 100,
          low: 23700.0 + i * 100,
          close: 24000.0 + i * 100,
        },
        depth: {
          buy: [{ price: 24000.0 + i * 100, quantity: 1000 }],
          sell: [{ price: 24001.0 + i * 100, quantity: 1000 }],
        },
        high_trade_range: null,
        implied_volatility: null,
        last_trade_quantity: 500,
        last_trade_time: utcTime.valueOf(),
        low_trade_range: null,
        last_price: 24000.0 + i * 100,
        last_trade_volume: null,
        lower_circuit_limit_hit: false,
        market_cap: null,
        offer_price: null,
        offer_quantity: null,
        oi_day_change: 0,
        oi_day_change_percentage: 0,
        open_interest: null,
        previous_open_interest: null,
        total_buy_quantity: 10000,
        total_sell_quantity: 12000,
        volume: 500000 + i * 10000,
        week_52_high: 28000.0,
        week_52_low: 20000.0,
      },
    };

    const snapshot = await prisma.niftyQuote.create({
      data: {
        timestamp: utcTime.toDate(),
        quoteData: quoteData as InputJsonValue,
        dayChangePerc: 1.08 + i * 0.1,
      },
    });

    snapshots.push({
      id: snapshot.id,
      timestamp: snapshot.timestamp,
    });

    if (tracker) {
      tracker.trackNiftyQuote(snapshot.id);
    }
  }

  return snapshots;
}

/**
 * Retrieves a quote snapshot by ID for verification
 */
export async function getQuoteSnapshotById(id: string) {
  return prisma.quoteSnapshot.findUnique({
    where: { id },
  });
}

/**
 * Retrieves a shortlist snapshot by ID for verification
 */
export async function getShortlistSnapshotById(id: string) {
  return prisma.shortlistSnapshot.findUnique({
    where: { id },
  });
}

// ==================== Run and Order Helpers ====================

/**
 * Creates a test run for a developer
 */
export async function createRun(
  developerId: string,
  startTime: string,
  endTime: string,
  tracker: TestDataTracker,
  timezone?: string,
  name?: string | null,
  tags?: string[]
) {
  const tz = timezone || "Asia/Kolkata";
  const start = parseDateTimeInTimezone(startTime, tz);
  const end = parseDateTimeInTimezone(endTime, tz);

  const run = await prisma.run.create({
    data: {
      startTime: start,
      endTime: end,
      developerId: developerId,
      completed: false,
      name: name !== undefined ? name : null,
      tags: tags || [],
    },
  });

  if (tracker) {
    tracker.trackRun(run.id);
  }

  return run;
}

/**
 * Creates a test order for a run
 */
export async function createOrder(
  runId: string,
  nseSymbol: string,
  entryPrice: number,
  stopLossPrice: number,
  takeProfitPrice: number,
  timestamp: Date | string,
  tracker: TestDataTracker,
  timezone?: string
) {
  const tz = timezone || "Asia/Kolkata";
  const ts = typeof timestamp === "string" ? parseDateTimeInTimezone(timestamp, tz) : timestamp;

  const order = await prisma.order.create({
    data: {
      runId: runId,
      nseSymbol: nseSymbol,
      entryPrice: new Decimal(entryPrice),
      stopLossPrice: new Decimal(stopLossPrice),
      takeProfitPrice: new Decimal(takeProfitPrice),
      timestamp: ts,
    },
  });

  if (tracker) {
    tracker.trackOrder(order.id);
  }

  return order;
}

/**
 * Creates multiple shortlist snapshots for a date (for testing daily persistent/unique companies)
 */
export async function createMultipleShortlistSnapshots(
  type: z.infer<typeof v1_developer_lists_schemas.getLists.query>["type"],
  date: string,
  count: number,
  tracker: TestDataTracker,
  timezone?: string,
  scope?: ShortlistScope
): Promise<ShortlistSnapshot[]> {
  const tz = timezone || "Asia/Kolkata";
  const shortlistType: ShortlistType = type === "top-gainers" ? "TOP_GAINERS" : "VOLUME_SHOCKERS";
  const snapshots: ShortlistSnapshot[] = [];

  // Create snapshots at different times during market hours (9:15 AM - 3:30 PM IST)
  const startHour = 9;
  const startMinute = 15;
  const intervalMinutes = Math.floor((15 * 60 - 15) / count); // Distribute across market hours

  const entries = createValidShortlistEntries();

  for (let i = 0; i < count; i++) {
    const minutes = startMinute + i * intervalMinutes;
    const hours = startHour + Math.floor(minutes / 60);
    const finalMinutes = minutes % 60;

    // Create IST datetime string and convert to UTC Date
    const istDateTimeString = `${date}T${String(hours).padStart(2, "0")}:${String(
      finalMinutes
    ).padStart(2, "0")}:00`;
    const utcTime = parseDateTimeInTimezone(istDateTimeString, tz);

    const snapshot = await prisma.shortlistSnapshot.create({
      data: {
        timestamp: utcTime,
        shortlistType,
        entries: entries as InputJsonValue,
        scope: scope || "TOP_5",
      },
    });

    snapshots.push(snapshot);

    if (tracker) {
      tracker.trackShortlistSnapshot(snapshot.id);
    }
  }

  return snapshots;
}

/**
 * Creates shortlist snapshots with a specific number of unique companies across all snapshots
 * This is useful for testing unique company counts
 */
export async function createShortlistSnapshotsWithUniqueCompanies(
  type: z.infer<typeof v1_developer_lists_schemas.getLists.query>["type"],
  datetime: string,
  uniqueCompanyCount: number = 10,
  tracker: TestDataTracker,
  scope?: ShortlistScope
): Promise<ShortlistSnapshot[]> {
  const baseDate = dayjs.tz(datetime, "Asia/Kolkata").utc();
  const shortlistType: ShortlistType = type === "top-gainers" ? "TOP_GAINERS" : "VOLUME_SHOCKERS";
  const snapshots: ShortlistSnapshot[] = [];

  // Generate entries with the required number of unique companies
  // Start with the base 5 companies from createValidShortlistEntries
  const baseEntries = createValidShortlistEntries();
  const additionalCompanies = [
    { name: "Bharti Airtel Ltd", price: 1200.0, nseSymbol: "BHARTIARTL" },
    { name: "State Bank of India", price: 600.0, nseSymbol: "SBIN" },
    { name: "Bajaj Finance Ltd", price: 7500.0, nseSymbol: "BAJFINANCE" },
    { name: "Axis Bank Ltd", price: 1100.0, nseSymbol: "AXISBANK" },
    { name: "Wipro Ltd", price: 450.0, nseSymbol: "WIPRO" },
  ];

  // Combine to get exactly uniqueCompanyCount companies
  const allCompanies = baseEntries.concat(additionalCompanies).slice(0, uniqueCompanyCount);

  // Create snapshots with different subsets of companies
  // Distribute companies across snapshots to ensure all uniqueCompanyCount companies appear
  const snapshotsNeeded = Math.ceil(uniqueCompanyCount / 5); // Each snapshot can have up to 5 companies
  const startHour = 9;
  const startMinute = 15;
  const intervalMinutes = Math.floor((15 * 60 - 15) / snapshotsNeeded);

  for (let i = 0; i < snapshotsNeeded; i++) {
    const minutes = startMinute + i * intervalMinutes;
    const hours = startHour + Math.floor(minutes / 60);
    const finalMinutes = minutes % 60;

    // Distribute companies across snapshots
    // Each snapshot gets a subset, ensuring all companies appear across all snapshots
    const startIdx = i * 5;
    const endIdx = Math.min(startIdx + 5, uniqueCompanyCount);
    const snapshotEntries = allCompanies.slice(startIdx, endIdx);

    // If this is the last snapshot and we need more companies, add remaining companies
    if (i === snapshotsNeeded - 1 && endIdx < uniqueCompanyCount) {
      const remainingCompanies = allCompanies.slice(endIdx);
      for (const company of remainingCompanies) {
        snapshotEntries.push(company);
      }
    }

    const snapshot = await prisma.shortlistSnapshot.create({
      data: {
        timestamp: baseDate.toDate(),
        shortlistType,
        entries: snapshotEntries as InputJsonValue,
        scope: scope || "TOP_5",
      },
    });

    snapshots.push(snapshot);

    if (tracker) {
      tracker.trackShortlistSnapshot(snapshot.id);
    }
  }

  return snapshots;
}

/**
 * Gets a run by ID for verification
 */
export async function getRunById(runId: string) {
  return prisma.run.findUnique({
    where: { id: runId },
  });
}

/**
 * Gets an order by ID for verification
 */
export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
  });
}

// ==================== Developer Groww Credentials Helpers ====================

/**
 * Creates a test developer with Groww credentials
 * Credentials are encrypted before saving to database
 */
export async function createTestDeveloperWithGrowwCredentials(
  tracker: TestDataTracker,
  username?: string,
  growwApiKey?: string,
  growwApiSecret?: string
): Promise<{
  id: string;
  username: string;
  token: string;
  growwApiKey: string | null;
  growwApiSecret: string | null;
}> {
  // Encrypt credentials before saving
  const encryptedApiKey = encrypt(growwApiKey);
  const encryptedApiSecret = encrypt(growwApiSecret);

  const developer = await prisma.developer.create({
    data: {
      username: username || `test-dev-${Date.now()}-${randomUUID()}`,
      token: randomUUID(),
      growwApiKey: encryptedApiKey,
      growwApiSecret: encryptedApiSecret,
    },
  });

  if (tracker) {
    tracker.trackDeveloper(developer.id);
  }

  // Return decrypted values for test convenience
  return {
    id: developer.id,
    username: developer.username,
    token: developer.token,
    growwApiKey: growwApiKey || null,
    growwApiSecret: growwApiSecret || null,
  };
}

/**
 * Gets developer Groww credentials by ID (for verification)
 * Returns decrypted values
 */
export async function getDeveloperGrowwCredentials(developerId: string) {
  const developer = await prisma.developer.findUnique({
    where: { id: developerId },
    select: {
      growwApiKey: true,
      growwApiSecret: true,
    },
  });

  if (!developer) {
    return null;
  }

  // Decrypt values after reading from database
  const decryptedApiKey = decrypt(developer.growwApiKey);
  const decryptedApiSecret = decrypt(developer.growwApiSecret);

  return {
    growwApiKey: decryptedApiKey,
    growwApiSecret: decryptedApiSecret,
  };
}

/**
 * Gets raw encrypted developer Groww credentials from database (for testing encryption)
 * Returns encrypted values as stored in database
 */
export async function getDeveloperGrowwCredentialsRaw(developerId: string) {
  const developer = await prisma.developer.findUnique({
    where: { id: developerId },
    select: {
      growwApiKey: true,
      growwApiSecret: true,
    },
  });

  if (!developer) {
    return null;
  }

  return {
    growwApiKey: developer.growwApiKey,
    growwApiSecret: developer.growwApiSecret,
  };
}

/**
 * Checks if a value appears to be encrypted (format: iv:authTag:encryptedData)
 */
export function isEncrypted(value: string | null): boolean {
  if (!value) {
    return false;
  }
  // Encrypted format: {iv}:{authTag}:{encryptedData} (all base64)
  const parts = value.split(":");
  return parts.length === 3;
}
