import {
  authenticatedDelete,
  authenticatedGet,
  authenticatedPost,
  unauthenticatedDelete,
  unauthenticatedGet,
  unauthenticatedPost,
} from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";

let adminToken: string;
let sharedTracker: TestDataTracker;

test.beforeAll(async () => {
  const token = process.env.TEST_ADMIN_TOKEN;
  if (!token) {
    throw new Error("TEST_ADMIN_TOKEN not set in environment");
  }
  adminToken = token;
  sharedTracker = new TestDataTracker();
});

test.afterAll(async () => {
  if (sharedTracker) {
    await sharedTracker.cleanup();
  }
});

test.describe("Admin Holidays API", () => {
  test.describe.configure({ mode: "serial" });

  test.describe("GET /v1/admin/holidays", () => {
    test("should return 401 when authorization header is missing", async () => {
      const response = await unauthenticatedGet("/v1/admin/holidays");

      expect(response.status).toBe(401);
      const body =
        typeof response.data === "string" ? response.data : JSON.stringify(response.data);
      expect(body).toContain("Authorization header is required");
    });

    test("should return 401 when invalid admin token is provided", async () => {
      const response = await authenticatedGet("/v1/admin/holidays", "invalid-token-12345", {
        validateStatus: () => true,
      });

      expect(response.status).toBe(401);
      const body =
        typeof response.data === "string" ? response.data : JSON.stringify(response.data);
      expect(body).toContain("Authorization failed");
    });

    test("should return 401 when developer token is used instead of admin token", async ({
      tracker,
    }) => {
      const dev = await createDeveloperUser(undefined, tracker);

      const response = await authenticatedGet("/v1/admin/holidays", dev.token, {
        validateStatus: () => true,
      });

      expect(response.status).toBe(401);
      const body =
        typeof response.data === "string" ? response.data : JSON.stringify(response.data);
      expect(body).toContain("Authorization failed");
    });
  });

  test.describe("POST /v1/admin/holidays", () => {
    test("should return 401 when authorization header is missing", async () => {
      const response = await unauthenticatedPost("/v1/admin/holidays", {
        dates: ["2025-01-15"],
      });

      expect(response.status).toBe(401);
    });
  });

  test.describe("DELETE /v1/admin/holidays", () => {
    test("should return 401 when authorization header is missing", async () => {
      const response = await unauthenticatedDelete("/v1/admin/holidays", {
        data: {
          dates: ["2025-01-15"],
        },
      });

      expect(response.status).toBe(401);
    });
  });
});
