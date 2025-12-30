import { test, expect } from "../../helpers/test-fixtures";
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
import { createDeveloperUser } from "../../helpers/auth-helpers";
import { createRun, createOrder, getRunById, getOrderById } from "../../helpers/db-helpers";
import {
  createRunTestData,
  createOrderTestData,
  TEST_SYMBOL,
  generateUUID as generateTestUUID,
} from "../../fixtures/test-data";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import { TestDataTracker } from "../../helpers/test-tracker";

let developerToken: string;
let developerId: string;
let otherDeveloperToken: string;
let otherDeveloperId: string;
let sharedTracker: TestDataTracker;

test.beforeAll(async () => {
  sharedTracker = new TestDataTracker();
  const dev = await createDeveloperUser(undefined, sharedTracker);
  developerToken = dev.token;
  developerId = dev.id;

  const otherDev = await createDeveloperUser(undefined, sharedTracker);
  otherDeveloperToken = otherDev.token;
  otherDeveloperId = otherDev.id;
});

test.afterAll(async () => {
  if (sharedTracker) {
    await sharedTracker.cleanup();
  }
});

test.describe("GET /v1/dashboard/runs", () => {
  test("should return 401 when authorization header is missing", async () => {
    const response = await unauthenticatedGet("/v1/dashboard/runs");

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const response = await authenticatedGet("/v1/dashboard/runs", "invalid-token-12345", {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });

  test("should return 200 with empty object when no runs exist", async () => {
    const response = await authenticatedGet("/v1/dashboard/runs", developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Runs fetched successfully");
    expect(typeof body.data).toBe("object");
    expect(Object.keys(body.data).length).toBe(0);
  });

  test("should return 200 with runs grouped by date", async ({ tracker }) => {
    const startTime1 = "2025-12-26T09:15:00";
    const endTime1 = "2025-12-26T15:30:00";
    const startTime2 = "2025-12-27T09:15:00";
    const endTime2 = "2025-12-27T15:30:00";

    await createRun(developerId, startTime1, endTime1, tracker, "Asia/Kolkata");
    await createRun(developerId, startTime2, endTime2, tracker, "Asia/Kolkata");

    const response = await authenticatedGet("/v1/dashboard/runs", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_dashboard_schemas.v1_dashboard_runs_schemas.getRuns.response.parse(
      response.data
    );
    expect(Object.keys(validatedData.data).length).toBeGreaterThan(0);
  });

  test("should validate runs are grouped correctly by date (YYYY-MM-DD)", async ({ tracker }) => {
    const startTime = "2025-12-26T09:15:00";
    const endTime = "2025-12-26T15:30:00";
    await createRun(developerId, startTime, endTime, tracker, "Asia/Kolkata");

    const response = await authenticatedGet("/v1/dashboard/runs", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_dashboard_schemas.v1_dashboard_runs_schemas.getRuns.response.parse(
      response.data
    );
    const dateKeys = Object.keys(validatedData.data);
    dateKeys.forEach((dateKey) => {
      expect(dateKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  test("should validate dates are sorted descending (newest first)", async ({ tracker }) => {
    const startTime1 = "2025-12-25T09:15:00";
    const endTime1 = "2025-12-25T15:30:00";
    const startTime2 = "2025-12-26T09:15:00";
    const endTime2 = "2025-12-26T15:30:00";

    await createRun(developerId, startTime1, endTime1, tracker, "Asia/Kolkata");
    await createRun(developerId, startTime2, endTime2, tracker, "Asia/Kolkata");

    const response = await authenticatedGet("/v1/dashboard/runs", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_dashboard_schemas.v1_dashboard_runs_schemas.getRuns.response.parse(
      response.data
    );
    const dateKeys = Object.keys(validatedData.data);

    for (let i = 1; i < dateKeys.length; i++) {
      const prevDate = new Date(dateKeys[i - 1]).getTime();
      const currDate = new Date(dateKeys[i]).getTime();
      expect(prevDate).toBeGreaterThanOrEqual(currDate);
    }
  });

  test("should validate run structure (id, startTime, endTime, completed, orderCount)", async ({
    tracker,
  }) => {
    const startTime = "2025-12-26T09:15:00";
    const endTime = "2025-12-26T15:30:00";
    await createRun(developerId, startTime, endTime, tracker, "Asia/Kolkata");

    const response = await authenticatedGet("/v1/dashboard/runs", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_dashboard_schemas.v1_dashboard_runs_schemas.getRuns.response.parse(
      response.data
    );

    const dateKeys = Object.keys(validatedData.data);
    if (dateKeys.length > 0) {
      const runs = validatedData.data[dateKeys[0]];
      if (runs.length > 0) {
        const firstRun = runs[0];
        expect(firstRun).toHaveProperty("id");
        expect(firstRun).toHaveProperty("start_datetime");
        expect(firstRun).toHaveProperty("end_datetime");
        expect(firstRun).toHaveProperty("completed");
        expect(firstRun).toHaveProperty("orderCount");
        expect(typeof firstRun.id).toBe("string");
        expect(typeof firstRun.completed).toBe("boolean");
        expect(typeof firstRun.orderCount).toBe("number");
      }
    }
  });

  test("should validate exact date grouping ", async ({ tracker }) => {
    const startTime = "2025-12-26T09:15:00";
    const endTime = "2025-12-26T15:30:00";
    await createRun(developerId, startTime, endTime, tracker);

    const response = await authenticatedGet("/v1/dashboard/runs", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_dashboard_schemas.v1_dashboard_runs_schemas.getRuns.response.parse(
      response.data
    );

    expect(validatedData.data).toHaveProperty("2025-12-26");
    expect(validatedData.data["2025-12-26"].length).toBe(1);
  });
});

test.describe("POST /v1/dashboard/runs", () => {
  test("should return 401 when authorization header is missing", async () => {
    const testData = createRunTestData();
    const response = await unauthenticatedPost("/v1/dashboard/runs", testData);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const testData = createRunTestData();
    const response = await authenticatedPost(
      "/v1/dashboard/runs",
      "invalid-token-12345",
      testData,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 when startTime is missing", async () => {
    const testData = { end_datetime: createRunTestData().end_datetime };
    const response = await authenticatedPost("/v1/dashboard/runs", developerToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when endTime is missing", async () => {
    const testData = { start_datetime: createRunTestData().start_datetime };
    const response = await authenticatedPost("/v1/dashboard/runs", developerToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when startTime is invalid date format", async () => {
    const testData = {
      start_datetime: "invalid-date",
      end_datetime: createRunTestData().end_datetime,
    };
    const response = await authenticatedPost("/v1/dashboard/runs", developerToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when endTime is invalid date format", async () => {
    const testData = {
      start_datetime: createRunTestData().start_datetime,
      end_datetime: "invalid-date",
    };
    const response = await authenticatedPost("/v1/dashboard/runs", developerToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 201 with created run when valid data provided", async () => {
    const testData = createRunTestData();
    const response = await authenticatedPost("/v1/dashboard/runs", developerToken, testData);

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.message).toBe("Run created successfully");
    expect(body.data).toHaveProperty("id");
    expect(body.data).toHaveProperty("start_datetime");
    expect(body.data).toHaveProperty("end_datetime");
    expect(body.data).toHaveProperty("completed");
  });

  test("should validate response structure matches schema", async () => {
    const testData = createRunTestData();
    const response = await authenticatedPost("/v1/dashboard/runs", developerToken, testData);

    expect(response.status).toBe(201);
    const validatedData = v1_dashboard_schemas.v1_dashboard_runs_schemas.createRun.response.parse(
      response.data
    );
    expect(validatedData.data).toHaveProperty("id");
    expect(validatedData.data).toHaveProperty("start_datetime");
    expect(validatedData.data).toHaveProperty("end_datetime");
    expect(validatedData.data).toHaveProperty("completed");
  });

  test("should validate run belongs to authenticated developer", async () => {
    const testData = createRunTestData();
    const response = await authenticatedPost("/v1/dashboard/runs", developerToken, testData);

    expect(response.status).toBe(201);
    const runId = response.data.data.id;
    const run = await getRunById(runId);
    expect(run).not.toBeNull();
    expect(run?.developerId).toBe(developerId);
  });

  test("should validate exact timestamps", async () => {
    const testData = createRunTestData();
    const response = await authenticatedPost("/v1/dashboard/runs", developerToken, testData);

    expect(response.status).toBe(201);
    const validatedData = v1_dashboard_schemas.v1_dashboard_runs_schemas.createRun.response.parse(
      response.data
    );
    expect(validatedData.data).toHaveProperty("start_datetime");
    expect(validatedData.data).toHaveProperty("end_datetime");
    expect(validatedData.data.start_datetime).toBe(testData.start_datetime);
    expect(validatedData.data.end_datetime).toBe(testData.end_datetime);
  });
});

test.describe("PATCH /v1/dashboard/runs/:runId", () => {
  test("should return 401 when authorization header is missing", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await unauthenticatedPatch(`/v1/dashboard/runs/${run.id}`, {
      completed: true,
    });

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await authenticatedPatch(
      `/v1/dashboard/runs/${run.id}`,
      "invalid-token-12345",
      { completed: true },
      { validateStatus: () => true }
    );

    expect(response.status).toBe(401);
  });

  test("should return 404 when runId is invalid UUID", async () => {
    const response = await authenticatedPatch(
      "/v1/dashboard/runs/invalid-id",
      developerToken,
      { completed: true },
      { validateStatus: () => true }
    );

    expect([400, 404]).toContain(response.status);
  });

  test("should return 404 when run does not exist", async () => {
    const fakeId = generateTestUUID();
    const response = await authenticatedPatch(
      `/v1/dashboard/runs/${fakeId}`,
      developerToken,
      { completed: true },
      { validateStatus: () => true }
    );

    expect(response.status).toBe(404);
  });

  test("should return 404 when run belongs to different developer", async ({ tracker }) => {
    const run = await createRun(
      otherDeveloperId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await authenticatedPatch(
      `/v1/dashboard/runs/${run.id}`,
      developerToken,
      { completed: true },
      { validateStatus: () => true }
    );

    expect(response.status).toBe(404);
  });

  test("should return 200 with updated run when valid data provided", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await authenticatedPatch(`/v1/dashboard/runs/${run.id}`, developerToken, {
      completed: true,
    });

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Run updated successfully");
    expect(body.data.completed).toBe(true);
  });

  test("should validate response structure matches schema", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await authenticatedPatch(`/v1/dashboard/runs/${run.id}`, developerToken, {
      completed: true,
    });

    expect(response.status).toBe(200);
    const validatedData = v1_dashboard_schemas.v1_dashboard_runs_schemas.updateRun.response.parse(
      response.data
    );
    expect(validatedData.data).toHaveProperty("id");
    expect(validatedData.data).toHaveProperty("start_datetime");
    expect(validatedData.data).toHaveProperty("end_datetime");
    expect(validatedData.data).toHaveProperty("completed");
  });

  test("should validate completed status is updated correctly", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    expect(run.completed).toBe(false);

    const response = await authenticatedPatch(`/v1/dashboard/runs/${run.id}`, developerToken, {
      completed: true,
    });

    expect(response.status).toBe(200);
    const updatedRun = await getRunById(run.id);
    expect(updatedRun?.completed).toBe(true);
  });

  test("should validate exact timestamps preserved ", async ({ tracker }) => {
    const startTime = "2025-12-26T09:15:00";
    const endTime = "2025-12-26T15:30:00";
    const run = await createRun(developerId, startTime, endTime, tracker);

    const response = await authenticatedPatch(`/v1/dashboard/runs/${run.id}`, developerToken, {
      completed: true,
    });

    expect(response.status).toBe(200);
    const validatedData = v1_dashboard_schemas.v1_dashboard_runs_schemas.updateRun.response.parse(
      response.data
    );

    expect(validatedData.data.start_datetime).toBe(startTime);
    expect(validatedData.data.end_datetime).toBe(endTime);
  });
});

test.describe("DELETE /v1/dashboard/runs/:runId", () => {
  test("should return 401 when authorization header is missing", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await unauthenticatedDelete(`/v1/dashboard/runs/${run.id}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await authenticatedDelete(
      `/v1/dashboard/runs/${run.id}`,
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 404 when runId is invalid UUID", async () => {
    const response = await authenticatedDelete("/v1/dashboard/runs/invalid-id", developerToken, {
      validateStatus: () => true,
    });

    expect([400, 404]).toContain(response.status);
  });

  test("should return 404 when run does not exist", async () => {
    const fakeId = generateTestUUID();
    const response = await authenticatedDelete(`/v1/dashboard/runs/${fakeId}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(404);
  });

  test("should return 404 when run belongs to different developer", async ({ tracker }) => {
    const run = await createRun(
      otherDeveloperId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await authenticatedDelete(`/v1/dashboard/runs/${run.id}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(404);
  });

  test("should return 200 with deleted run id when valid", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await authenticatedDelete(`/v1/dashboard/runs/${run.id}`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Run deleted successfully");
    expect(body.data.id).toBe(run.id);
  });

  test("should validate run is actually deleted from database", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    await authenticatedDelete(`/v1/dashboard/runs/${run.id}`, developerToken);

    const deletedRun = await getRunById(run.id);
    expect(deletedRun).toBeNull();
  });
});

test.describe("GET /v1/dashboard/runs/:runId/orders", () => {
  test("should return 401 when authorization header is missing", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await unauthenticatedGet(`/v1/dashboard/runs/${run.id}/orders`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await authenticatedGet(
      `/v1/dashboard/runs/${run.id}/orders`,
      "invalid-token-12345",
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(401);
  });

  test("should return 404 when runId is invalid UUID", async () => {
    const response = await authenticatedGet(
      "/v1/dashboard/runs/invalid-id/orders",
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect([400, 404]).toContain(response.status);
  });

  test("should return 404 when run does not exist", async () => {
    const fakeId = generateTestUUID();
    const response = await authenticatedGet(`/v1/dashboard/runs/${fakeId}/orders`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(404);
  });

  test("should return 404 when run belongs to different developer", async ({ tracker }) => {
    const run = await createRun(
      otherDeveloperId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await authenticatedGet(`/v1/dashboard/runs/${run.id}/orders`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(404);
  });

  test("should return 200 with empty array when no orders exist", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await authenticatedGet(`/v1/dashboard/runs/${run.id}/orders`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Orders fetched successfully");
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBe(0);
  });

  test("should return 200 with orders when valid runId provided", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    await createOrder(
      run.id,
      orderData.nseSymbol,
      orderData.entryPrice,
      orderData.stopLossPrice,
      orderData.takeProfitPrice,
      orderData.datetime,
      tracker
    );

    const response = await authenticatedGet(`/v1/dashboard/runs/${run.id}/orders`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Orders fetched successfully");
    expect(body.data.length).toBeGreaterThan(0);
  });

  test("should validate order structure (id, nseSymbol, entryPrice, stopLossPrice, takeProfitPrice, timestamp, runId)", async ({
    tracker,
  }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    await createOrder(
      run.id,
      orderData.nseSymbol,
      orderData.entryPrice,
      orderData.stopLossPrice,
      orderData.takeProfitPrice,
      orderData.datetime,
      tracker
    );

    const response = await authenticatedGet(`/v1/dashboard/runs/${run.id}/orders`, developerToken);

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunOrders.response.parse(response.data);

    if (validatedData.data.length > 0) {
      const firstOrder = validatedData.data[0];
      expect(firstOrder).toHaveProperty("id");
      expect(firstOrder).toHaveProperty("nseSymbol");
      expect(firstOrder).toHaveProperty("entryPrice");
      expect(firstOrder).toHaveProperty("stopLossPrice");
      expect(firstOrder).toHaveProperty("takeProfitPrice");
      expect(firstOrder).toHaveProperty("timestamp");
      expect(firstOrder).toHaveProperty("runId");
    }
  });

  test("should validate gain metrics structure when targetGainPercentage provided", async ({
    tracker,
  }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    await createOrder(
      run.id,
      orderData.nseSymbol,
      orderData.entryPrice,
      orderData.stopLossPrice,
      orderData.takeProfitPrice,
      orderData.datetime,
      tracker
    );

    const response = await authenticatedGet(
      `/v1/dashboard/runs/${run.id}/orders?targetGainPercentage=10`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunOrders.response.parse(response.data);

    if (validatedData.data.length > 0) {
      const firstOrder = validatedData.data[0];
      // Gain metrics are optional, so just check structure if present
      if (firstOrder.targetGainPercentage !== undefined) {
        expect(typeof firstOrder.targetGainPercentage).toBe("number");
      }
    }
  });

  test("should validate orders are ordered by timestamp ascending", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData1 = createOrderTestData(TEST_SYMBOL, 2500, 2400, 2600, "2025-12-26T10:00:00Z");
    const orderData2 = createOrderTestData(TEST_SYMBOL, 2500, 2400, 2600, "2025-12-26T11:00:00Z");

    await createOrder(
      run.id,
      orderData1.nseSymbol,
      orderData1.entryPrice,
      orderData1.stopLossPrice,
      orderData1.takeProfitPrice,
      orderData1.datetime,
      tracker,
      "Asia/Kolkata"
    );
    await createOrder(
      run.id,
      orderData2.nseSymbol,
      orderData2.entryPrice,
      orderData2.stopLossPrice,
      orderData2.takeProfitPrice,
      orderData2.datetime,
      tracker,
      "Asia/Kolkata"
    );

    const response = await authenticatedGet(`/v1/dashboard/runs/${run.id}/orders`, developerToken);

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunOrders.response.parse(response.data);

    for (let i = 1; i < validatedData.data.length; i++) {
      const prevTimestamp = dayjs(validatedData.data[i - 1].timestamp).valueOf();
      const currTimestamp = dayjs(validatedData.data[i].timestamp).valueOf();
      expect(currTimestamp).toBeGreaterThanOrEqual(prevTimestamp);
    }
  });

  test("should validate exact order values ", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    await createOrder(
      run.id,
      orderData.nseSymbol,
      orderData.entryPrice,
      orderData.stopLossPrice,
      orderData.takeProfitPrice,
      orderData.datetime,
      tracker
    );

    const response = await authenticatedGet(`/v1/dashboard/runs/${run.id}/orders`, developerToken);

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunOrders.response.parse(response.data);

    if (validatedData.data.length > 0) {
      const firstOrder = validatedData.data[0];
      expect(firstOrder.nseSymbol).toBe(TEST_SYMBOL);
      expect(firstOrder.entryPrice).toBe(2500.0);
      expect(firstOrder.stopLossPrice).toBe(2400.0);
      expect(firstOrder.takeProfitPrice).toBe(2600.0);
    }
  });

  test("should validate exact gain metrics values ", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    await createOrder(
      run.id,
      orderData.nseSymbol,
      orderData.entryPrice,
      orderData.stopLossPrice,
      orderData.takeProfitPrice,
      orderData.datetime,
      tracker
    );

    const response = await authenticatedGet(
      `/v1/dashboard/runs/${run.id}/orders?targetGainPercentage=10`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunOrders.response.parse(response.data);

    if (validatedData.data.length > 0) {
      const firstOrder = validatedData.data[0];
      expect(firstOrder.targetGainPercentage).toBe(10);
      expect(firstOrder.targetAchieved).toBe(false);
    }
  });
});

test.describe("POST /v1/dashboard/runs/:runId/orders", () => {
  test("should return 401 when authorization header is missing", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    const response = await unauthenticatedPost(`/v1/dashboard/runs/${run.id}/orders`, orderData);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      "invalid-token-12345",
      orderData,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(401);
  });

  test("should return 404 when runId is invalid UUID", async () => {
    const orderData = createOrderTestData();
    const response = await authenticatedPost(
      "/v1/dashboard/runs/invalid-id/orders",
      developerToken,
      orderData,
      { validateStatus: () => true }
    );

    expect([400, 404]).toContain(response.status);
  });

  test("should return 404 when run does not exist", async () => {
    const fakeId = generateTestUUID();
    const orderData = createOrderTestData();
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${fakeId}/orders`,
      developerToken,
      orderData,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(404);
  });

  test("should return 404 when run belongs to different developer", async ({ tracker }) => {
    const run = await createRun(
      otherDeveloperId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderData,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(404);
  });

  test("should return 400 when nseSymbol is missing", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    const { nseSymbol, ...orderDataWithoutSymbol } = orderData;
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderDataWithoutSymbol,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when entryPrice is missing", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    const { entryPrice, ...orderDataWithoutEntryPrice } = orderData;
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderDataWithoutEntryPrice,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when stopLossPrice is missing", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    const { stopLossPrice, ...orderDataWithoutStopLoss } = orderData;
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderDataWithoutStopLoss,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when takeProfitPrice is missing", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    const { takeProfitPrice, ...orderDataWithoutTakeProfit } = orderData;
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderDataWithoutTakeProfit,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when timestamp is missing", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    const { datetime, ...orderDataWithoutTimestamp } = orderData;
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderDataWithoutTimestamp,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when timestamp is invalid date format", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    const orderDataWithInvalidDatetime = {
      ...orderData,
      datetime: "invalid-date",
    };
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderDataWithInvalidDatetime,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 201 with created order when valid data provided", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderData
    );

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.message).toBe("Order created successfully");
    expect(body.data).toHaveProperty("id");
    expect(body.data).toHaveProperty("nseSymbol");
    expect(body.data).toHaveProperty("entryPrice");
    expect(body.data).toHaveProperty("stopLossPrice");
    expect(body.data).toHaveProperty("takeProfitPrice");
    expect(body.data).toHaveProperty("datetime");
    expect(body.data).toHaveProperty("runId");
  });

  test("should validate response structure matches schema", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderData
    );

    expect(response.status).toBe(201);
    const validatedData = v1_dashboard_schemas.v1_dashboard_runs_schemas.createOrder.response.parse(
      response.data
    );
    expect(validatedData.data).toHaveProperty("id");
    expect(validatedData.data).toHaveProperty("nseSymbol");
    expect(validatedData.data).toHaveProperty("entryPrice");
    expect(validatedData.data).toHaveProperty("stopLossPrice");
    expect(validatedData.data).toHaveProperty("takeProfitPrice");
    expect(validatedData.data).toHaveProperty("datetime");
    expect(validatedData.data).toHaveProperty("runId");
  });

  test("should validate order belongs to specified run", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderData
    );

    expect(response.status).toBe(201);
    const orderId = response.data.data.id;
    const order = await getOrderById(orderId);
    expect(order).not.toBeNull();
    expect(order?.runId).toBe(run.id);
  });

  test("should validate exact order values ", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const orderData = createOrderTestData();
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderData
    );

    expect(response.status).toBe(201);
    const validatedData = v1_dashboard_schemas.v1_dashboard_runs_schemas.createOrder.response.parse(
      response.data
    );
    expect(validatedData.data.nseSymbol).toBe(orderData.nseSymbol);
    expect(validatedData.data.entryPrice).toBe(orderData.entryPrice);
    expect(validatedData.data.stopLossPrice).toBe(orderData.stopLossPrice);
    expect(validatedData.data.takeProfitPrice).toBe(orderData.takeProfitPrice);
  });
});
