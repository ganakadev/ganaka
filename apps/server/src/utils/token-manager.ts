import axios, { AxiosResponse } from "axios";
import Redis from "ioredis";
import { FastifyInstance } from "fastify";

const REDIS_KEY = "groww:token";

export class TokenManager {
  private redis: Redis;
  private tokenGenerationInProgress: Promise<string> | null = null;
  private fastify: FastifyInstance;

  constructor(redis: Redis, fastify: FastifyInstance) {
    this.redis = redis;
    this.fastify = fastify;
  }

  /**
   * Check if the token is valid by making a request to the Groww API
   */
  async checkIfTokenIsValid(token: string): Promise<boolean> {
    try {
      const response = await axios.get("https://api.groww.in/v1/order/list", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          segment: "CASH",
          page: 0,
          page_size: 1,
        },
      });
      return response.status === 200;
    } catch (error) {
      this.fastify.log.error("Token validation failed");
      return false;
    }
  }

  /**
   * Get the access token from Redis, or generate a new one if missing
   */
  async getToken(): Promise<string> {
    try {
      // Check Redis first
      const cachedToken = await this.redis.get(REDIS_KEY);
      if (cachedToken) {
        const isValid = await this.checkIfTokenIsValid(cachedToken);
        if (!isValid) {
          await this.invalidateToken();
          return this.getToken();
        }
        return cachedToken;
      }

      // If token generation is already in progress, wait for it
      if (this.tokenGenerationInProgress) {
        return this.tokenGenerationInProgress;
      }

      // Generate new token
      this.tokenGenerationInProgress = this.generateNewToken();
      try {
        const token = await this.tokenGenerationInProgress;
        return token;
      } finally {
        this.tokenGenerationInProgress = null;
      }
    } catch (error) {
      console.error("Failed to get access token:", error);
      throw error;
    }
  }

  /**
   * Generate a new access token and store it in Redis
   */
  private async generateNewToken(): Promise<string> {
    this.fastify.log.info(
      "######################### Generating new token #########################"
    );

    const apiKey = process.env.GROWW_API_KEY;
    const apiSecret = process.env.GROWW_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error("GROWW_API_KEY and GROWW_API_SECRET are required");
    }

    try {
      const response = (await axios.post(
        "https://groww-access-token-generator.onrender.com",
        {
          api_key: apiKey,
          api_secret: apiSecret,
        }
      )) as AxiosResponse<{ access_token: string }>;

      const token = response.data.access_token;

      // Store in Redis (no expiration - we'll handle expiration via 401 errors)
      await this.redis.set(REDIS_KEY, token);

      return token;
    } catch (error) {
      console.error("Failed to get access token:", error);
      throw error;
    }
  }

  /**
   * Invalidate the current token in Redis
   */
  async invalidateToken(): Promise<void> {
    await this.redis.del(REDIS_KEY);
  }
}
