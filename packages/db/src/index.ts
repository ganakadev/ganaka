import { PrismaClient } from "@prisma/client";
import * as models from "./generated/prisma/models";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient | undefined;

function getPrisma(): PrismaClient {
  if (prismaInstance) {
    return prismaInstance;
  }

  try {
    prismaInstance = globalForPrisma.prisma ?? new PrismaClient();

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaInstance;
    }

    return prismaInstance;
  } catch (error) {
    console.error(
      "Failed to initialize Prisma Client. Please ensure:",
      "\n1. Prisma client is generated: pnpm --filter @ganaka-algos/db prisma:generate",
      "\n2. DATABASE_URL is set in .env",
      "\n3. Database is accessible"
    );
    throw error;
  }
}

// Export prisma as a Proxy to maintain the same API while enabling lazy initialization
const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const instance = getPrisma();
    const value = instance[prop as keyof PrismaClient];
    // Bind methods to the instance to ensure 'this' context is correct
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
}) as PrismaClient;

export { prisma };
export type { models };
export type { PrismaClient, Prisma } from "@prisma/client";
