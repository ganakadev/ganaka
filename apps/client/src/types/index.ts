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
