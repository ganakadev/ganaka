import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

const baseURL = process.env.API_DOMAIN || "http://localhost:5000";

/**
 * Creates a configured axios instance with base URL
 */
export function createApiClient(): AxiosInstance {
  return axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Makes an authenticated GET request
 */
export async function authenticatedGet(url: string, token: string, config?: AxiosRequestConfig) {
  const client = createApiClient();
  return client.get(url, {
    ...config,
    headers: {
      ...config?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Makes an authenticated POST request
 */
export async function authenticatedPost(
  url: string,
  token: string,
  data?: unknown,
  config?: AxiosRequestConfig
) {
  const client = createApiClient();
  return client.post(url, data, {
    ...config,
    headers: {
      ...config?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Makes an authenticated PATCH request
 */
export async function authenticatedPatch(
  url: string,
  token: string,
  data?: unknown,
  config?: AxiosRequestConfig
) {
  const client = createApiClient();
  return client.patch(url, data, {
    ...config,
    headers: {
      ...config?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Makes an authenticated DELETE request
 */
export async function authenticatedDelete(url: string, token: string, config?: AxiosRequestConfig) {
  const client = createApiClient();
  return client.delete(url, {
    ...config,
    headers: {
      ...config?.headers,
      "Content-Type": undefined, // DELETE requests don't have bodies
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Makes an unauthenticated GET request (for testing auth failures)
 */
export async function unauthenticatedGet(url: string, config?: AxiosRequestConfig) {
  const client = createApiClient();
  return client.get(url, {
    ...config,
    validateStatus: () => true,
  });
}

/**
 * Makes an unauthenticated POST request (for testing auth failures)
 */
export async function unauthenticatedPost(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) {
  const client = createApiClient();
  return client.post(url, data, {
    ...config,
    validateStatus: () => true,
  });
}

/**
 * Makes an unauthenticated PATCH request (for testing auth failures)
 */
export async function unauthenticatedPatch(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) {
  const client = createApiClient();
  return client.patch(url, data, {
    ...config,
    validateStatus: () => true,
  });
}

/**
 * Makes an unauthenticated DELETE request (for testing auth failures)
 */
export async function unauthenticatedDelete(url: string, config?: AxiosRequestConfig) {
  const client = createApiClient();
  return client.delete(url, {
    ...config,
    headers: {
      ...config?.headers,
      "Content-Type": undefined, // DELETE requests don't have bodies
    },
    validateStatus: () => true,
  });
}

/**
 * Helper to extract error message from axios error response
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      // Try to get error message from response data
      if (typeof axiosError.response.data === "string") {
        return axiosError.response.data;
      }
      if (
        axiosError.response.data &&
        typeof axiosError.response.data === "object" &&
        "message" in axiosError.response.data
      ) {
        return String(axiosError.response.data.message);
      }
      return axiosError.response.statusText || `HTTP ${axiosError.response.status}`;
    }
    return axiosError.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
