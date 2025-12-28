import { FastifyInstance } from "fastify";
import axios, { AxiosError } from "axios";
import { TokenManager } from "./token-manager";

/**
 * Helper function to make Groww API requests with automatic token refresh
 */
export const makeGrowwAPIRequest =
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
    const maxAttempts = 3;
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
        console.dir(error, { depth: null });

        // Check if it's a 401 Unauthorized error
        const isUnauthorized =
          axios.isAxiosError(error) && (error as AxiosError).response?.status === 401;

        if (isUnauthorized && attempt < maxAttempts) {
          // Invalidate token and retry
          await tokenManager.invalidateToken();
          continue;
        }

        // Log the error response for debugging
        if (axios.isAxiosError(error) && error.response) {
          const errorResponse = {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            config: {
              url: error.config?.url,
              params: error.config?.params,
            },
          };
          fastify.log.error("Groww API Error: %s", JSON.stringify(errorResponse));

          // For 500 errors, log additional details
          if (error.response.status === 500) {
            fastify.log.error(
              "Groww API 500 Error Details - URL: %s, Params: %s, Response Data: %s",
              error.config?.url,
              JSON.stringify(error.config?.params),
              JSON.stringify(error.response.data)
            );
            continue;
          }
        }

        throw error;
      }
    }

    throw lastError;
  };

