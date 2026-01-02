import { prisma } from "../src/utils/prisma";

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
}

export default globalTeardown;
