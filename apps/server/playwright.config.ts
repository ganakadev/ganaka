import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Run tests in parallel */
  workers: "100%",
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.API_DOMAIN || "http://localhost:4000",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "auth",
      testDir: "./tests/projects/auth",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "empty-db",
      testDir: "./tests/projects/empty-db",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "positive",
      testDir: "./tests/projects/positive",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "negative",
      testDir: "./tests/projects/negative",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "all",
      testDir: "./tests/projects",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: process.env.CI ? "pnpm --filter @ganaka/server start" : "echo 'Server is not running'",
    url: `${process.env.API_DOMAIN || "http://localhost:4000"}/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: "pipe",
    stderr: "pipe",
  },

  globalSetup: require.resolve("./tests/global-setup.ts"),
  globalTeardown: require.resolve("./tests/global-teardown.ts"),

  /* Test timeout */
  timeout: 30000,
  expect: {
    /* Maximum time expect() should wait for the condition to be met. */
    timeout: 5000,
  },
});
