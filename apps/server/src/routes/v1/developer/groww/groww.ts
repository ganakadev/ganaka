import { v1_developer_groww_schemas } from "@ganaka/schemas";
import axios, { AxiosError } from "axios";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import z from "zod";
import { RedisManager } from "../../../../utils/redis";
import { sendResponse } from "../../../../utils/sendResponse";
import { TokenManager } from "../../../../utils/token-manager";
import { validateRequest } from "../../../../utils/validator";

/**
 * Helper function to make Groww API requests with automatic token refresh
 */
const makeGrowwAPIRequest =
  (fastify: FastifyInstance, tokenManager: TokenManager) =>
  async <T>({
    method,
    url,
    params,
  }: {
    url: string;
    method: string;
    params?: Record<string, any>;
  }): Promise<T> => {
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

  // ==================== GET /quote ====================

  // Quote endpoint
  fastify.get("/quote", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_developer_groww_schemas.getGrowwQuote.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    try {
      const response = await growwAPIRequest<
        z.infer<typeof v1_developer_groww_schemas.growwQuoteSchema>
      >({
        method: "get",
        url: `https://api.groww.in/v1/live-data/quote`,
        params: {
          exchange: "NSE",
          segment: "CASH",
          trading_symbol: encodeURIComponent(validationResult.symbol),
        },
      });

      return sendResponse<
        z.infer<typeof v1_developer_groww_schemas.getGrowwQuote.response>
      >({
        statusCode: 200,
        message: "Quote fetched successfully",
        data: response,
      });
    } catch (error) {
      fastify.log.error("Error fetching quote: %s", error);
      return reply.internalServerError(
        "Failed to fetch quote. Please check server logs for more details."
      );
    }
  });

  // ==================== GET /historical-candles ====================

  // Historical candles endpoint
  fastify.get("/historical-candles", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_developer_groww_schemas.getGrowwHistoricalCandles.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    try {
      const response = await growwAPIRequest<
        z.infer<typeof v1_developer_groww_schemas.growwHistoricalCandlesSchema>
      >({
        method: "get",
        url: `https://api.groww.in/v1/historical/candles`,
        params: {
          candle_interval: validationResult.interval,
          start_time: validationResult.start_time,
          end_time: validationResult.end_time,
          exchange: "NSE",
          segment: "CASH",
          groww_symbol: encodeURIComponent(`NSE-${validationResult.symbol}`),
        },
      });

      return sendResponse<
        z.infer<
          typeof v1_developer_groww_schemas.getGrowwHistoricalCandles.response
        >
      >({
        statusCode: 200,
        message: "Historical candles fetched successfully",
        data: response,
      });
    } catch (error) {
      fastify.log.error("Error fetching historical candles: %s", error);
      return reply.internalServerError(
        "Failed to fetch historical candles. Please check server logs for more details."
      );
    }
  });
};

export default growwRoutes;
