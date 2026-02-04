import { authenticatedDelete } from "../../../../helpers/api-client";
import { expect, test } from "../../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../../helpers/test-tracker";

let adminToken: string;
let sharedTracker: TestDataTracker;

test.beforeAll(async () => {
  const token = process.env.TEST_ADMIN_TOKEN;
  if (!token) {
    throw new Error("TEST_ADMIN_TOKEN not set in environment");
  }
  adminToken = token;
  sharedTracker = new TestDataTracker();
});

test.afterAll(async () => {
  if (sharedTracker) {
    await sharedTracker.cleanup();
  }
});

test.describe("DELETE /v1/dates", () => {
  test.describe("Admin Role", () => {
    test("should return 400 when dates array is empty", async () => {
      const response = await authenticatedDelete("/v1/dates", adminToken, {
        data: {
          dates: [],
        },
        validateStatus: () => true,
      });

      expect(response.status).toBe(400);
    });

    test("should return 400 when date format is invalid", async () => {
      const response = await authenticatedDelete("/v1/dates", adminToken, {
        data: {
          dates: ["invalid-date"],
        },
        validateStatus: () => true,
      });

      expect(response.status).toBe(400);
    });
  });
});
