import { v1_runs_schemas } from "@ganaka/schemas";
import { logger } from "../utils/logger";
import { ApiClient } from "../utils/apiClient";
import { z } from "zod";
import axios, { AxiosError } from "axios";

/**
 * Determines if an error is retryable (network errors or 5xx server errors)
 * Since ApiClient wraps axios errors, we check error messages and types
 */
function isRetryableError(error: unknown): boolean {
  // Check if it's an axios error (might be preserved in error chain)
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    // No response means network error - always retryable
    if (!axiosError.response) {
      return true;
    }
    // 5xx errors are retryable
    const status = axiosError.response.status;
    if (status >= 500 && status < 600) {
      return true;
    }
    // 4xx errors are not retryable (client errors)
    return false;
  }

  // For wrapped errors from ApiClient, check error message patterns
  if (error instanceof Error) {
    const errorMessage = error.message.toUpperCase();

    // Network error patterns (retryable)
    const networkErrorPatterns = [
      "ECONNREFUSED",
      "ETIMEDOUT",
      "ENOTFOUND",
      "ECONNRESET",
      "NETWORK",
      "TIMEOUT",
      "CONNECTION",
      "REQUEST FAILED", // Generic network failure
    ];

    // Client error patterns (not retryable)
    const clientErrorPatterns = [
      "UNAUTHORIZED",
      "FORBIDDEN",
      "NOT FOUND",
      "BAD REQUEST",
      "VALIDATION",
      "AUTHENTICATION",
    ];

    // If it matches client error patterns, don't retry
    if (clientErrorPatterns.some((pattern) => errorMessage.includes(pattern))) {
      return false;
    }

    // If it matches network error patterns, retry
    if (networkErrorPatterns.some((pattern) => errorMessage.includes(pattern))) {
      return true;
    }

    // Check error cause if available (might contain original axios error)
    // Using type assertion since cause is available in ES2022+ but TypeScript may not recognize it
    const errorWithCause = error as Error & { cause?: unknown };
    if (errorWithCause.cause && axios.isAxiosError(errorWithCause.cause)) {
      const axiosError = errorWithCause.cause as AxiosError;
      if (!axiosError.response) {
        return true; // Network error
      }
      if (axiosError.response.status >= 500 && axiosError.response.status < 600) {
        return true; // 5xx error
      }
    }
  }

  // Unknown errors are not retryable by default
  return false;
}

/**
 * Retries a function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if it's not a retryable error
      if (!isRetryableError(error)) {
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate exponential backoff delay: 1s, 2s, 4s
      const delayMs = baseDelayMs * Math.pow(2, attempt);
      logger.warn(`Order placement attempt ${attempt + 1} failed, retrying in ${delayMs}ms...`);

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  // All retries exhausted
  throw lastError;
}

export const placeOrder =
  ({ runId, apiClient }: { runId: string | null; apiClient: ApiClient }) =>
  async (data: z.infer<typeof v1_runs_schemas.createOrder.body>): Promise<void> => {
    // Keep existing console.log for backward compatibility
    logger.debug(`data: ${JSON.stringify(data)}`);

    // Persist to database via API if runId is available
    if (runId) {
      try {
        await retryWithBackoff(
          async () => {
            const validatedData = v1_runs_schemas.createOrder.body.parse(data);
            await apiClient.post<z.infer<typeof v1_runs_schemas.createOrder.response>>(
              `/v1/runs/${runId}/orders`,
              validatedData
            );
            logger.debug(`Order persisted for ${data.nseSymbol} in runId: ${runId}`);
          },
          3,
          1000
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(
          `Failed to persist order for ${data.nseSymbol} in runId: ${runId} after 3 retries: ${errorMessage}`
        );
      }
    }
  };
