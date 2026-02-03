import { authenticatedGet } from "../../../helpers/api-client";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";
import { prisma } from "../../../../src/utils/prisma";

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

test.describe("Admin Holidays API", () => {
  test.describe.configure({ mode: "serial" });

  test.describe("GET /v1/holidays", () => {
    test("should return empty array when no holidays exist", async ({ tracker }) => {
      // Clean up any existing holidays from previous tests to ensure isolation
      await prisma.nseHoliday.deleteMany({});

      const response = await authenticatedGet("/v1/holidays", adminToken);

      expect(response.status).toBe(200);
      const body = response.data;
      expect(body.statusCode).toBe(200);
      expect(body.message).toBe("Holidays fetched successfully");
      expect(body.data.holidays).toEqual([]);
    });
  });
});
