import {
  authenticatedGet,
  unauthenticatedGet,
  authenticatedDelete,
  unauthenticatedDelete,
} from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";

let adminToken: string;
let developerToken: string;
let sharedTracker: TestDataTracker;

test.beforeAll(async () => {
  const token = process.env.TEST_ADMIN_TOKEN;
  if (!token) {
    throw new Error("TEST_ADMIN_TOKEN not set in environment");
  }
  adminToken = token;
  sharedTracker = new TestDataTracker();
  const dev = await createDeveloperUser(undefined, sharedTracker);
  developerToken = dev.token;
});

test.afterAll(async () => {
  if (sharedTracker) {
    await sharedTracker.cleanup();
  }
});

test.describe("GET /v1/dates", () => {
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet("/v1/dates");

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization header is required");
  });

  test.describe("Admin Role", () => {
    test("should return 401 when invalid admin token is provided", async () => {
      const response = await authenticatedGet("/v1/dates", "invalid-token-12345", {
        validateStatus: () => true,
      });

      expect(response.status).toBe(401);
      const body =
        typeof response.data === "string" ? response.data : JSON.stringify(response.data);
      expect(body).toContain("Authorization failed");
    });
  });

  test.describe("Developer Role", () => {
    test("should return 401 when invalid developer token is provided", async () => {
      const response = await authenticatedGet("/v1/dates", "invalid-token-12345", {
        validateStatus: () => true,
      });

      expect(response.status).toBe(401);
      const body =
        typeof response.data === "string" ? response.data : JSON.stringify(response.data);
      expect(body).toContain("Authorization failed");
    });
  });
});

test.describe("DELETE /v1/dates", () => {
  test.describe("Admin Role", () => {
    test("should return 401 when authorization header is missing", async () => {
      const response = await unauthenticatedDelete("/v1/dates", {
        data: {
          dates: ["2025-01-15"],
        },
      });

      expect(response.status).toBe(401);
    });
  });
});
