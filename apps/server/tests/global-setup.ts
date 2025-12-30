/// <reference types="node" />
import { cleanupDatabase, seedAdminUser } from "./helpers/db-helpers";
import { ensureTestServerRunning } from "./helpers/test-setup";

async function globalSetup() {
  console.log("Starting global test setup...");

  // Clean up database first
  console.log("Cleaning up test database...");
  await cleanupDatabase();

  // Seed admin user
  console.log("Seeding admin user...");
  const admin = await seedAdminUser();
  console.log(`Admin user created with token: ${admin.token.substring(0, 8)}...`);

  // Check if test server is running
  console.log("Checking if test server is running...");
  await ensureTestServerRunning();
  console.log("Test server is running");

  // Store admin token in environment for tests to use
  process.env.TEST_ADMIN_TOKEN = admin.token;
}

export default globalSetup;
