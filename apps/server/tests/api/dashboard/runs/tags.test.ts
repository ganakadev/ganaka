import { v1_dashboard_schemas } from "@ganaka/schemas";
import { expect, test } from "../../../helpers/test-fixtures";
import { authenticatedGet, unauthenticatedGet } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { createRun } from "../../../helpers/db-helpers";
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

test.describe("GET /v1/dashboard/runs/tags", () => {
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet("/v1/dashboard/runs/tags");

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const response = await authenticatedGet("/v1/dashboard/runs/tags", "invalid-token-12345", {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });

  test("should return 200 with empty array when no runs exist", async () => {
    const response = await authenticatedGet("/v1/dashboard/runs/tags", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Tags fetched successfully");
    expect(body.data).toEqual([]);
  });

  test("should return 200 with unique tags from all runs", async ({ tracker }) => {
    // Create runs with different tags
    await createRun(developerId, "2025-01-01T09:15:00", "2025-01-01T15:30:00", tracker, {
      tags: ["v1", "momentum"],
    });
    await createRun(developerId, "2025-01-02T09:15:00", "2025-01-02T15:30:00", tracker, {
      tags: ["v1", "experiment"],
    });
    await createRun(developerId, "2025-01-03T09:15:00", "2025-01-03T15:30:00", tracker, {
      tags: ["test"],
    });

    const response = await authenticatedGet("/v1/dashboard/runs/tags", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Tags fetched successfully");
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBe(4); // v1, momentum, experiment, test
    expect(body.data).toContain("v1");
    expect(body.data).toContain("momentum");
    expect(body.data).toContain("experiment");
    expect(body.data).toContain("test");
    // Should be sorted
    expect(body.data).toEqual(["experiment", "momentum", "test", "v1"]);
  });

  test("should return unique tags (remove duplicates)", async ({ tracker }) => {
    // Create runs with duplicate tags
    await createRun(developerId, "2025-01-01T09:15:00", "2025-01-01T15:30:00", tracker, {
      tags: ["v1", "momentum"],
    });
    await createRun(developerId, "2025-01-02T09:15:00", "2025-01-02T15:30:00", tracker, {
      tags: ["v1", "momentum"],
    });

    const response = await authenticatedGet("/v1/dashboard/runs/tags", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.data).toEqual(["momentum", "v1"]); // Should be sorted and unique
  });

  test("should return empty array when all runs have no tags", async ({ tracker }) => {
    // Create runs without tags
    await createRun(developerId, "2025-01-01T09:15:00", "2025-01-01T15:30:00", tracker, {
      tags: [],
    });
    await createRun(developerId, "2025-01-02T09:15:00", "2025-01-02T15:30:00", tracker);

    const response = await authenticatedGet("/v1/dashboard/runs/tags", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.data).toEqual([]);
  });

  test("should validate response structure matches schema", async ({ tracker }) => {
    await createRun(developerId, "2025-01-01T09:15:00", "2025-01-01T15:30:00", tracker, {
      tags: ["v1", "momentum"],
    });

    const response = await authenticatedGet("/v1/dashboard/runs/tags", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;

    // Validate response matches schema
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_runs_tags_schemas.getRunTags.response.parse(body);
    expect(validatedData.data).toBeInstanceOf(Array);
    expect(validatedData.data.every((tag: any) => typeof tag === "string")).toBe(true);
  });

  test("should only return tags for authenticated developer's runs", async ({ tracker }) => {
    // Create a run for the current developer
    await createRun(developerId, "2025-01-01T09:15:00", "2025-01-01T15:30:00", tracker, {
      tags: ["developer1-tag"],
    });

    // Create another developer and their run
    const otherDev = await createDeveloperUser(undefined, tracker);
    await createRun(otherDev.id, "2025-01-01T09:15:00", "2025-01-01T15:30:00", tracker, {
      tags: ["developer2-tag"],
    });

    const response = await authenticatedGet("/v1/dashboard/runs/tags", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.data).toContain("developer1-tag");
    expect(body.data).not.toContain("developer2-tag");
  });
});
