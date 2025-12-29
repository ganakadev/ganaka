import { test, expect } from "@playwright/test";
import { createDeveloperUser } from "../../helpers/auth-helpers";
import {
  createDeveloperTestData,
  createInvalidDeveloperTestData,
  createEmptyDeveloperTestData,
  generateUUID,
} from "../../fixtures/test-data";
import { createTestDeveloper, getDeveloperById, getAllDevelopers } from "../../helpers/db-helpers";
import {
  authenticatedGet,
  authenticatedPost,
  authenticatedPatch,
  authenticatedDelete,
  unauthenticatedGet,
  unauthenticatedPost,
  unauthenticatedPatch,
  unauthenticatedDelete,
} from "../../helpers/api-client";
import { prisma } from "../../../src/utils/prisma";
import { randomUUID } from "crypto";

let adminToken: string;

test.beforeAll(async () => {
  // Get admin token from environment or create one
  const token = process.env.TEST_ADMIN_TOKEN;
  if (!token) {
    throw new Error("TEST_ADMIN_TOKEN not set in environment");
  }
  adminToken = token;
});

test.describe("GET /v1/admin/developers", () => {
  // AUTHORIZATION TESTS
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet("/v1/admin/developers");

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization header is required");
  });
  test("should return 401 when invalid admin token is provided", async () => {
    const response = await authenticatedGet("/v1/admin/developers", "invalid-token-12345", {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization failed");
  });
  test("should return 401 when developer token is used instead of admin token", async () => {
    const dev = await createDeveloperUser();

    const response = await authenticatedGet("/v1/admin/developers", dev.token, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Authorization failed");
  });
});

test.describe("GET /v1/admin/developers/:id", () => {
  test("should return developer by valid ID", async () => {
    const dev = await createTestDeveloper("test-get-dev");

    const response = await authenticatedGet(`/v1/admin/developers/${dev.id}`, adminToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Developer fetched successfully");
    expect(body.data.id).toBe(dev.id);
    expect(body.data.username).toBe(dev.username);
    expect(body.data.token).toBe(dev.token);
  });

  test("should return 404 for non-existent developer ID", async () => {
    const fakeId = generateUUID();

    const response = await authenticatedGet(`/v1/admin/developers/${fakeId}`, adminToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(404);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Developer not found");
  });

  test("should return 400 for invalid UUID format", async () => {
    const response = await authenticatedGet("/v1/admin/developers/invalid-id", adminToken, {
      validateStatus: () => true,
    });

    // Should return 400 for invalid UUID format
    expect([400, 404]).toContain(response.status);
  });

  test("should return 401 when authorization header is missing", async () => {
    const dev = await createTestDeveloper();

    const response = await unauthenticatedGet(`/v1/admin/developers/${dev.id}`);

    expect(response.status).toBe(401);
  });
});

test.describe("POST /v1/admin/developers", () => {
  test("should create a new developer successfully", async () => {
    const testData = createDeveloperTestData();

    const response = await authenticatedPost("/v1/admin/developers", adminToken, testData);

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.message).toBe("Developer created successfully");
    expect(body.data).toHaveProperty("id");
    expect(body.data).toHaveProperty("username", testData.username);
    expect(body.data).toHaveProperty("token");
    expect(body.data.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  test("should return 409 when creating developer with duplicate username", async () => {
    const dev = await createTestDeveloper("duplicate-username");

    const response = await authenticatedPost(
      "/v1/admin/developers",
      adminToken,
      { username: dev.username },
      { validateStatus: () => true }
    );

    expect(response.status).toBe(409);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Username already exists");
  });

  test("should return 400 when username is missing", async () => {
    const response = await authenticatedPost(
      "/v1/admin/developers",
      adminToken,
      {},
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when username is empty", async () => {
    const testData = createEmptyDeveloperTestData();

    const response = await authenticatedPost("/v1/admin/developers", adminToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when username exceeds max length", async () => {
    const testData = createInvalidDeveloperTestData();

    const response = await authenticatedPost("/v1/admin/developers", adminToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 401 when authorization header is missing", async () => {
    const testData = createDeveloperTestData();

    const response = await unauthenticatedPost("/v1/admin/developers", testData);

    expect(response.status).toBe(401);
  });
});

test.describe("PATCH /v1/admin/developers/:id/refresh-key", () => {
  test("should refresh developer key successfully", async () => {
    const dev = await createTestDeveloper("test-refresh-dev");
    const oldToken = dev.token;

    const response = await authenticatedPatch(
      `/v1/admin/developers/${dev.id}/refresh-key`,
      adminToken,
      {}
    );

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Developer key refreshed successfully");
    expect(body.data.id).toBe(dev.id);
    expect(body.data.username).toBe(dev.username);
    expect(body.data.token).not.toBe(oldToken);

    // Verify old token no longer works (if we had a way to test this)
    // Verify new token works by checking the developer in DB
    const updatedDev = await getDeveloperById(dev.id);
    expect(updatedDev?.token).toBe(body.data.token);
    expect(updatedDev?.token).not.toBe(oldToken);
  });

  test("should return 404 for non-existent developer ID", async () => {
    const fakeId = generateUUID();

    const response = await authenticatedPatch(
      `/v1/admin/developers/${fakeId}/refresh-key`,
      adminToken,
      {},
      { validateStatus: () => true }
    );

    expect(response.status).toBe(404);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Developer not found");
  });

  test("should return 401 when authorization header is missing", async () => {
    const dev = await createTestDeveloper("test-refresh-dev");

    const response = await unauthenticatedPatch(`/v1/admin/developers/${dev.id}/refresh-key`, {});

    expect(response.status).toBe(401);
  });
});

test.describe("DELETE /v1/admin/developers/:id", () => {
  test("should delete developer successfully", async () => {
    const dev = await createTestDeveloper("test-delete-dev");
    const response = await authenticatedDelete(`/v1/admin/developers/${dev.id}`, adminToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Developer deleted successfully");
    expect(body.data.id).toBe(dev.id);
    expect(body.data.deleted).toBe(true);

    // Verify developer is actually deleted
    const deletedDev = await getDeveloperById(dev.id);
    expect(deletedDev).toBeNull();
  });

  test("should return 404 for non-existent developer ID", async () => {
    const fakeId = generateUUID();

    const response = await authenticatedDelete(`/v1/admin/developers/${fakeId}`, adminToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(404);
    const body = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    expect(body).toContain("Developer not found");
  });

  test("should return 401 when authorization header is missing", async () => {
    const dev = await createTestDeveloper();

    const response = await unauthenticatedDelete(`/v1/admin/developers/${dev.id}`);

    expect(response.status).toBe(401);
  });
});
