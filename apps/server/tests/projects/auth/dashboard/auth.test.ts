import { test, expect } from "../../../helpers/test-fixtures";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { authenticatedPost } from "../../../helpers/api-client";
import { TestDataTracker } from "../../../helpers/test-tracker";

let sharedTracker: TestDataTracker;

test.beforeAll(async () => {
  sharedTracker = new TestDataTracker();
});

test.afterAll(async () => {
  if (sharedTracker) {
    await sharedTracker.cleanup();
  }
});

test.describe("POST /v1/dashboard/auth/sign-in", () => {
  test("should return 401 when invalid developer token provided", async ({ tracker }) => {
    const dev = await createDeveloperUser(undefined, tracker);
    const response = await authenticatedPost(
      "/v1/dashboard/auth/sign-in",
      dev.token,
      { developerToken: "invalid-token-12345" },
      { validateStatus: () => true }
    );

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Invalid developer token");
  });
});
