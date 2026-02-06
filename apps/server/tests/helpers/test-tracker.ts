import { prisma } from "../../src/utils/prisma";

/**
 * Tracks database entities created during a test for selective cleanup
 */
export class TestDataTracker {
  private developerIds: string[] = [];
  private runIds: string[] = [];
  private orderIds: string[] = [];
  private shortlistSnapshotIds: string[] = [];
  private collectorErrorIds: string[] = [];
  private nseHolidayIds: string[] = [];
  private nseInstrumentIds: number[] = [];
  private nseCandleIds: number[] = [];

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
   * Track a shortlist snapshot ID
   */
  trackShortlistSnapshot(id: string): void {
    this.shortlistSnapshotIds.push(id);
  }

  /**
   * Track a collector error ID
   */
  trackCollectorError(id: string): void {
    this.collectorErrorIds.push(id);
  }

  /**
   * Track an NSE holiday ID
   */
  trackNseHoliday(id: string): void {
    this.nseHolidayIds.push(id);
  }

  /**
   * Track an NSE instrument ID
   */
  trackNseInstrument(id: number): void {
    this.nseInstrumentIds.push(id);
  }

  /**
   * Track an NSE candle ID
   */
  trackNseCandle(id: number): void {
    this.nseCandleIds.push(id);
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

    // Delete shortlist snapshots
    if (this.shortlistSnapshotIds.length > 0) {
      await prisma.shortlistSnapshot.deleteMany({
        where: { id: { in: this.shortlistSnapshotIds } },
      });
    }

    // Delete collector errors
    if (this.collectorErrorIds.length > 0) {
      await prisma.collectorError.deleteMany({
        where: { id: { in: this.collectorErrorIds } },
      });
    }

    // Delete NSE holidays
    if (this.nseHolidayIds.length > 0) {
      await prisma.nseHoliday.deleteMany({
        where: { id: { in: this.nseHolidayIds } },
      });
    }

    // Delete NSE candles (they reference instruments)
    if (this.nseCandleIds.length > 0) {
      await prisma.nseCandle.deleteMany({
        where: { id: { in: this.nseCandleIds } },
      });
    }

    // Delete NSE instruments (they reference candles)
    if (this.nseInstrumentIds.length > 0) {
      await prisma.nseIntrument.deleteMany({
        where: { id: { in: this.nseInstrumentIds } },
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
    this.shortlistSnapshotIds = [];
    this.collectorErrorIds = [];
    this.nseHolidayIds = [];
    this.nseInstrumentIds = [];
    this.nseCandleIds = [];
  }
}
