import { prisma } from "../src/utils/prisma";
import { cleanupAllGrowwTokenKeys, closeSharedRedisClient } from "./helpers/redis-helpers";

async function globalTeardown() {
  console.log("Starting global test teardown...");

  // log if database is not cleaned up
  const developerCount = await prisma.developer.count({
    where: {
      username: {
        not: "admin",
      },
    },
  });
  const niftyQuoteCount = await prisma.niftyQuote.count();
  const shortlistSnapshotCount = await prisma.shortlistSnapshot.count();
  const quoteSnapshotCount = await prisma.quoteSnapshot.count();
  const orderCount = await prisma.order.count();
  const runCount = await prisma.run.count();
  const collectorErrorCount = await prisma.collectorError.count();
  const sum =
    developerCount +
    niftyQuoteCount +
    shortlistSnapshotCount +
    quoteSnapshotCount +
    orderCount +
    runCount +
    collectorErrorCount;

  if (sum > 0) {
    const errorMessage = [
      "Database is not cleaned up. Test data remains:",
      `  - Developer count: ${developerCount}`,
      `  - Nifty quote count: ${niftyQuoteCount}`,
      `  - Shortlist snapshot count: ${shortlistSnapshotCount}`,
      `  - Quote snapshot count: ${quoteSnapshotCount}`,
      `  - Order count: ${orderCount}`,
      `  - Run count: ${runCount}`,
      `  - Collector error count: ${collectorErrorCount}`,
      `Total records remaining: ${sum}`,
    ].join("\n");
    throw new Error(errorMessage);
  }

  // Clean up any remaining Redis keys from tests
  console.log("Cleaning up Redis Groww token keys...");
  try {
    await cleanupAllGrowwTokenKeys();
  } catch (error) {
    // Log warning but don't fail teardown if Redis cleanup fails
    console.warn("Failed to clean up Redis keys during global teardown:", error);
  } finally {
    // Close the shared Redis connection
    await closeSharedRedisClient();
  }
}

export default globalTeardown;
