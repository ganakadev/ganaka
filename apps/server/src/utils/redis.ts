import { FastifyInstance } from "fastify";
import Redis from "ioredis";

export class RedisManager {
  public redis: Redis;
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
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

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }

  async close(): Promise<void> {
    await this.redis.quit();
    this.fastify.log.info("Redis connection closed");
  }
}
