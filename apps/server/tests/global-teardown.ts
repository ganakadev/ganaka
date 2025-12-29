import { cleanupDatabase } from "./helpers/db-helpers";

async function globalTeardown() {
  console.log("Starting global test teardown...");

  // Clean up database
  console.log("Cleaning up test database...");
  await cleanupDatabase();
  console.log("Database cleanup completed");
}

export default globalTeardown;
