import axios, { AxiosResponse } from "axios";
import Redis from "ioredis";
import { FastifyInstance } from "fastify";

const REDIS_KEY = "groww:token";

export class TokenManager {
  private redis: Redis;
  private tokenGenerationInProgress: Map<string, Promise<string>> = new Map();
  private fastify: FastifyInstance;

  constructor(redis: Redis, fastify: FastifyInstance) {
    this.redis = redis;
    this.fastify = fastify;
  }

  /**
   * Get Redis key for a developer-specific token
   */
  private getRedisKey(developerId?: string): string {
    if (developerId) {
      return `groww:token:${developerId}`;
    }
    return REDIS_KEY;
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
      this.fastify.log.error("Token validation failed: %s", JSON.stringify(error));
      return false;
    }
  }

  /**
   * Get the access token from Redis, or generate a new one if missing
   * @param developerId - Optional developer ID for per-developer tokens
   * @param apiKey - Optional API key (if provided, uses developer-specific credentials)
   * @param apiSecret - Optional API secret (if provided, uses developer-specific credentials)
   */
  async getToken(
    developerId?: string,
    apiKey?: string | null,
    apiSecret?: string | null
  ): Promise<string> {
    const redisKey = this.getRedisKey(developerId);
    const generationKey = developerId || "global";

    try {
      // Check Redis first
      const cachedToken = await this.redis.get(redisKey);
      if (cachedToken) {
        const isValid = await this.checkIfTokenIsValid(cachedToken);
        if (!isValid) {
          await this.invalidateToken(developerId);
          return this.getToken(developerId, apiKey, apiSecret);
        }
        return cachedToken;
      }

      // If token generation is already in progress, wait for it
      const inProgress = this.tokenGenerationInProgress.get(generationKey);
      if (inProgress) {
        return inProgress;
      }

      // Generate new token
      const generationPromise = this.generateNewToken(developerId, apiKey, apiSecret);
      this.tokenGenerationInProgress.set(generationKey, generationPromise);
      try {
        const token = await generationPromise;
        return token;
      } finally {
        this.tokenGenerationInProgress.delete(generationKey);
      }
    } catch (error) {
      console.error("Failed to get access token:", error);
      throw error;
    }
  }

  /**
   * Generate a new access token and store it in Redis
   * @param developerId - Optional developer ID for per-developer tokens
   * @param apiKey - Optional API key (if provided, uses developer-specific credentials)
   * @param apiSecret - Optional API secret (if provided, uses developer-specific credentials)
   */
  private async generateNewToken(
    developerId?: string,
    apiKey?: string | null,
    apiSecret?: string | null
  ): Promise<string> {
    const redisKey = this.getRedisKey(developerId);
    const isDeveloperSpecific = developerId && apiKey && apiSecret;

    if (isDeveloperSpecific) {
      this.fastify.log.info(
        `######################### Generating new token for developer ${developerId} #########################`
      );
    } else {
      this.fastify.log.info(
        "######################### Generating new token #########################"
      );
    }

    // Use developer credentials if provided, otherwise fall back to environment variables
    const finalApiKey = apiKey || process.env.GROWW_API_KEY;
    const finalApiSecret = apiSecret || process.env.GROWW_API_SECRET;

    if (!finalApiKey || !finalApiSecret) {
      throw new Error("GROWW_API_KEY and GROWW_API_SECRET are required");
    }

    try {
      const response = (await axios.post("https://groww-access-token-generator.onrender.com", {
        api_key: finalApiKey,
        api_secret: finalApiSecret,
      })) as AxiosResponse<{ access_token: string }>;

      const token = response.data.access_token;

      // Store in Redis (no expiration - we'll handle expiration via 401 errors)
      await this.redis.set(redisKey, token);

      return token;
    } catch (error) {
      console.error("Failed to get access token:", error);
      throw error;
    }
  }

  /**
   * Invalidate the current token in Redis
   * @param developerId - Optional developer ID for per-developer tokens
   */
  async invalidateToken(developerId?: string): Promise<void> {
    const redisKey = this.getRedisKey(developerId);
    await this.redis.del(redisKey);
  }

  /**
   * Invalidate token for a specific developer
   */
  async invalidateTokenForDeveloper(developerId: string): Promise<void> {
    await this.invalidateToken(developerId);
  }
}
