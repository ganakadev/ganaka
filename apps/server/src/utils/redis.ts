import { FastifyInstance } from "fastify";
import Redis from "ioredis";

export class RedisManager {
  public redis: Redis;
  private fastify: FastifyInstance;
  private static instance: RedisManager | null = null;

  private constructor(fastify: FastifyInstance) {
    this.fastify = fastify;

    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error("REDIS_URL is not set");
    }
    this.redis = new Redis(redisUrl);

    this.redis.on("error", (error) => {
      fastify.log.error(error, "Redis connection error");
    });
    this.redis.on("connect", () => {
      fastify.log.info("Connected to Redis");
    });
  }

  static getInstance(fastify: FastifyInstance): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager(fastify);
    }
    return RedisManager.instance;
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }

  async close(): Promise<void> {
    // Check if connection is already closed or closing
    if (this.redis.status === "end" || this.redis.status === "close") {
      return;
    }

    try {
      await this.redis.quit();
      this.fastify.log.info("Redis connection closed");
    } catch (error) {
      // If connection is already closed, ignore the error
      if (
        error instanceof Error &&
        error.message.includes("Connection is closed")
      ) {
        this.fastify.log.info("Redis connection already closed");
        return;
      }
      // Re-throw other errors
      throw error;
    }
  }
}
