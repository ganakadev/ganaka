export { PrismaClient } from "./generated/prisma/index";
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

// Re-export the type for TypeScript
export { ShortlistType } from "./generated/prisma";
