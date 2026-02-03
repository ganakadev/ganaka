import { v1_developer_groww_schemas } from "@ganaka/schemas";
import { authenticatedGet, unauthenticatedGet } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";

let developerToken: string;
let developerId: string;
let sharedTracker: TestDataTracker;

test.beforeAll(async () => {
  sharedTracker = new TestDataTracker();
  const dev = await createDeveloperUser(undefined, sharedTracker);
  developerToken = dev.token;
  developerId = dev.id;
});

test.afterAll(async () => {
  if (sharedTracker) {
    await sharedTracker.cleanup();
  }
});

test.describe("GET /v1/developer/groww/token", () => {
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet("/v1/developer/groww/token");

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization header is required");
  });

  test("should return 401 when invalid token is provided", async () => {
    const response = await authenticatedGet("/v1/developer/groww/token", "invalid-token-12345", {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization failed");
  });

  test("should return token successfully with valid developer token", async () => {
    const response = await authenticatedGet("/v1/developer/groww/token", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Token fetched successfully");
    expect(typeof body.data).toBe("string");
    expect(body.data.length).toBeGreaterThan(0);

    // Validate response matches schema
    const validatedData = v1_developer_groww_schemas.getGrowwToken.response.parse(body);
    expect(validatedData.data).toBe(body.data);
  });
});
