// Re-export types from @ganaka/db for convenience
import type { QuoteData, ShortlistEntry } from "@ganaka/db";

export type { QuoteData, ShortlistEntry };

// Type for shortlist entry with quote data and buyer control
export interface ShortlistEntryWithQuote extends ShortlistEntry {
  quoteData: QuoteData;
  buyerControlPercentage: number;
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
}
