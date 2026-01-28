import { PrismaClient } from "@ganaka/db/prisma";

const prismaClient = new PrismaClient();
export const prisma = prismaClient;
