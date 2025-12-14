import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

try {
  prisma = globalForPrisma.prisma ?? new PrismaClient();

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
} catch (error) {
  console.error(
    "Failed to initialize Prisma Client. Please ensure:",
    "\n1. Prisma client is generated: pnpm --filter @ganaka-algos/db prisma:generate",
    "\n2. DATABASE_URL is set in .env",
    "\n3. Database is accessible"
  );
  throw error;
}

export { prisma };
export type {
  PrismaClient,
  Prisma,
  ShortlistSnapshot,
  QuoteSnapshot,
  ShortlistType,
  NiftyQuote,
} from "@prisma/client";
export type { JsonValue } from "@prisma/client/runtime/library";
