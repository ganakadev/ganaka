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

test.describe("GET /v1/holidays", () => {
  test.describe.configure({ mode: "serial" });

  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet("/v1/holidays");

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization header is required");
  });

  test.describe("Admin Role", () => {
    test("should return 401 when invalid admin token is provided", async () => {
      const response = await authenticatedGet("/v1/holidays", "invalid-token-12345", {
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

      const response = await authenticatedGet("/v1/holidays", dev.token, {
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
      const response = await authenticatedGet("/v1/holidays", "invalid-token-12345", {
        validateStatus: () => true,
      });

      expect(response.status).toBe(401);
      const body =
        typeof response.data === "string" ? response.data : JSON.stringify(response.data);
      expect(body).toContain("Authorization failed");
    });
  });
});

test.describe("POST /v1/holidays", () => {
  test.describe("Admin Role", () => {
    test("should return 401 when authorization header is missing", async () => {
      const response = await unauthenticatedPost("/v1/holidays", {
        dates: ["2025-01-15"],
      });

      expect(response.status).toBe(401);
    });
  });
});

test.describe("DELETE /v1/holidays", () => {
  test.describe("Admin Role", () => {
    test("should return 401 when authorization header is missing", async () => {
      const response = await unauthenticatedDelete("/v1/holidays", {
        data: {
          dates: ["2025-01-15"],
        },
      });

      expect(response.status).toBe(401);
    });
  });
});
