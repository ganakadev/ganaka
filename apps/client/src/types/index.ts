import type { growwQuoteSchema, shortlistSchema } from "@ganaka/schemas";
import { z } from "zod";

export type ShortlistEntry = z.infer<typeof shortlistSchema>;

// Type for shortlist entry with quote data and buyer control
export interface ShortlistEntryWithQuote extends ShortlistEntry {
  quoteData: z.infer<typeof growwQuoteSchema>;
  // Trade recommendation fields
  targetPrice?: number;
  stopLossPrice?: number;
  targetAchieved?: boolean;
  stopLossHit?: boolean;
  timeToTargetMinutes?: number;
  timeToStopLossMinutes?: number;
  targetTimestamp?: string;
  stopLossTimestamp?: string;
}

// Type for shortlist snapshot with entries
export interface ShortlistSnapshotWithEntries {
  id: string;
  timestamp: Date;
  shortlistType: "TOP_GAINERS" | "VOLUME_SHOCKERS";
  entries: ShortlistEntryWithQuote[];
}

// Type for run
export interface Run {
  id: string;
  startTime: Date;
  endTime: Date;
  completed: boolean;
  orderCount: number;
  name?: string | null;
  tags?: string[];
}

// Type for runs grouped by date
export type GroupedRuns = Record<string, Run[]>;

// Type for order
export interface Order {
  id: string;
  nseSymbol: string;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  timestamp: Date;
  runId: string;
  // Gain analysis fields
  targetGainPercentage?: number;
  targetAchieved?: boolean;
  targetGainPercentageActual?: number;
  timeToTargetMinutes?: number;
  targetTimestamp?: Date;
  dynamicTakeProfitPrice?: number;
  // Stop loss analysis fields
  stopLossHit?: boolean;
  stopLossTimestamp?: Date;
  timeToStopLossMinutes?: number;
}
