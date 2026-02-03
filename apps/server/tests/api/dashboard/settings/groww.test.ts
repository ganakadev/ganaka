import { test, expect } from "../../../helpers/test-fixtures";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import {
  authenticatedGet,
  authenticatedPut,
  authenticatedDelete,
  unauthenticatedGet,
  unauthenticatedPut,
  unauthenticatedDelete,
} from "../../../helpers/api-client";
import {
  createValidGrowwCredentials,
  createInvalidGrowwCredentials,
} from "../../../fixtures/test-data";
import {
  getDeveloperGrowwCredentials,
  getDeveloperGrowwCredentialsRaw,
  createTestDeveloperWithGrowwCredentials,
  isEncrypted,
} from "../../../helpers/db-helpers";
import { v1_schemas } from "@ganaka/schemas";

test.describe("GET /v1/groww/credentials", () => {
  // AUTHORIZATION TESTS
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
    const dev = await createDeveloperUser(undefined, tracker);
    const response = await unauthenticatedGet("/v1/groww/credentials", {
      validateStatus: () => true,
      headers: {
        authorization: dev.token, // Missing "Bearer " prefix
      },
    });

    expect(response.status).toBe(401);
  });

  // SUCCESS CASES
  test("should return hasGrowwApiKey: false when no credentials set", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);

    const response = await authenticatedGet("/v1/groww/credentials", dev.token);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Groww credentials status fetched successfully");
    expect(body.data.hasGrowwApiKey).toBe(false);
    expect(body.data.hasGrowwApiSecret).toBe(false);
    expect(body.data.growwApiKeyMasked).toBeNull();

    // Validate response matches schema
    const validatedData =
      v1_schemas.v1_dashboard_settings_schemas.getGrowwCredentials.response.parse(body);
    expect(validatedData.data.hasGrowwApiKey).toBe(false);
    expect(validatedData.data.hasGrowwApiSecret).toBe(false);
  });

  test("should return hasGrowwApiKey: true with masked key when credentials are set", async ({
    tracker,
  }) => {
    const creds = createValidGrowwCredentials();
    const dev = await createTestDeveloperWithGrowwCredentials(
      tracker,
      undefined,
      creds.growwApiKey,
      creds.growwApiSecret
    );

    const response = await authenticatedGet("/v1/groww/credentials", dev.token);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.data.hasGrowwApiKey).toBe(true);
    expect(body.data.hasGrowwApiSecret).toBe(true);
    expect(body.data.growwApiKeyMasked).toBeTruthy();
    expect(typeof body.data.growwApiKeyMasked).toBe("string");
    expect(body.data.growwApiKeyMasked.length).toBeGreaterThan(0);
  });

  test("should mask API key correctly (show first 4 and last 4 chars)", async ({ tracker }) => {
    const creds = createValidGrowwCredentials();
    const dev = await createTestDeveloperWithGrowwCredentials(
      tracker,
      undefined,
      creds.growwApiKey,
      creds.growwApiSecret
    );

    const response = await authenticatedGet("/v1/groww/credentials", dev.token);

    expect(response.status).toBe(200);
    const maskedKey = response.data.data.growwApiKeyMasked;
    expect(maskedKey).toBeTruthy();

    // Check masking format: should contain "..." and have at least 8 characters (4 + 3 + 4)
    expect(maskedKey).toContain("...");
    expect(maskedKey.length).toBeGreaterThanOrEqual(8);

    // Verify it doesn't contain the full key
    expect(maskedKey).not.toBe(creds.growwApiKey);
  });

  test("should return correct status for different developers (isolation test)", async ({
    tracker,
  }) => {
    const dev1 = await createDeveloperUser(undefined, tracker);
    const creds = createValidGrowwCredentials();
    const dev2 = await createTestDeveloperWithGrowwCredentials(
      tracker,
      undefined,
      creds.growwApiKey,
      creds.growwApiSecret
    );

    // Dev1 should have no credentials
    const response1 = await authenticatedGet(
      "/v1/groww/credentials",
      dev1.token
    );
    expect(response1.status).toBe(200);
    expect(response1.data.data.hasGrowwApiKey).toBe(false);

    // Dev2 should have credentials
    const response2 = await authenticatedGet(
      "/v1/groww/credentials",
      dev2.token
    );
    expect(response2.status).toBe(200);
    expect(response2.data.data.hasGrowwApiKey).toBe(true);
  });
});

