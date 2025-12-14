import {
  Prisma,
  ShortlistSnapshot,
  QuoteSnapshot,
  ShortlistType,
} from "@ganaka-algos/db";

// Re-export Prisma types for convenience
export type { ShortlistSnapshot, QuoteSnapshot, ShortlistType };

// ShortlistEntry represents the structure of items in the entries JSON array
export interface ShortlistEntry {
  nseSymbol: string;
  name: string;
  price: number;
  quoteData: QuoteData | null;
  buyerControlPercentage?: number | null;
}

// QuoteData represents the JSON structure from Groww API
export type QuoteData = Prisma.JsonValue;

// GroupedShortlist is a derived/transformed type, not a database type
export interface GroupedShortlist {
  date: string;
  timestamps: {
    timestamp: Date;
    shortlists: ShortlistSnapshot[];
  }[];
}

// API response types (not database types)
export interface ApiShortlistsResponse {
  shortlist: ShortlistSnapshot | null;
}

export interface AvailableDatetimesResponse {
  dates: {
    date: string;
    timestamps: string[];
  }[];
}

export interface DailyPersistentCompaniesResponse {
  date: string;
  type: ShortlistType;
  totalSnapshots: number;
  companies: Array<{
    nseSymbol: string;
    name: string;
    count: number;
    percentage: number;
  }>;
}

export interface DailyUniqueCompaniesResponse {
  date: string;
  type: ShortlistType;
  uniqueCount: number;
}
