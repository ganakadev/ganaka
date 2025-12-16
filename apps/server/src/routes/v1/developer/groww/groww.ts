import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { TokenManager } from "../../../../utils/token-manager";
import axios, { AxiosError } from "axios";
import { RedisManager } from "../../../../utils/redis";
import {
  formatZodError,
  historicalCandlesQuerySchema,
  quoteQuerySchema,
} from "../../../../utils/validation";

/**
 * Helper function to make Groww API requests with automatic token refresh
 */
const makeGrowwAPIRequest =
  (fastify: FastifyInstance, tokenManager: TokenManager) =>
  async ({
    method,
    url,
    params,
  }: {
    url: string;
    method: string;
    params?: Record<string, any>;
  }) => {
    const maxAttempts = 2;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const accessToken = await tokenManager.getToken();
        if (!accessToken) {
          throw new Error("Failed to get access token");
        }

        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        const response = await axios({
          method,
          url,
          params,
          headers,
        });

        return response.data;
      } catch (error) {
        lastError = error;

        // Check if it's a 401 Unauthorized error
        const isUnauthorized =
          axios.isAxiosError(error) &&
          (error as AxiosError).response?.status === 401;

        if (isUnauthorized && attempt < maxAttempts) {
          // Invalidate token and retry
          await tokenManager.invalidateToken();
          continue;
        }

        // Log the error response for debugging
        if (axios.isAxiosError(error) && error.response) {
          fastify.log.error("Groww API Error: %s", {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            config: {
              url: error.config?.url,
              params: error.config?.params,
            },
          });
        }

        throw error;
      }
    }

    throw lastError;
  };

const growwRoutes: FastifyPluginAsync = async (fastify) => {
  const redisManager = new RedisManager(fastify);
  const tokenManager = new TokenManager(redisManager.redis, fastify);
  const growwAPIRequest = makeGrowwAPIRequest(fastify, tokenManager);

  // Register cleanup hook for graceful shutdown
  fastify.addHook("preClose", async () => {
    await redisManager.close();
  });

  // Get latest token endpoint
  fastify.get("/token", async (request, reply) => {
    const token = await tokenManager.getToken();
    return reply.send({ token });
  });

  // Quote endpoint
  fastify.get("/quote", async (request, reply) => {
    const validationResult = quoteQuerySchema.safeParse(request.query);

    if (!validationResult.success) {
      const errorResponse = formatZodError(validationResult.error);
      return reply.status(400).send(errorResponse);
    }

    const { symbol } = validationResult.data;

    try {
      const response = await growwAPIRequest({
        method: "get",
        url: `https://api.groww.in/v1/live-data/quote?exchange=NSE&segment=CASH&trading_symbol=${encodeURIComponent(
          symbol
        )}`,
      });

      return reply.send(response);
    } catch (error) {
      fastify.log.error("Error fetching quote: %s", error);
      return reply.status(500).send({ error: "Failed to fetch quote" });
    }
  });

  // Historical candles endpoint
  fastify.get("/historical-candles", async (request, reply) => {
    const validationResult = historicalCandlesQuerySchema.safeParse(
      request.query
    );

    if (!validationResult.success) {
      const errorResponse = formatZodError(validationResult.error);
      return reply.status(400).send(errorResponse);
    }

    const { symbol, interval, start_time, end_time } = validationResult.data;

    try {
      const response = await growwAPIRequest({
        method: "get",
        url: `https://api.groww.in/v1/historical/candles`,
        params: {
          candle_interval: interval,
          start_time: start_time,
          end_time: end_time,
          exchange: "NSE",
          segment: "CASH",
          groww_symbol: encodeURIComponent(`NSE-${symbol}`),
        },
      });

      return reply.send(response);
    } catch (error) {
      fastify.log.error("Error fetching historical candles: %s", error);
      return reply
        .status(500)
        .send({ error: "Failed to fetch historical candles" });
    }
  });
};

export default growwRoutes;