test.describe("PUT /v1/groww/credentials", () => {
  // AUTHORIZATION TESTS
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

  // VALIDATION TESTS
  test("should return 400 when growwApiKey is missing", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);
    const creds = createValidGrowwCredentials();

    const response = await authenticatedPut(
      "/v1/groww/credentials",
      dev.token,
      { growwApiSecret: creds.growwApiSecret },
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when growwApiSecret is missing", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);
    const creds = createValidGrowwCredentials();

    const response = await authenticatedPut(
      "/v1/groww/credentials",
      dev.token,
      { growwApiKey: creds.growwApiKey },
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when growwApiKey is empty string", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);
    const invalidCreds = createInvalidGrowwCredentials();

    const response = await authenticatedPut(
      "/v1/groww/credentials",
      dev.token,
      invalidCreds,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when growwApiSecret is empty string", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);
    const invalidCreds = createInvalidGrowwCredentials();

    const response = await authenticatedPut(
      "/v1/groww/credentials",
      dev.token,
      invalidCreds,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when body is empty object", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);

    const response = await authenticatedPut(
      "/v1/groww/credentials",
      dev.token,
      {},
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  // SUCCESS CASES
  test("should successfully save credentials and return success: true", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);
    const creds = createValidGrowwCredentials();

    const response = await authenticatedPut(
      "/v1/groww/credentials",
      dev.token,
      creds
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Groww credentials updated successfully");
    expect(body.data.success).toBe(true);

    // Validate response matches schema
    const validatedData =
      v1_schemas.v1_dashboard_settings_schemas.updateGrowwCredentials.response.parse(
        body
      );
    expect(validatedData.data.success).toBe(true);

    // Verify credentials are encrypted in database
    const rawCreds = await getDeveloperGrowwCredentialsRaw(dev.id);
    expect(rawCreds).toBeTruthy();
    expect(rawCreds?.growwApiKey).toBeTruthy();
    expect(rawCreds?.growwApiSecret).toBeTruthy();
    expect(isEncrypted(rawCreds?.growwApiKey ?? null)).toBe(true);
    expect(isEncrypted(rawCreds?.growwApiSecret ?? null)).toBe(true);

    // Verify decryption works correctly
    const savedCreds = await getDeveloperGrowwCredentials(dev.id);
    expect(savedCreds).toBeTruthy();
    expect(savedCreds?.growwApiKey).toBe(creds.growwApiKey);
    expect(savedCreds?.growwApiSecret).toBe(creds.growwApiSecret);
  });

  test("should update existing credentials when called again", async ({ tracker }) => {
    const creds1 = createValidGrowwCredentials();
    const dev = await createTestDeveloperWithGrowwCredentials(
      tracker,
      undefined,
      creds1.growwApiKey,
      creds1.growwApiSecret
    );

    const creds2 = createValidGrowwCredentials();

    const response = await authenticatedPut(
      "/v1/groww/credentials",
      dev.token,
      creds2
    );

    expect(response.status).toBe(200);
    expect(response.data.data.success).toBe(true);

    // Verify new credentials are saved
    const savedCreds = await getDeveloperGrowwCredentials(dev.id);
    expect(savedCreds?.growwApiKey).toBe(creds2.growwApiKey);
    expect(savedCreds?.growwApiSecret).toBe(creds2.growwApiSecret);
    expect(savedCreds?.growwApiKey).not.toBe(creds1.growwApiKey);
  });

  test("should verify decryption works correctly (fetch after save returns correct masked value)", async ({
    tracker,
  }) => {
    const dev = await createDeveloperUser(undefined, tracker);
    const creds = createValidGrowwCredentials();

    // Save credentials
    await authenticatedPut("/v1/groww/credentials", dev.token, creds);

    // Verify credentials are encrypted in database
    const rawCreds = await getDeveloperGrowwCredentialsRaw(dev.id);
    expect(rawCreds?.growwApiKey).toBeTruthy();
    expect(isEncrypted(rawCreds?.growwApiKey ?? null)).toBe(true);

    // Fetch and verify masked key
    const getResponse = await authenticatedGet(
      "/v1/groww/credentials",
      dev.token
    );

    expect(getResponse.status).toBe(200);
    expect(getResponse.data.data.hasGrowwApiKey).toBe(true);
    expect(getResponse.data.data.growwApiKeyMasked).toBeTruthy();

    // Verify masked key format
    const maskedKey = getResponse.data.data.growwApiKeyMasked;
    expect(maskedKey).toContain("...");
    expect(maskedKey.substring(0, 4)).toBe(creds.growwApiKey.substring(0, 4));
    expect(maskedKey.substring(maskedKey.length - 4)).toBe(
      creds.growwApiKey.substring(creds.growwApiKey.length - 4)
    );
  });

  // EDGE CASES
  test("should handle very long API keys", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);
    const longKey = "a".repeat(500);
    const longSecret = "b".repeat(500);

    const response = await authenticatedPut("/v1/groww/credentials", dev.token, {
      growwApiKey: longKey,
      growwApiSecret: longSecret,
    });

    expect(response.status).toBe(200);
    expect(response.data.data.success).toBe(true);

    // Verify long credentials are saved
    const savedCreds = await getDeveloperGrowwCredentials(dev.id);
    expect(savedCreds?.growwApiKey).toBe(longKey);
    expect(savedCreds?.growwApiSecret).toBe(longSecret);
  });

  test("should handle special characters in credentials", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);
    const specialCreds = {
      growwApiKey: "test-key-!@#$%^&*()_+-=[]{}|;':\",./<>?",
      growwApiSecret: "test-secret-!@#$%^&*()_+-=[]{}|;':\",./<>?",
    };

    const response = await authenticatedPut(
      "/v1/groww/credentials",
      dev.token,
      specialCreds
    );

    expect(response.status).toBe(200);
    expect(response.data.data.success).toBe(true);

    // Verify special characters are preserved
    const savedCreds = await getDeveloperGrowwCredentials(dev.id);
    expect(savedCreds?.growwApiKey).toBe(specialCreds.growwApiKey);
    expect(savedCreds?.growwApiSecret).toBe(specialCreds.growwApiSecret);
  });

  test("should only update the authenticated developer's credentials (isolation)", async ({
    tracker,
  }) => {
    const dev1 = await createDeveloperUser(undefined, tracker);
    const dev2 = await createDeveloperUser(undefined, tracker);
    const creds1 = createValidGrowwCredentials();
    const creds2 = createValidGrowwCredentials();

    // Set credentials for dev1
    await authenticatedPut("/v1/groww/credentials", dev1.token, creds1);

    // Set credentials for dev2
    await authenticatedPut("/v1/groww/credentials", dev2.token, creds2);

    // Verify isolation
    const savedCreds1 = await getDeveloperGrowwCredentials(dev1.id);
    const savedCreds2 = await getDeveloperGrowwCredentials(dev2.id);

    expect(savedCreds1?.growwApiKey).toBe(creds1.growwApiKey);
    expect(savedCreds2?.growwApiKey).toBe(creds2.growwApiKey);
    expect(savedCreds1?.growwApiKey).not.toBe(savedCreds2?.growwApiKey);
  });
});

