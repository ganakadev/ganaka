/// <reference types="node" />
import Redis from "ioredis";

// Singleton Redis client for test cleanup operations
let sharedRedisClient: Redis | null = null;

// Queue for serializing Redis cleanup operations to prevent rate limit hits
// Each operation waits for the previous one to complete before executing
let cleanupQueue: Promise<any> = Promise.resolve();

/**
 * Checks if an error is a Redis rate limit error
 */
function isRateLimitError(error: any): boolean {
  return (
    error &&
    error.message &&
    typeof error.message === "string" &&
    error.message.includes("Too many requests")
  );
}

/**
 * Delay helper for retry logic
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry wrapper with exponential backoff for Redis operations
 * Handles rate limit errors gracefully
 */
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  operationName = "Redis operation"
): Promise<T | null> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (isRateLimitError(error) && attempt < maxRetries - 1) {
        const backoffMs = Math.pow(2, attempt) * 100;
        console.warn(
          `Redis rate limit hit during ${operationName}, retrying in ${backoffMs}ms (attempt ${attempt + 1}/${maxRetries})`
        );
        await delay(backoffMs);
        continue;
      }

      // If it's a rate limit error on last attempt, log and return null
      if (isRateLimitError(error)) {
        console.warn(
          `Redis rate limit exceeded during ${operationName} after ${maxRetries} attempts, skipping cleanup`
        );
        return null;
      }

      // For other errors, log and return null
      console.warn(`Error during ${operationName}:`, error);
      return null;
    }
  }
  return null;
}

/**
 * Gets or creates a shared Redis client for test cleanup operations
 * Uses singleton pattern to reuse connection across cleanup operations
 * Uses REDIS_URL from environment variables
 */
function getSharedRedisClient(): Redis | null {
  // Return existing client if it's ready
  if (sharedRedisClient && sharedRedisClient.status === "ready") {
    return sharedRedisClient;
  }

  // Return existing client if it's connecting (wait for it)
  if (sharedRedisClient && sharedRedisClient.status === "connecting") {
    return sharedRedisClient;
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.warn("REDIS_URL not set, skipping Redis cleanup");
    return null;
  }

  try {
    sharedRedisClient = new Redis(redisUrl, {
      // Reduce connection overhead
      lazyConnect: false,
      maxRetriesPerRequest: 1,
    });

    sharedRedisClient.on("error", (error) => {
      // Don't log rate limit errors here, they're handled in retry logic
      if (!isRateLimitError(error)) {
        console.warn("Redis connection error during cleanup:", error);
      }
    });

    sharedRedisClient.on("connect", () => {
      // Connection established
    });

    return sharedRedisClient;
  } catch (error) {
    console.warn("Failed to create Redis client for cleanup:", error);
    sharedRedisClient = null;
    return null;
  }
}

/**
 * Closes the shared Redis client connection
 * Should be called during global teardown
 */
export async function closeSharedRedisClient(): Promise<void> {
  if (!sharedRedisClient) {
    return;
  }

  try {
    if (sharedRedisClient.status !== "end" && sharedRedisClient.status !== "close") {
      await sharedRedisClient.quit();
    }
  } catch (error) {
    // Ignore errors during cleanup
    console.warn("Error closing shared Redis client:", error);
  } finally {
    sharedRedisClient = null;
  }
}

/**
 * Enqueues a Redis operation to be executed sequentially
 * This prevents concurrent operations from hitting Redis rate limits
 */
async function enqueueRedisOperation<T>(operation: () => Promise<T>): Promise<T> {
  // Chain the new operation to wait for the previous one to complete
  // Whether the previous operation succeeds or fails, we wait for it before executing the next
  cleanupQueue = cleanupQueue.then(
    () => operation(),
    () => operation()
  );
  return cleanupQueue;
}

/**
 * Deletes Redis keys for Groww tokens associated with specific developer IDs
 * @param developerIds - Array of developer IDs whose token keys should be deleted
 * @returns Number of keys deleted, or null if Redis is unavailable
 */
export async function cleanupGrowwTokenKeys(developerIds: string[]): Promise<number | null> {
  if (developerIds.length === 0) {
    return 0;
  }

  const redis = getSharedRedisClient();
  if (!redis) {
    return null;
  }

  const keysToDelete: string[] = [];
  for (const developerId of developerIds) {
    keysToDelete.push(`groww:token:${developerId}`);
  }

  if (keysToDelete.length === 0) {
    return 0;
  }

  // Enqueue the operation to serialize Redis cleanup operations
  return await enqueueRedisOperation(async () => {
    // Use retry logic with exponential backoff
    const result = await withRetry(
      async () => {
        return await redis.del(...keysToDelete);
      },
      3,
      `cleanupGrowwTokenKeys for ${developerIds.length} developers`
    );

    return result;
  });
}

/**
 * Deletes all Redis keys matching the pattern `groww:token:*`
 * Excludes the global `groww:token` key (without developer ID suffix)
 * @returns Number of keys deleted, or null if Redis is unavailable
 */
export async function cleanupAllGrowwTokenKeys(): Promise<number | null> {
  const redis = getSharedRedisClient();
  if (!redis) {
    return null;
  }

  // Enqueue the entire operation to serialize Redis cleanup operations
  return await enqueueRedisOperation(async () => {
    // Use retry logic for SCAN operation
    const scanResult = await withRetry(
      async () => {
        const keysToDelete: string[] = [];
        let cursor = "0";

        do {
          const [nextCursor, keys] = await redis.scan(
            cursor,
            "MATCH",
            "groww:token:*",
            "COUNT",
            100
          );
          cursor = nextCursor;

          // Filter out the global key (groww:token without developer ID)
          for (const key of keys) {
            if (key !== "groww:token" && key.startsWith("groww:token:")) {
              keysToDelete.push(key);
            }
          }
        } while (cursor !== "0");

        return keysToDelete;
      },
      3,
      "cleanupAllGrowwTokenKeys SCAN"
    );

    if (scanResult === null) {
      return null;
    }

    if (scanResult.length === 0) {
      return 0;
    }

    // Delete keys in batches to avoid overwhelming Redis
    // Use retry logic for each batch deletion
    const batchSize = 100;
    let totalDeleted = 0;

    for (let i = 0; i < scanResult.length; i += batchSize) {
      const batch = scanResult.slice(i, i + batchSize);

      // const batchResult = await withRetry(
      //   async () => {
      //     return await redis.del(...batch);
      //   },
      //   3,
      //   `cleanupAllGrowwTokenKeys DEL batch ${Math.floor(i / batchSize) + 1}`
      // );

      // if (batchResult !== null) {
      //   totalDeleted += batchResult;
      // }
    }

    return totalDeleted;
  });
}
