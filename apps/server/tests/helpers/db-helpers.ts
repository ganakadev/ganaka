import { prisma } from "../../src/utils/prisma";
import { randomUUID } from "crypto";

/**
 * Cleans up all test data from the database
 * IMPORTANT: This should be called after each test suite
 */
export async function cleanupDatabase(): Promise<void> {
  // Delete in order to respect foreign key constraints
  await prisma.order.deleteMany({});
  await prisma.run.deleteMany({});
}

/**
 * Seeds the database with test admin user
 */
export async function seedAdminUser(): Promise<{ id: string; token: string }> {
  // Check if admin exists
  let admin = await prisma.developer.findUnique({
    where: { username: "admin" },
  });

  if (!admin) {
    admin = await prisma.developer.create({
      data: {
        username: "admin",
        token: randomUUID(),
      },
    });
  }

  return {
    id: admin.id,
    token: admin.token,
  };
}

/**
 * Creates a test developer
 */
export async function createTestDeveloper(username?: string): Promise<{
  id: string;
  username: string;
  token: string;
}> {
  // check if developer already exists
  const existingDeveloper = await prisma.developer.findUnique({
    where: { username: username || `test-dev-${Date.now()}` },
  });
  if (existingDeveloper) {
    return {
      id: existingDeveloper.id,
      username: existingDeveloper.username,
      token: existingDeveloper.token,
    };
  }

  const developer = await prisma.developer.create({
    data: {
      username: username || `test-dev-${Date.now()}`,
      token: randomUUID(),
    },
  });

  return {
    id: developer.id,
    username: developer.username,
    token: developer.token,
  };
}

/**
 * Gets a developer by ID
 */
export async function getDeveloperById(id: string) {
  return prisma.developer.findUnique({
    where: { id },
  });
}

/**
 * Gets all developers
 */
export async function getAllDevelopers() {
  return prisma.developer.findMany();
}
