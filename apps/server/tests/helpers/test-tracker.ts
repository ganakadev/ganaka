import { prisma } from "../../src/utils/prisma";

/**
 * Tracks database entities created during a test for selective cleanup
 */
export class TestDataTracker {
  private developerIds: string[] = [];
  private runIds: string[] = [];
  private orderIds: string[] = [];
  private quoteSnapshotIds: string[] = [];
  private shortlistSnapshotIds: string[] = [];
  private niftyQuoteIds: string[] = [];
  private collectorErrorIds: string[] = [];

  /**
   * Track a developer ID (excluding admin user)
   */
  trackDeveloper(id: string): void {
    this.developerIds.push(id);
  }

  /**
   * Track a run ID
   */
  trackRun(id: string): void {
    this.runIds.push(id);
  }

  /**
   * Track an order ID
   */
  trackOrder(id: string): void {
    this.orderIds.push(id);
  }

  /**
   * Track a quote snapshot ID
   */
  trackQuoteSnapshot(id: string): void {
    this.quoteSnapshotIds.push(id);
  }

  /**
   * Track a shortlist snapshot ID
   */
  trackShortlistSnapshot(id: string): void {
    this.shortlistSnapshotIds.push(id);
  }

  /**
   * Track a nifty quote ID
   */
  trackNiftyQuote(id: string): void {
    this.niftyQuoteIds.push(id);
  }

  /**
   * Track a collector error ID
   */
  trackCollectorError(id: string): void {
    this.collectorErrorIds.push(id);
  }

  /**
   * Clean up all tracked data from the database
   * Deletes in order to respect foreign key constraints:
   * 1. Orders (depend on runs)
   * 2. Runs (depend on developers)
   * 3. Snapshots (independent)
   * 4. Developers (excluding admin)
   * 5. Other entities
   */
  async cleanup(): Promise<void> {
    // Delete orders first (they reference runs)
    if (this.orderIds.length > 0) {
      await prisma.order.deleteMany({
        where: { id: { in: this.orderIds } },
      });
    }

    // Delete runs (they reference developers)
    if (this.runIds.length > 0) {
      await prisma.run.deleteMany({
        where: { id: { in: this.runIds } },
      });
    }

    // Delete quote snapshots
    if (this.quoteSnapshotIds.length > 0) {
      await prisma.quoteSnapshot.deleteMany({
        where: { id: { in: this.quoteSnapshotIds } },
      });
    }

    // Delete shortlist snapshots
    if (this.shortlistSnapshotIds.length > 0) {
      await prisma.shortlistSnapshot.deleteMany({
        where: { id: { in: this.shortlistSnapshotIds } },
      });
    }

    // Delete nifty quotes
    if (this.niftyQuoteIds.length > 0) {
      await prisma.niftyQuote.deleteMany({
        where: { id: { in: this.niftyQuoteIds } },
      });
    }

    // Delete collector errors
    if (this.collectorErrorIds.length > 0) {
      await prisma.collectorError.deleteMany({
        where: { id: { in: this.collectorErrorIds } },
      });
    }

    // Delete developers (excluding admin user)
    if (this.developerIds.length > 0) {
      await prisma.developer.deleteMany({
        where: {
          id: { in: this.developerIds },
          username: { not: "admin" },
        },
      });
    }
  }

  /**
   * Clear all tracked IDs without deleting from database
   * Useful for resetting tracker state
   */
  clear(): void {
    this.developerIds = [];
    this.runIds = [];
    this.orderIds = [];
    this.quoteSnapshotIds = [];
    this.shortlistSnapshotIds = [];
    this.niftyQuoteIds = [];
    this.collectorErrorIds = [];
  }
}
