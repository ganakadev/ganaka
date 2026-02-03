import { test, expect } from "../../../../helpers/test-fixtures";
import { authenticatedPut, authenticatedGet } from "../../../../helpers/api-client";
import { createDeveloperUser } from "../../../../helpers/auth-helpers";
import {
  createValidGrowwCredentials,
  createTestDeveloperWithGrowwCredentials,
} from "../../../../fixtures/test-data";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import {
  getDeveloperGrowwCredentials,
  getDeveloperGrowwCredentialsRaw,
  isEncrypted,
} from "../../../../helpers/db-helpers";

test.describe("PUT /v1/dashboard/settings/groww/credentials", () => {
  test("should successfully save credentials and return success: true", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);
    const creds = createValidGrowwCredentials();

    const response = await authenticatedPut(
      "/v1/dashboard/settings/groww/credentials",
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
      v1_dashboard_schemas.v1_dashboard_settings_schemas.updateGrowwCredentials.response.parse(
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
      "/v1/dashboard/settings/groww/credentials",
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
    await authenticatedPut("/v1/dashboard/settings/groww/credentials", dev.token, creds);

    // Verify credentials are encrypted in database
    const rawCreds = await getDeveloperGrowwCredentialsRaw(dev.id);
    expect(rawCreds?.growwApiKey).toBeTruthy();
    expect(isEncrypted(rawCreds?.growwApiKey ?? null)).toBe(true);

    // Fetch and verify masked key
    const getResponse = await authenticatedGet(
      "/v1/dashboard/settings/groww/credentials",
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

  test("should handle very long API keys", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);
    const longKey = "a".repeat(500);
    const longSecret = "b".repeat(500);

    const response = await authenticatedPut("/v1/dashboard/settings/groww/credentials", dev.token, {
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
      "/v1/dashboard/settings/groww/credentials",
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
    await authenticatedPut("/v1/dashboard/settings/groww/credentials", dev1.token, creds1);

    // Set credentials for dev2
    await authenticatedPut("/v1/dashboard/settings/groww/credentials", dev2.token, creds2);

    // Verify isolation
    const savedCreds1 = await getDeveloperGrowwCredentials(dev1.id);
    const savedCreds2 = await getDeveloperGrowwCredentials(dev2.id);

    expect(savedCreds1?.growwApiKey).toBe(creds1.growwApiKey);
    expect(savedCreds2?.growwApiKey).toBe(creds2.growwApiKey);
    expect(savedCreds1?.growwApiKey).not.toBe(savedCreds2?.growwApiKey);
  });
});
