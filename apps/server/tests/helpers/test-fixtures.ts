import { test as base } from "@playwright/test";
import { TestDataTracker } from "./test-tracker";

/**
 * Test fixture that provides a TestDataTracker instance
 * and automatically cleans up tracked data after each test
 */
export const test = base.extend<{
  tracker: TestDataTracker;
}>({
  tracker: async ({}, use) => {
    const tracker = new TestDataTracker();
    await use(tracker);
    // Cleanup happens automatically after test completes
    await tracker.cleanup();
  },
});

export { expect } from "@playwright/test";
