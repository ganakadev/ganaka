import { promises as fs } from "fs";
import { join } from "path";
import { logger } from "./logger";
import { generateDashboardHTML } from "./dashboard-generator";

export interface PlaceOrderData {
  nseSymbol: string;
  instrument: string;
  buyDepth: Array<{ price: number; quantity: number }>;
  sellDepth: Array<{ price: number; quantity: number }>;
  stopLossPrice: number;
  takeProfitPrice: number;
  entryPrice: number;
  currentPrice: number;
  buyerControlOfStockPercentage: number;
  timestamp: number | string | Date;
}

export class MarketDepthWriter {
  private filePath: string;
  private initialized: boolean = false;
  private writeQueue: Promise<void> = Promise.resolve();
  private entries: PlaceOrderData[] = [];

  constructor(projectRoot: string) {
    const activityDir = join(projectRoot, "activity");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `activity-${timestamp}.html`;
    this.filePath = join(activityDir, fileName);
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Create activity directory if it doesn't exist
      const activityDir = join(this.filePath, "..");
      await fs.mkdir(activityDir, { recursive: true });

      // Initialize with empty dashboard
      const html = generateDashboardHTML([]);
      await fs.writeFile(this.filePath, html, "utf-8");
      this.initialized = true;
      logger.debug(`Market depth writer initialized at ${this.filePath}`);
    } catch (error) {
      logger.error(`Failed to initialize market depth writer: ${error}`);
      throw error;
    }
  }

  async write(data: PlaceOrderData): Promise<void> {
    // Chain this write operation to the queue to ensure sequential execution
    this.writeQueue = this.writeQueue.then(async () => {
      if (!this.initialized) {
        await this.initialize();
      }

      try {
        // Normalize timestamp to ISO string
        const normalizedData: PlaceOrderData = {
          ...data,
          timestamp:
            data.timestamp instanceof Date
              ? data.timestamp.toISOString()
              : typeof data.timestamp === "number"
              ? new Date(data.timestamp).toISOString()
              : data.timestamp,
        };

        // Append new entry to in-memory array
        this.entries.push(normalizedData);

        // Generate HTML dashboard with all entries
        const html = generateDashboardHTML(this.entries);

        // Write HTML dashboard to file
        await fs.writeFile(this.filePath, html, "utf-8");
        logger.debug(`Market depth dashboard written to ${this.filePath}`);
      } catch (error) {
        logger.error(`Failed to write market depth data: ${error}`);
        throw error;
      }
    });

    // Wait for this write operation to complete
    await this.writeQueue;
  }
}
