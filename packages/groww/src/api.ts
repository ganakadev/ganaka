import axios, { AxiosError, AxiosResponse } from "axios";

// In-memory cache for access token
let cachedToken: string | null = null;

const getGrowwAccessToken = async (): Promise<string> => {
  // Return cached token if available
  if (cachedToken) {
    return cachedToken;
  }

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

    // Cache the token
    cachedToken = response.data.access_token;
    return cachedToken;
  } catch (error) {
    console.error("Failed to get access token:", error);
    throw error;
  }
};

function invalidateGrowwAccessTokenCache() {
  cachedToken = null;
}

export const growwApiRequest = async <T = any>(config: {
  method?: string;
  url: string;
  params?: Record<string, any>;
}): Promise<T> => {
  const maxAttempts = 2;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const accessToken = await getGrowwAccessToken();
      if (!accessToken) {
        throw new Error("Failed to get access token");
      }

      const headers = {
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
        invalidateGrowwAccessTokenCache();
        continue;
      }

      // Log the error response for debugging
      if (axios.isAxiosError(error) && error.response) {
        console.error("Groww API Error:", {
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
