import { promises as fs } from "fs";
import { join } from "path";
import { logger } from "./logger";

export interface MarketDepthData {
  nseSymbol: string;
  instrument: string;
  buyDepth: Array<{ price: number; quantity: number }>;
  sellDepth: Array<{ price: number; quantity: number }>;
  stopLossPrice: number;
  takeProfitPrice: number;
  entryPrice: number;
  currentPrice: number;
  timestamp: number | string | Date;
}

export class MarketDepthWriter {
  private filePath: string;
  private initialized: boolean = false;
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(projectRoot: string) {
    const activityDir = join(projectRoot, "activity");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `activity-${timestamp}.json`;
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

      // Initialize file with empty array
      await fs.writeFile(this.filePath, JSON.stringify([], null, 2), "utf-8");
      this.initialized = true;
      logger.debug(`Market depth writer initialized at ${this.filePath}`);
    } catch (error) {
      logger.error(`Failed to initialize market depth writer: ${error}`);
      throw error;
    }
  }

  async write(data: MarketDepthData): Promise<void> {
    // Chain this write operation to the queue to ensure sequential execution
    this.writeQueue = this.writeQueue.then(async () => {
      if (!this.initialized) {
        await this.initialize();
      }

      try {
        // Read existing file
        const fileContent = await fs.readFile(this.filePath, "utf-8");
        const entries: MarketDepthData[] = JSON.parse(fileContent);

        // Normalize timestamp to ISO string
        const normalizedData: MarketDepthData = {
          ...data,
          timestamp:
            data.timestamp instanceof Date
              ? data.timestamp.toISOString()
              : typeof data.timestamp === "number"
              ? new Date(data.timestamp).toISOString()
              : data.timestamp,
        };

        // Append new entry
        entries.push(normalizedData);

        // Write back to file
        await fs.writeFile(
          this.filePath,
          JSON.stringify(entries, null, 2),
          "utf-8"
        );
        logger.debug(`Market depth data written to ${this.filePath}`);
      } catch (error) {
        logger.error(`Failed to write market depth data: ${error}`);
        throw error;
      }
    });

    // Wait for this write operation to complete
    await this.writeQueue;
  }
}
