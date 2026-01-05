import { FastifyInstance } from "fastify";
import axios, { AxiosError } from "axios";
import { TokenManager } from "./token-manager";

/**
 * Helper function to serialize parameters using URLSearchParams (matching browser behavior)
 * Filters out undefined and null values to ensure consistent encoding
 */
function serializeParams(params?: Record<string, any>): Record<string, string> {
  const serialized: Record<string, string> = {};
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        serialized[key] = String(value);
      }
    }
  }
  return serialized;
}

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
    const maxAttempts = 5;
    let lastError: unknown;

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const accessToken = await tokenManager.getToken();
        if (!accessToken) {
          throw new Error("Failed to get access token");
        }

        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "PostmanRuntime/7.32.3",
          "Accept-Encoding": "gzip, deflate, br",
          Accept: "application/json",
        };

        // Serialize params to ensure consistent encoding matching browser behavior
        const serializedParams = serializeParams(params);

        const response = await axios({
          method,
          url,
          params: serializedParams,
          headers,
          // Use URLSearchParams serializer to match browser behavior (same as RTK Query)
          paramsSerializer: (params) => {
            const searchParams = new URLSearchParams();
            for (const [key, value] of Object.entries(params)) {
              if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
              }
            }
            return searchParams.toString();
          },
        });

        return response.data;
      } catch (error) {
        lastError = error;

        if (axios.isAxiosError(error)) {
          // Use error.config?.params instead of outer scope params to safely handle undefined
          const errorParams = error.config?.params || params || {};
          const serializedErrorParams = serializeParams(errorParams);
          const fullUrl =
            error.config?.url + "?" + new URLSearchParams(serializedErrorParams).toString();
          console.log("Full URL that would be sent:", fullUrl);
        }

        // Check if it's a 401 Unauthorized error
        const isUnauthorized =
          axios.isAxiosError(error) && (error as AxiosError).response?.status === 401;

        if (isUnauthorized && attempt < maxAttempts) {
          // Invalidate token and retry
          await tokenManager.invalidateToken();
          continue;
        }

        // Handle 429 Too Many Requests with exponential backoff
        const isRateLimited =
          axios.isAxiosError(error) && (error as AxiosError).response?.status === 429;

        if (isRateLimited && attempt < maxAttempts) {
          const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          fastify.log.warn(
            "Groww API Rate Limit - Attempt %d of %d. Retrying in %dms. URL: %s",
            attempt,
            maxAttempts,
            backoffDelay,
            url
          );
          await delay(backoffDelay);
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
