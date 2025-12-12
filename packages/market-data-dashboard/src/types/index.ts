import { ShortlistType } from "@prisma/client";

export interface ShortlistEntry {
  nseSymbol: string;
  name: string;
  price: number;
}

export interface ShortlistSnapshotData {
  id: string;
  timestamp: Date;
  shortlistType: ShortlistType;
  entries: ShortlistEntry[];
  createdAt: Date;
}

export interface GroupedShortlist {
  date: string;
  timestamps: {
    timestamp: Date;
    shortlists: ShortlistSnapshotData[];
  }[];
}

export interface QuoteData {
  [key: string]: any; // Full quote payload from Groww API
}

export interface QuoteSnapshotData {
  id: string;
  timestamp: Date;
  nseSymbol: string;
  shortlistType: ShortlistType;
  quoteData: QuoteData;
  buyerControlPercentage: number | null;
  createdAt: Date;
}

export interface ApiShortlistsResponse {
  shortlist: ShortlistSnapshotData | null;
}

export interface ApiQuotesResponse {
  quote: QuoteSnapshotData | null;
}

export interface AvailableDatetimesResponse {
  dates: {
    date: string;
    timestamps: string[];
  }[];
}
