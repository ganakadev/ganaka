import { test, expect } from "../../../../helpers/test-fixtures";
import { authenticatedGet } from "../../../../helpers/api-client";
import { createDeveloperUser } from "../../../../helpers/auth-helpers";
import { v1_dashboard_schemas } from "@ganaka/schemas";

test.describe("GET /v1/dashboard/settings/groww/credentials", () => {
  test("should return hasGrowwApiKey: false when no credentials set", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);

    const response = await authenticatedGet("/v1/dashboard/settings/groww/credentials", dev.token);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Groww credentials status fetched successfully");
    expect(body.data.hasGrowwApiKey).toBe(false);
    expect(body.data.hasGrowwApiSecret).toBe(false);
    expect(body.data.growwApiKeyMasked).toBeNull();

    // Validate response matches schema
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_settings_schemas.getGrowwCredentials.response.parse(body);
    expect(validatedData.data.hasGrowwApiKey).toBe(false);
    expect(validatedData.data.hasGrowwApiSecret).toBe(false);
  });
});
