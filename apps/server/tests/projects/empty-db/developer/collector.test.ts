import { test, expect } from "../../../helpers/test-fixtures";
import { authenticatedPost } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { createCollectorQuotesRequest } from "../../../fixtures/test-data";
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

test.describe("POST /v1/developer/collector/quotes", () => {
  test("should return 201 with empty quotes array", async () => {
    const requestBody = createCollectorQuotesRequest([]);
    const response = await authenticatedPost(
      "/v1/developer/collector/quotes",
      developerToken,
      requestBody
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.data.count).toBe(0);
  });
});
