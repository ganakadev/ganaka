type QueuedRequest<T> = {
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
};

type RateLimiterConfig = {
  maxPerSecond: number;
  maxPerMinute: number;
};

/**
 * RateLimiter enforces rate limits using a sliding window algorithm.
 * It tracks requests in two windows: per-second and per-minute.
 * Requests are queued and processed when limits allow.
 */
export class RateLimiter {
  private queue: QueuedRequest<any>[] = [];
  private secondTimestamps: number[] = [];
  private minuteTimestamps: number[] = [];
  private processing = false;

  private readonly maxPerSecond: number;
  private readonly maxPerMinute: number;

  constructor(config: RateLimiterConfig) {
    this.maxPerSecond = config.maxPerSecond;
    this.maxPerMinute = config.maxPerMinute;
  }

  /**
   * Execute a function with rate limiting.
   * The function will be queued and executed when rate limits allow.
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ execute: fn, resolve, reject });
      this.processQueue();
    });
  }

  /**
   * Process the queue of pending requests.
   * Continuously processes requests while respecting rate limits.
   */
  private async processQueue(): Promise<void> {
    if (this.processing) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      this.cleanupTimestamps();

      if (this.canMakeRequest()) {
        const request = this.queue.shift();
        if (!request) {
          break;
        }

        const now = Date.now();
        this.secondTimestamps.push(now);
        this.minuteTimestamps.push(now);

        try {
          const result = await request.execute();
          request.resolve(result);
        } catch (error) {
          request.reject(error instanceof Error ? error : new Error(String(error)));
        }
      } else {
        const waitTime = this.getWaitTime();
        await this.sleep(waitTime);
      }
    }

    this.processing = false;
  }

  /**
   * Check if a new request can be made based on current rate limits.
   */
  private canMakeRequest(): boolean {
    const now = Date.now();
    const oneSecondAgo = now - 1000;
    const oneMinuteAgo = now - 60000;

    const recentSecondCount = this.secondTimestamps.filter((ts) => ts > oneSecondAgo).length;
    const recentMinuteCount = this.minuteTimestamps.filter((ts) => ts > oneMinuteAgo).length;

    return recentSecondCount < this.maxPerSecond && recentMinuteCount < this.maxPerMinute;
  }

  /**
   * Remove timestamps that are outside the tracking windows.
   */
  private cleanupTimestamps(): void {
    const now = Date.now();
    const oneSecondAgo = now - 1000;
    const oneMinuteAgo = now - 60000;

    this.secondTimestamps = this.secondTimestamps.filter((ts) => ts > oneSecondAgo);
    this.minuteTimestamps = this.minuteTimestamps.filter((ts) => ts > oneMinuteAgo);
  }

  /**
   * Calculate the minimum wait time needed before the next request can be made.
   */
  private getWaitTime(): number {
    const now = Date.now();
    const oneSecondAgo = now - 1000;
    const oneMinuteAgo = now - 60000;

    let waitTime = 0;

    // Check per-second limit
    const recentSecondCount = this.secondTimestamps.filter((ts) => ts > oneSecondAgo).length;
    if (recentSecondCount >= this.maxPerSecond) {
      const oldestInSecond = Math.min(...this.secondTimestamps.filter((ts) => ts > oneSecondAgo));
      const waitForSecond = oldestInSecond + 1000 - now;
      waitTime = Math.max(waitTime, waitForSecond);
    }

    // Check per-minute limit
    const recentMinuteCount = this.minuteTimestamps.filter((ts) => ts > oneMinuteAgo).length;
    if (recentMinuteCount >= this.maxPerMinute) {
      const oldestInMinute = Math.min(...this.minuteTimestamps.filter((ts) => ts > oneMinuteAgo));
      const waitForMinute = oldestInMinute + 60000 - now;
      waitTime = Math.max(waitTime, waitForMinute);
    }

    return Math.max(waitTime, 0);
  }

  /**
   * Sleep for a given number of milliseconds.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
