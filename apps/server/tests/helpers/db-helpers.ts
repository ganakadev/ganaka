import { prisma } from "../../src/utils/prisma";
import { randomUUID } from "crypto";
import type { ShortlistType, QuoteSnapshot, ShortlistSnapshot } from "@ganaka/db";
import type { z } from "zod";
import { v1_developer_groww_schemas, v1_developer_lists_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Decimal } from "@ganaka/db/prisma";
import { createValidShortlistEntries } from "../fixtures/test-data";

dayjs.extend(utc);

/**
 * Cleans up all test data from the database
 * IMPORTANT: This should be called after each test suite
 */
export async function cleanupDatabase(): Promise<void> {
  // Delete in order to respect foreign key constraints
  await prisma.order.deleteMany({});
  await prisma.run.deleteMany({});
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
export async function createTestDeveloper(username?: string): Promise<{
  id: string;
  username: string;
  token: string;
}> {
  // check if developer already exists
  const existingDeveloper = await prisma.developer.findUnique({
    where: { username: username || `test-dev-${Date.now()}` },
  });
  if (existingDeveloper) {
    return {
      id: existingDeveloper.id,
      username: existingDeveloper.username,
      token: existingDeveloper.token,
    };
  }

  const developer = await prisma.developer.create({
    data: {
      username: username || `test-dev-${Date.now()}`,
      token: randomUUID(),
    },
  });

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
  quoteData: z.infer<typeof v1_developer_groww_schemas.growwQuoteSchema>
) {
  const timestamp = dayjs(datetime).utc().toDate();

  const snapshot = await prisma.quoteSnapshot.create({
    data: {
      id: randomUUID(),
      timestamp,
      nseSymbol: symbol,
      quoteData: quoteData as any,
    },
  });

  return snapshot;
}

/**
 * Creates a shortlist snapshot in DB with specific type, datetime, and entries
 */
export async function createShortlistSnapshot(
  type: z.infer<typeof v1_developer_lists_schemas.getLists.query>["type"],
  datetime: string,
  entries: Array<z.infer<typeof v1_developer_lists_schemas.listSchema>>
) {
  const timestamp = dayjs(datetime).utc().toDate();
  const shortlistType: ShortlistType = type === "top-gainers" ? "TOP_GAINERS" : "VOLUME_SHOCKERS";

  const snapshot = await prisma.shortlistSnapshot.create({
    data: {
      id: randomUUID(),
      timestamp,
      shortlistType,
      entries: entries as any,
    },
  });

  return snapshot;
}

/**
 * Creates multiple quote snapshots for a symbol on a specific date (for timeline testing)
 */
export async function createMultipleQuoteSnapshots(
  symbol: string,
  date: string,
  count: number
): Promise<Array<Pick<QuoteSnapshot, "id" | "timestamp" | "nseSymbol">>> {
  const baseDate = dayjs(date).utc();
  const snapshots: Array<Pick<QuoteSnapshot, "id" | "timestamp" | "nseSymbol">> = [];

  // Create snapshots at different times during market hours (9:15 AM - 3:30 PM IST)
  const startHour = 9;
  const startMinute = 15;
  const intervalMinutes = Math.floor((15 * 60 - 15) / count); // Distribute across market hours

  for (let i = 0; i < count; i++) {
    const minutes = startMinute + i * intervalMinutes;
    const hours = startHour + Math.floor(minutes / 60);
    const finalMinutes = minutes % 60;

    // Convert IST to UTC (IST is UTC+5:30)
    const istTime = baseDate.hour(hours).minute(finalMinutes).second(0);
    const utcTime = istTime.subtract(5, "hour").subtract(30, "minute");

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
        id: randomUUID(),
        timestamp: utcTime.toDate(),
        nseSymbol: symbol,
        quoteData: quoteData as any,
      },
    });

    snapshots.push({
      id: snapshot.id,
      timestamp: snapshot.timestamp,
      nseSymbol: snapshot.nseSymbol,
    });
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
  startTime: Date | string,
  endTime: Date | string
) {
  const start = typeof startTime === "string" ? new Date(startTime) : startTime;
  const end = typeof endTime === "string" ? new Date(endTime) : endTime;

  const run = await prisma.run.create({
    data: {
      id: randomUUID(),
      startTime: start,
      endTime: end,
      developerId: developerId,
      completed: false,
    },
  });

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
  timestamp: Date | string
) {
  const ts = typeof timestamp === "string" ? new Date(timestamp) : timestamp;

  const order = await prisma.order.create({
    data: {
      id: randomUUID(),
      runId: runId,
      nseSymbol: nseSymbol,
      entryPrice: new Decimal(entryPrice),
      stopLossPrice: new Decimal(stopLossPrice),
      takeProfitPrice: new Decimal(takeProfitPrice),
      timestamp: ts,
    },
  });

  return order;
}

/**
 * Creates multiple shortlist snapshots for a date (for testing daily persistent/unique companies)
 */
export async function createMultipleShortlistSnapshots(
  type: z.infer<typeof v1_developer_lists_schemas.getLists.query>["type"],
  date: string,
  count: number
): Promise<ShortlistSnapshot[]> {
  const baseDate = dayjs(date).utc();
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

    // Convert IST to UTC (IST is UTC+5:30)
    const istTime = baseDate.hour(hours).minute(finalMinutes).second(0);
    const utcTime = istTime.subtract(5, "hour").subtract(30, "minute");

    const snapshot = await prisma.shortlistSnapshot.create({
      data: {
        id: randomUUID(),
        timestamp: utcTime.toDate(),
        shortlistType,
        entries: entries as any,
      },
    });

    snapshots.push(snapshot);
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
