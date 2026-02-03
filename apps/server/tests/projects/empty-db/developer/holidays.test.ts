import { authenticatedGet } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { expect, test } from "../../../helpers/test-fixtures";
import { TestDataTracker } from "../../../helpers/test-tracker";
import { prisma } from "../../../../src/utils/prisma";
import { v1_developer_holidays_schemas } from "@ganaka/schemas";

let developerToken: string;
let adminToken: string;
let sharedTracker: TestDataTracker;

test.beforeAll(async () => {
  sharedTracker = new TestDataTracker();
  const dev = await createDeveloperUser(undefined, sharedTracker);
  developerToken = dev.token;

  const token = process.env.TEST_ADMIN_TOKEN;
  if (!token) {
    throw new Error("TEST_ADMIN_TOKEN not set in environment");
  }
  adminToken = token;
});

test.afterAll(async () => {
  if (sharedTracker) {
    await sharedTracker.cleanup();
  }
});

test.describe("GET /v1/holidays", () => {
  test.describe.configure({ mode: "serial" });

  test("should return 200 with empty holidays array when no holidays exist", async ({
    tracker,
  }) => {
    // Clean up any existing holidays from previous tests to ensure isolation
    await prisma.nseHoliday.deleteMany({});

    const response = await authenticatedGet("/v1/holidays", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Holidays fetched successfully");
    expect(body.data.holidays).toEqual([]);

    // Validate response matches schema
    const validatedData = v1_developer_holidays_schemas.getHolidays.response.parse(body);
    expect(validatedData.data.holidays).toEqual([]);
  });
});