test.describe("DELETE /v1/groww/credentials", () => {
  // AUTHORIZATION TESTS
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

  // SUCCESS CASES
  test("should successfully delete credentials and return success: true", async ({ tracker }) => {
    const creds = createValidGrowwCredentials();
    const dev = await createTestDeveloperWithGrowwCredentials(
      tracker,
      undefined,
      creds.growwApiKey,
      creds.growwApiSecret
    );

    // Verify credentials exist before deletion
    const beforeDelete = await getDeveloperGrowwCredentials(dev.id);
    expect(beforeDelete?.growwApiKey).toBe(creds.growwApiKey);

    const response = await authenticatedDelete(
      "/v1/groww/credentials",
      dev.token
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Groww credentials deleted successfully");
    expect(body.data.success).toBe(true);

    // Validate response matches schema
    const validatedData =
      v1_schemas.v1_dashboard_settings_schemas.deleteGrowwCredentials.response.parse(
        body
      );
    expect(validatedData.data.success).toBe(true);

    // Verify credentials are deleted
    const afterDelete = await getDeveloperGrowwCredentials(dev.id);
    expect(afterDelete?.growwApiKey).toBeNull();
    expect(afterDelete?.growwApiSecret).toBeNull();
  });

  test("should return success: true even when no credentials exist (idempotent)", async ({
    tracker,
  }) => {
    const dev = await createDeveloperUser(undefined, tracker);

    // First delete (no credentials exist)
    const response1 = await authenticatedDelete(
      "/v1/groww/credentials",
      dev.token
    );

    expect(response1.status).toBe(200);
    expect(response1.data.data.success).toBe(true);

    // Second delete (still no credentials)
    const response2 = await authenticatedDelete(
      "/v1/groww/credentials",
      dev.token
    );

    expect(response2.status).toBe(200);
    expect(response2.data.data.success).toBe(true);
  });

  test("should verify credentials are null after deletion", async ({ tracker }) => {
    const creds = createValidGrowwCredentials();
    const dev = await createTestDeveloperWithGrowwCredentials(
      tracker,
      undefined,
      creds.growwApiKey,
      creds.growwApiSecret
    );

    await authenticatedDelete("/v1/groww/credentials", dev.token);

    const savedCreds = await getDeveloperGrowwCredentials(dev.id);
    expect(savedCreds?.growwApiKey).toBeNull();
    expect(savedCreds?.growwApiSecret).toBeNull();
  });

  test("should only delete the authenticated developer's credentials (isolation)", async ({
    tracker,
  }) => {
    const creds1 = createValidGrowwCredentials();
    const creds2 = createValidGrowwCredentials();
    const dev1 = await createTestDeveloperWithGrowwCredentials(
      tracker,
      undefined,
      creds1.growwApiKey,
      creds1.growwApiSecret
    );
    const dev2 = await createTestDeveloperWithGrowwCredentials(
      tracker,
      undefined,
      creds2.growwApiKey,
      creds2.growwApiSecret
    );

    // Delete dev1's credentials
    await authenticatedDelete("/v1/groww/credentials", dev1.token);

    // Verify dev1's credentials are deleted
    const savedCreds1 = await getDeveloperGrowwCredentials(dev1.id);
    expect(savedCreds1?.growwApiKey).toBeNull();

    // Verify dev2's credentials are still intact
    const savedCreds2 = await getDeveloperGrowwCredentials(dev2.id);
    expect(savedCreds2?.growwApiKey).toBe(creds2.growwApiKey);
  });

  // EDGE CASES
  test("calling delete multiple times should be idempotent", async ({ tracker }) => {
    const creds = createValidGrowwCredentials();
    const dev = await createTestDeveloperWithGrowwCredentials(
      tracker,
      undefined,
      creds.growwApiKey,
      creds.growwApiSecret
    );

    // First delete
    const response1 = await authenticatedDelete(
      "/v1/groww/credentials",
      dev.token
    );
    expect(response1.status).toBe(200);
    expect(response1.data.data.success).toBe(true);

    // Second delete (should still succeed)
    const response2 = await authenticatedDelete(
      "/v1/groww/credentials",
      dev.token
    );
    expect(response2.status).toBe(200);
    expect(response2.data.data.success).toBe(true);

    // Third delete (should still succeed)
    const response3 = await authenticatedDelete(
      "/v1/groww/credentials",
      dev.token
    );
    expect(response3.status).toBe(200);
    expect(response3.data.data.success).toBe(true);

    // Verify credentials are still null
    const savedCreds = await getDeveloperGrowwCredentials(dev.id);
    expect(savedCreds?.growwApiKey).toBeNull();
  });
});
