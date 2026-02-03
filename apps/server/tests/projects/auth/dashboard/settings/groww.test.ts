import { test, expect } from "../../../../helpers/test-fixtures";
import {
  authenticatedGet,
  authenticatedPut,
  authenticatedDelete,
  unauthenticatedGet,
  unauthenticatedPut,
  unauthenticatedDelete,
} from "../../../../helpers/api-client";
import { createValidGrowwCredentials } from "../../../../fixtures/test-data";

test.describe("GET /v1/groww/credentials", () => {
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet("/v1/groww/credentials");

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization header is required");
  });

  test("should return 401 when invalid developer token is provided", async ({ tracker }) => {
    const response = await authenticatedGet(
      "/v1/groww/credentials",
      "invalid-token-12345",
      { validateStatus: () => true }
    );

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization failed");
  });

  test("should return 401 when token format is invalid (missing Bearer prefix)", async ({
    tracker,
  }) => {
    const { createDeveloperUser } = await import("../../../../helpers/auth-helpers");
    const dev = await createDeveloperUser(undefined, tracker);
    const response = await unauthenticatedGet("/v1/groww/credentials", {
      validateStatus: () => true,
      headers: {
        authorization: dev.token, // Missing "Bearer " prefix
      },
    });

    expect(response.status).toBe(401);
  });
});

test.describe("PUT /v1/groww/credentials", () => {
  test("should return 401 when authorization header is missing", async () => {
    const creds = createValidGrowwCredentials();
    const response = await unauthenticatedPut("/v1/groww/credentials", creds);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid developer token is provided", async ({ tracker }) => {
    const creds = createValidGrowwCredentials();
    const response = await authenticatedPut(
      "/v1/groww/credentials",
      "invalid-token-12345",
      creds,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(401);
  });
});

test.describe("DELETE /v1/groww/credentials", () => {
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedDelete("/v1/groww/credentials");

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid developer token is provided", async ({ tracker }) => {
    const response = await authenticatedDelete(
      "/v1/groww/credentials",
      "invalid-token-12345",
      { validateStatus: () => true }
    );

    expect(response.status).toBe(401);
  });
});
