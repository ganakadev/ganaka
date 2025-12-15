export { PrismaClient } from "./generated/prisma/client";
export type { QuoteData, ShortlistEntry } from "./types";

// Re-export model types
export type {
  ShortlistSnapshot,
  QuoteSnapshot,
  NiftyQuote,
} from "./generated/prisma/client";

// Re-export JsonValue type
export type {
  JsonValue,
  Decimal,
  InputJsonValue,
} from "./generated/prisma/runtime/library";

// Re-export enum types
export { ShortlistType } from "./generated/prisma/client";
