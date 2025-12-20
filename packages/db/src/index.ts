export { PrismaClient } from "./generated/prisma";
export type { QuoteData, ShortlistEntry } from "./types";

// Re-export model types
export type {
  ShortlistSnapshot,
  QuoteSnapshot,
  NiftyQuote,
  DeveloperToken,
} from "./generated/prisma";

// Re-export JsonValue type
export type {
  JsonValue,
  Decimal,
  InputJsonValue,
} from "./generated/prisma/runtime/library";

// Re-export enum types
export { ShortlistType } from "./generated/prisma";
