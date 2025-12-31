import type { ShortlistType } from "./generated/prisma";

export {
  type ShortlistSnapshot,
  type QuoteSnapshot,
  type NiftyQuote,
  type Developer,
  type ShortlistType,
} from "./generated/prisma";
export {
  type Decimal,
  type JsonValue,
  type InputJsonValue,
} from "./generated/prisma/runtime/library";

// we have to re-define and export this
// because this package is used within the schemas package
// which is also used in the client package, which leads to
// errors when trying to import the schemas package in the client package
export const shortlistTypeEnum = [
  "TOP_GAINERS",
  "VOLUME_SHOCKERS",
] as const satisfies readonly ShortlistType[];
