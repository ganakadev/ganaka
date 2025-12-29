/// <reference types="node" />
import axios from "axios";

export function getTestServerUrl(): string {
  return process.env.API_DOMAIN || `http://localhost:5000`;
}

/**
 * Checks if the test server is running and accessible.
 * Throws an error if the server is not running or not accessible.
 * @throws Error if server is not running or not accessible
 */
export async function ensureTestServerRunning(): Promise<void> {
  const serverUrl = getTestServerUrl();

  try {
    // Try to make a request to the server
    // We expect it to fail with 401/403 (auth required) or any HTTP response,
    // but if it's a connection error (ECONNREFUSED), the server isn't running
    await axios.get(serverUrl, {
      timeout: 5000,
      validateStatus: () => true, // Accept any status code
    });
    console.log(`Test server is running at ${serverUrl}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Check if it's a connection error (server not running)
      if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
        throw new Error(
          `Test server is not running at ${serverUrl}. ` +
            `Please start the server manually before running tests. ` +
            `You can start it with: NODE_ENV=test PORT=${
              process.env.TEST_PORT || "4000"
            } pnpm start`
        );
      }
      // Other axios errors (network issues, etc.)
      throw new Error(`Failed to connect to test server at ${serverUrl}: ${error.message}`);
    }
    // Re-throw non-axios errors
    throw error;
  }
}

/**
 * @deprecated Server is no longer managed by test setup. Use ensureTestServerRunning() instead.
 * This function is kept for backwards compatibility but does nothing.
 */
export async function startTestServer(): Promise<void> {
  await ensureTestServerRunning();
}

/**
 * @deprecated Server is no longer managed by test setup.
 * This function is kept for backwards compatibility but does nothing.
 */
export async function stopTestServer(): Promise<void> {
  // No-op: server is not managed by test setup
  return Promise.resolve();
}
