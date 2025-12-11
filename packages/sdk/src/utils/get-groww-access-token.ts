import axios, { AxiosResponse } from "axios";
import { logger } from "./logger";

// In-memory cache for access token
let cachedToken: string | null = null;

export const getGrowwAccessToken = async () => {
  // Return cached token if available
  if (cachedToken) {
    logger.debug("Using cached access token");
    return cachedToken;
  }

  try {
    logger.debug("Getting access token");
    const response = (await axios.post(
      "https://groww-access-token-generator.onrender.com",
      {
        api_key: process.env.GROWW_API_KEY!,
        api_secret: process.env.GROWW_API_SECRET,
      }
    )) as AxiosResponse<{ access_token: string }>;

    // Cache the token
    cachedToken = response.data.access_token;
    logger.debug("Access token cached");

    return cachedToken;
  } catch (error) {
    logger.error(`Failed to get access token: ${error}`);
    throw error;
  }
};

export const invalidateGrowwAccessTokenCache = () => {
  logger.debug("Invalidating access token cache");
  cachedToken = null;
};
