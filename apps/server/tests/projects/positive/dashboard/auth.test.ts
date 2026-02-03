import { test, expect } from "../../../helpers/test-fixtures";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { authenticatedPost } from "../../../helpers/api-client";
import { v1_dashboard_schemas } from "@ganaka/schemas";

test.describe("POST /v1/dashboard/auth/sign-in", () => {
  test("should return 200 with developer data when valid token provided", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);

    const response = await authenticatedPost("/v1/dashboard/auth/sign-in", dev.token, {
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
      v1_dashboard_schemas.v1_dashboard_auth_schemas.signIn.response.parse(body);
    expect(validatedData.data.id).toBe(dev.id);
    expect(validatedData.data.username).toBe(dev.username);
  });

  test("should validate response schema matches expected structure", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);

    const response = await authenticatedPost("/v1/dashboard/auth/sign-in", dev.token, {
      developerToken: dev.token,
    });

    expect(response.status).toBe(200);
    const body = response.data;

    // Validate response matches schema
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_auth_schemas.signIn.response.parse(body);
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

    const response = await authenticatedPost("/v1/dashboard/auth/sign-in", dev.token, {
      developerToken: dev.token,
    });

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.data.id).toBe(dev.id);
    expect(body.data.username).toBe(dev.username);
  });
});
