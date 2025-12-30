/// <reference types="node" />
import { prisma } from "../../src/utils/prisma";
import { randomUUID } from "crypto";
import type { TestDataTracker } from "./test-tracker";

/**
 * Creates an admin user in the database and returns the token
 */
export async function createAdminUser(): Promise<string> {
  // Check if admin already exists
  const existingAdmin = await prisma.developer.findUnique({
    where: { username: "admin" },
  });

  if (existingAdmin) {
    return existingAdmin.token;
  }

  // Create admin user
  const admin = await prisma.developer.create({
    data: {
      username: "admin",
      token: randomUUID(),
    },
  });

  return admin.token;
}

/**
 * Creates a regular developer user in the database and returns the token
 */
export async function createDeveloperUser(
  username?: string,
  tracker?: TestDataTracker
): Promise<{ id: string; token: string; username: string }> {
  const developer = await prisma.developer.create({
    data: {
      username: username || `test-dev-${randomUUID()}`,
      token: randomUUID(),
    },
  });

  if (tracker) {
    tracker.trackDeveloper(developer.id);
  }

  return {
    id: developer.id,
    token: developer.token,
    username: developer.username,
  };
}

/**
 * Gets admin token from database
 */
export async function getAdminToken(): Promise<string | null> {
  const admin = await prisma.developer.findUnique({
    where: { username: "admin" },
  });
  return admin?.token || null;
}
