import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {
  getGrowwAccessToken,
  invalidateGrowwAccessTokenCache,
} from "./get-groww-access-token";
import { logger } from "./logger";

export async function growwApiRequest<T = any>(
  config: AxiosRequestConfig & { url: string }
): Promise<T> {
  const maxAttempts = 2;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      logger.debug(
        `Making ${config.method?.toUpperCase() || "GET"} request to ${
          config.url
        } (attempt ${attempt}/${maxAttempts})`
      );

      const accessToken = await getGrowwAccessToken();
      if (!accessToken) {
        throw new Error("Failed to get access token");
      }

      // Merge headers, ensuring Authorization header is set
      const headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axios({
        ...config,
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
        logger.debug(
          `Received 401 Unauthorized error, invalidating cache and retrying...`
        );
        invalidateGrowwAccessTokenCache();
        continue;
      }

      // If not a 401 or last attempt, throw the error
      logger.error(
        `Failed to make ${config.method?.toUpperCase() || "GET"} request to ${
          config.url
        }: ${error}`
      );
      throw error;
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError;
}
