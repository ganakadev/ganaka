import { RateLimiter } from "limiter";

// 7 requests per second
const perSecondLimiter = new RateLimiter({
  tokensPerInterval: 7,
  interval: "second",
});

// 250 requests per minute
const perMinuteLimiter = new RateLimiter({
  tokensPerInterval: 250,
  interval: "minute",
});

export async function acquireGrowwToken(): Promise<void> {
  await perSecondLimiter.removeTokens(1);
  await perMinuteLimiter.removeTokens(1);
}
