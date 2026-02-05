import axios, { AxiosResponse } from "axios";

interface TokenCache {
  token: string;
  generationPromise?: Promise<string>;
}

// In-memory token cache
let tokenCache: TokenCache | null = null;

/**
 * Generate a new access token from Groww token generator service
 */
async function generateNewToken(): Promise<string> {
  const apiKey = process.env.GROWW_API_KEY;
  const apiSecret = process.env.GROWW_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("GROWW_API_KEY and GROWW_API_SECRET environment variables are required");
  }

  try {
    const response = (await axios.post("https://groww-access-token-generator.onrender.com", {
      api_key: apiKey,
      api_secret: apiSecret,
    })) as AxiosResponse<{ access_token: string }>;

    const token = response.data.access_token;

    if (!token) {
      throw new Error("Failed to get access token from Groww token generator");
    }

    return token;
  } catch (error) {
    console.error("Failed to get access token:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to generate Groww access token: ${error.response?.status} ${error.response?.statusText}`
      );
    }
    throw new Error("Failed to generate Groww access token");
  }
}

/**
 * Get the Groww access token, using cache if available
 * If token generation is already in progress, waits for that promise
 */
export async function getGrowwToken(): Promise<string> {
  // If token generation is already in progress, wait for it
  if (tokenCache?.generationPromise) {
    return tokenCache.generationPromise;
  }

  // If we have a cached token, return it
  if (tokenCache?.token) {
    return tokenCache.token;
  }

  // Generate new token
  const generationPromise = generateNewToken();
  tokenCache = {
    token: "", // Will be set after generation completes
    generationPromise,
  };

  try {
    const token = await generationPromise;
    tokenCache = {
      token,
    };
    return token;
  } catch (error) {
    // Clear cache on error
    tokenCache = null;
    throw error;
  }
}

/**
 * Invalidate the cached token (forces next call to generate a new token)
 */
export function invalidateToken(): void {
  tokenCache = null;
}
