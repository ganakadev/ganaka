import { authenticatedPost } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { test, expect } from "../../../helpers/test-fixtures";

test.describe("POST /v1/auth", () => {
  test("should return 400 when developerToken is missing", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);

    const response = await authenticatedPost(
      "/v1/auth",
      dev.token,
      {},
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when developerToken is empty string", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);

    const response = await authenticatedPost(
      "/v1/auth",
      dev.token,
      { developerToken: "" },
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });
});
