import { test, expect } from "../../helpers/test-fixtures";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import { authenticatedPost, unauthenticatedPost } from "../../helpers/api-client";
import { v1_schemas } from "@ganaka/schemas";

test.describe("POST /v1/auth/sign-in", () => {
  test("should return 200 with developer data when valid token provided", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);

    const response = await authenticatedPost("/v1/auth/sign-in", dev.token, {
      developerToken: dev.token,
    });

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Developer signed in successfully");
    expect(body.data.id).toBe(dev.id);
    expect(body.data.username).toBe(dev.username);

    // Validate response matches schema
    const validatedData =
      v1_schemas.v1_dashboard_auth_schemas.signIn.response.parse(body);
    expect(validatedData.data.id).toBe(dev.id);
    expect(validatedData.data.username).toBe(dev.username);
  });

  test("should return 401 when invalid developer token provided", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);
    const response = await authenticatedPost(
      "/v1/auth/sign-in",
      dev.token,
      { developerToken: "invalid-token-12345" },
      { validateStatus: () => true }
    );

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Invalid developer token");
  });

  test("should return 400 when developerToken is missing", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);

    const response = await authenticatedPost(
      "/v1/auth/sign-in",
      dev.token,
      {},
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when developerToken is empty string", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);

    const response = await authenticatedPost(
      "/v1/auth/sign-in",
      dev.token,
      { developerToken: "" },
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should validate response schema matches expected structure", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);

    const response = await authenticatedPost("/v1/auth/sign-in", dev.token, {
      developerToken: dev.token,
    });

    expect(response.status).toBe(200);
    const body = response.data;

    // Validate response matches schema
    const validatedData =
      v1_schemas.v1_dashboard_auth_schemas.signIn.response.parse(body);
    expect(validatedData.statusCode).toBe(200);
    expect(validatedData.message).toBe("Developer signed in successfully");
    expect(validatedData.data).toHaveProperty("id");
    expect(validatedData.data).toHaveProperty("username");
    expect(typeof validatedData.data.id).toBe("string");
    expect(typeof validatedData.data.username).toBe("string");
    expect(validatedData.data.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  test("should return exact developer id and username matching database", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);

    const response = await authenticatedPost("/v1/auth/sign-in", dev.token, {
      developerToken: dev.token,
    });

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.data.id).toBe(dev.id);
    expect(body.data.username).toBe(dev.username);
  });
});
