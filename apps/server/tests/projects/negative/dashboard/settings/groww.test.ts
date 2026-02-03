import { test, expect } from "../../../../helpers/test-fixtures";
import { authenticatedPut } from "../../../../helpers/api-client";
import { createDeveloperUser } from "../../../../helpers/auth-helpers";
import {
  createValidGrowwCredentials,
  createInvalidGrowwCredentials,
} from "../../../../fixtures/test-data";

test.describe("PUT /v1/groww/credentials", () => {
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
});
