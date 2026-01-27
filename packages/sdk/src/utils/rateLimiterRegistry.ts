import { RateLimiter } from "./rateLimiter";

// Registry of named rate limiters
const limiters: Map<string, RateLimiter> = new Map();

// Pre-configured Groww API limiter (fetchCandles)
limiters.set("groww", new RateLimiter({
  maxPerSecond: 10,
  maxPerMinute: 300,
}));

/**
 * Get a rate limiter by name
 * @param name - The limiter name (e.g., "groww")
 * @returns The rate limiter instance or undefined if not found
 */
export function getRateLimiter(name: string): RateLimiter | undefined {
  return limiters.get(name);
}

/**
 * Register a new rate limiter (for future extensibility)
 * @param name - Unique name for the limiter
 * @param config - Rate limit configuration
 */
export function registerRateLimiter(
  name: string,
  config: { maxPerSecond: number; maxPerMinute: number }
): void {
  limiters.set(name, new RateLimiter(config));
}

// Export the pre-configured Groww limiter for convenience
export const growwRateLimiter = limiters.get("groww")!;
