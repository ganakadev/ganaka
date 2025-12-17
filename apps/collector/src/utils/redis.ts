import Redis from "ioredis";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export class RedisManager {
  public redis: Redis;
  private static instance: RedisManager | null = null;

  private constructor() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error("REDIS_URL is not set");
    }
    this.redis = new Redis(redisUrl);

    this.redis.on("error", (error) => {
      console.error("Redis connection error:", error);
    });

    this.redis.on("connect", () => {
      console.log("Connected to Redis");
    });
  }

  static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }

  async close(): Promise<void> {
    await this.redis.quit();
    console.log("Redis connection closed");
    RedisManager.instance = null;
  }

  /**
   * Generate Redis key for daily bucket with format: collector:daily-bucket:YYYY-MM-DD
   * Uses IST date for consistency with collection window
   */
  getDailyBucketKey(date: Date): string {
    const istDate = dayjs(date).tz("Asia/Kolkata");
    const dateStr = istDate.format("YYYY-MM-DD");
    return `collector:daily-bucket:${dateStr}`;
  }

  /**
   * Calculate TTL in seconds until end of day (23:59:59 IST)
   */
  private calculateTTLUntilEndOfDay(date: Date): number {
    const nowIST = dayjs(date).tz("Asia/Kolkata");
    const endOfDayIST = nowIST.endOf("day");
    const secondsUntilEnd = endOfDayIST.diff(nowIST, "second");
    // Add 1 second buffer to ensure it expires at the start of next day
    return secondsUntilEnd + 1;
  }

  /**
   * Get current bucket as Set of symbols
   */
  async getDailyBucket(date: Date): Promise<Set<string>> {
    const key = this.getDailyBucketKey(date);
    const members = await this.redis.smembers(key);
    return new Set(members);
  }

  /**
   * Add new symbols to bucket and set TTL if key is new
   */
  async addToDailyBucket(date: Date, symbols: string[]): Promise<void> {
    if (symbols.length === 0) {
      return;
    }

    const key = this.getDailyBucketKey(date);

    // Check if key exists to determine if we need to set TTL
    const exists = await this.redis.exists(key);

    // Add symbols to set
    if (symbols.length > 0) {
      await this.redis.sadd(key, ...symbols);
    }

    // Set TTL if this is a new key
    if (!exists) {
      const ttl = this.calculateTTLUntilEndOfDay(date);
      await this.redis.expire(key, ttl);
    }
  }

  /**
   * Get all symbols from daily bucket
   */
  async getAllFromDailyBucket(date: Date): Promise<string[]> {
    const key = this.getDailyBucketKey(date);
    const members = await this.redis.smembers(key);
    return members;
  }
}
