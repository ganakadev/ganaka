import { test, expect } from "@playwright/test";
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

let developerToken: string;
let developerId: string;
let otherDeveloperToken: string;
let otherDeveloperId: string;

test.beforeAll(async () => {
  const dev = await createDeveloperUser();
  developerToken = dev.token;
  developerId = dev.id;

  const otherDev = await createDeveloperUser();
  otherDeveloperToken = otherDev.token;
  otherDeveloperId = otherDev.id;
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

  test("should return 200 with runs grouped by date", async () => {
    const startTime1 = new Date("2025-12-26T09:15:00Z");
    const endTime1 = new Date("2025-12-26T15:30:00Z");
    const startTime2 = new Date("2025-12-27T09:15:00Z");
    const endTime2 = new Date("2025-12-27T15:30:00Z");

    await createRun(developerId, startTime1, endTime1);
    await createRun(developerId, startTime2, endTime2);

    const response = await authenticatedGet("/v1/dashboard/runs", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_dashboard_schemas.v1_dashboard_runs_schemas.getRuns.response.parse(response.data);
    expect(Object.keys(validatedData.data).length).toBeGreaterThan(0);
  });

  test("should validate runs are grouped correctly by date (YYYY-MM-DD)", async () => {
    const startTime = new Date("2025-12-26T09:15:00Z");
    const endTime = new Date("2025-12-26T15:30:00Z");
    await createRun(developerId, startTime, endTime);

    const response = await authenticatedGet("/v1/dashboard/runs", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_dashboard_schemas.v1_dashboard_runs_schemas.getRuns.response.parse(response.data);
    const dateKeys = Object.keys(validatedData.data);
    dateKeys.forEach((dateKey) => {
      expect(dateKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  test("should validate dates are sorted descending (newest first)", async () => {
    const startTime1 = new Date("2025-12-25T09:15:00Z");
    const endTime1 = new Date("2025-12-25T15:30:00Z");
    const startTime2 = new Date("2025-12-26T09:15:00Z");
    const endTime2 = new Date("2025-12-26T15:30:00Z");

    await createRun(developerId, startTime1, endTime1);
    await createRun(developerId, startTime2, endTime2);

    const response = await authenticatedGet("/v1/dashboard/runs", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_dashboard_schemas.v1_dashboard_runs_schemas.getRuns.response.parse(response.data);
    const dateKeys = Object.keys(validatedData.data);

    for (let i = 1; i < dateKeys.length; i++) {
      const prevDate = new Date(dateKeys[i - 1]).getTime();
      const currDate = new Date(dateKeys[i]).getTime();
      expect(prevDate).toBeGreaterThanOrEqual(currDate);
    }
  });

  test("should validate run structure (id, startTime, endTime, completed, orderCount)", async () => {
    const startTime = new Date("2025-12-26T09:15:00Z");
    const endTime = new Date("2025-12-26T15:30:00Z");
    await createRun(developerId, startTime, endTime);

    const response = await authenticatedGet("/v1/dashboard/runs", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_dashboard_schemas.v1_dashboard_runs_schemas.getRuns.response.parse(response.data);

    const dateKeys = Object.keys(validatedData.data);
    if (dateKeys.length > 0) {
      const runs = validatedData.data[dateKeys[0]];
      if (runs.length > 0) {
        const firstRun = runs[0];
        expect(firstRun).toHaveProperty("id");
        expect(firstRun).toHaveProperty("startTime");
        expect(firstRun).toHaveProperty("endTime");
        expect(firstRun).toHaveProperty("completed");
        expect(firstRun).toHaveProperty("orderCount");
        expect(typeof firstRun.id).toBe("string");
        expect(firstRun.startTime).toBeInstanceOf(Date);
        expect(firstRun.endTime).toBeInstanceOf(Date);
        expect(typeof firstRun.completed).toBe("boolean");
        expect(typeof firstRun.orderCount).toBe("number");
      }
    }
  });

  test("should validate exact date grouping (placeholder for user to fill)", async () => {
    const startTime = new Date("2025-12-26T09:15:00Z");
    const endTime = new Date("2025-12-26T15:30:00Z");
    await createRun(developerId, startTime, endTime);

    const response = await authenticatedGet("/v1/dashboard/runs", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_dashboard_schemas.v1_dashboard_runs_schemas.getRuns.response.parse(response.data);

    // TODO: Add exact date grouping assertions here
    // expect(validatedData.data).toHaveProperty("2025-12-26");
    // expect(validatedData.data["2025-12-26"].length).toBe(1);
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
    const response = await authenticatedPost("/v1/dashboard/runs", "invalid-token-12345", testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });

  test("should return 400 when startTime is missing", async () => {
    const testData = { endTime: createRunTestData().endTime };
    const response = await authenticatedPost("/v1/dashboard/runs", developerToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when endTime is missing", async () => {
    const testData = { startTime: createRunTestData().startTime };
    const response = await authenticatedPost("/v1/dashboard/runs", developerToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when startTime is invalid date format", async () => {
    const testData = { startTime: "invalid-date", endTime: createRunTestData().endTime };
    const response = await authenticatedPost("/v1/dashboard/runs", developerToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when endTime is invalid date format", async () => {
    const testData = { startTime: createRunTestData().startTime, endTime: "invalid-date" };
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
    expect(body.data).toHaveProperty("startTime");
    expect(body.data).toHaveProperty("endTime");
    expect(body.data).toHaveProperty("completed");
  });

  test("should validate response structure matches schema", async () => {
    const testData = createRunTestData();
    const response = await authenticatedPost("/v1/dashboard/runs", developerToken, testData);

    expect(response.status).toBe(201);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_runs_schemas.createRun.response.parse(response.data);
    expect(validatedData.data).toHaveProperty("id");
    expect(validatedData.data).toHaveProperty("startTime");
    expect(validatedData.data).toHaveProperty("endTime");
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

  test("should validate exact timestamps (placeholder for user to fill)", async () => {
    const testData = createRunTestData();
    const response = await authenticatedPost("/v1/dashboard/runs", developerToken, testData);

    expect(response.status).toBe(201);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_runs_schemas.createRun.response.parse(response.data);
    expect(validatedData.data).toHaveProperty("startTime");
    expect(validatedData.data).toHaveProperty("endTime");
    // TODO: Add exact timestamp assertions here
    // expect(validatedData.data.startTime).toBe(new Date(testData.startTime));
    // expect(validatedData.data.endTime).toBe(new Date(testData.endTime));
  });
});

test.describe("PATCH /v1/dashboard/runs/:runId", () => {
  test("should return 401 when authorization header is missing", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const response = await unauthenticatedPatch(`/v1/dashboard/runs/${run.id}`, { completed: true });

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const run = await createRun(developerId, new Date(), new Date());
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

  test("should return 404 when run belongs to different developer", async () => {
    const run = await createRun(otherDeveloperId, new Date(), new Date());
    const response = await authenticatedPatch(
      `/v1/dashboard/runs/${run.id}`,
      developerToken,
      { completed: true },
      { validateStatus: () => true }
    );

    expect(response.status).toBe(404);
  });

  test("should return 200 with updated run when valid data provided", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const response = await authenticatedPatch(`/v1/dashboard/runs/${run.id}`, developerToken, {
      completed: true,
    });

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Run updated successfully");
    expect(body.data.completed).toBe(true);
  });

  test("should validate response structure matches schema", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const response = await authenticatedPatch(`/v1/dashboard/runs/${run.id}`, developerToken, {
      completed: true,
    });

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_runs_schemas.updateRun.response.parse(response.data);
    expect(validatedData.data).toHaveProperty("id");
    expect(validatedData.data).toHaveProperty("startTime");
    expect(validatedData.data).toHaveProperty("endTime");
    expect(validatedData.data).toHaveProperty("completed");
  });

  test("should validate completed status is updated correctly", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    expect(run.completed).toBe(false);

    const response = await authenticatedPatch(`/v1/dashboard/runs/${run.id}`, developerToken, {
      completed: true,
    });

    expect(response.status).toBe(200);
    const updatedRun = await getRunById(run.id);
    expect(updatedRun?.completed).toBe(true);
  });

  test("should validate exact timestamps preserved (placeholder for user to fill)", async () => {
    const startTime = new Date("2025-12-26T09:15:00Z");
    const endTime = new Date("2025-12-26T15:30:00Z");
    const run = await createRun(developerId, startTime, endTime);

    const response = await authenticatedPatch(`/v1/dashboard/runs/${run.id}`, developerToken, {
      completed: true,
    });

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_runs_schemas.updateRun.response.parse(response.data);
    // TODO: Add exact timestamp assertions here
    // expect(validatedData.data.startTime).toBe(startTime);
    // expect(validatedData.data.endTime).toBe(endTime);
  });
});

test.describe("DELETE /v1/dashboard/runs/:runId", () => {
  test("should return 401 when authorization header is missing", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const response = await unauthenticatedDelete(`/v1/dashboard/runs/${run.id}`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const response = await authenticatedDelete(`/v1/dashboard/runs/${run.id}`, "invalid-token-12345", {
      validateStatus: () => true,
    });

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

  test("should return 404 when run belongs to different developer", async () => {
    const run = await createRun(otherDeveloperId, new Date(), new Date());
    const response = await authenticatedDelete(`/v1/dashboard/runs/${run.id}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(404);
  });

  test("should return 200 with deleted run id when valid", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const response = await authenticatedDelete(`/v1/dashboard/runs/${run.id}`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Run deleted successfully");
    expect(body.data.id).toBe(run.id);
  });

  test("should validate run is actually deleted from database", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    await authenticatedDelete(`/v1/dashboard/runs/${run.id}`, developerToken);

    const deletedRun = await getRunById(run.id);
    expect(deletedRun).toBeNull();
  });
});

test.describe("GET /v1/dashboard/runs/:runId/orders", () => {
  test("should return 401 when authorization header is missing", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const response = await unauthenticatedGet(`/v1/dashboard/runs/${run.id}/orders`);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const response = await authenticatedGet(`/v1/dashboard/runs/${run.id}/orders`, "invalid-token-12345", {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });

  test("should return 404 when runId is invalid UUID", async () => {
    const response = await authenticatedGet("/v1/dashboard/runs/invalid-id/orders", developerToken, {
      validateStatus: () => true,
    });

    expect([400, 404]).toContain(response.status);
  });

  test("should return 404 when run does not exist", async () => {
    const fakeId = generateTestUUID();
    const response = await authenticatedGet(`/v1/dashboard/runs/${fakeId}/orders`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(404);
  });

  test("should return 404 when run belongs to different developer", async () => {
    const run = await createRun(otherDeveloperId, new Date(), new Date());
    const response = await authenticatedGet(`/v1/dashboard/runs/${run.id}/orders`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(404);
  });

  test("should return 200 with empty array when no orders exist", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const response = await authenticatedGet(`/v1/dashboard/runs/${run.id}/orders`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Orders fetched successfully");
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBe(0);
  });

  test("should return 200 with orders when valid runId provided", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const orderData = createOrderTestData();
    await createOrder(
      run.id,
      orderData.nseSymbol,
      orderData.entryPrice,
      orderData.stopLossPrice,
      orderData.takeProfitPrice,
      orderData.timestamp
    );

    const response = await authenticatedGet(`/v1/dashboard/runs/${run.id}/orders`, developerToken);

    expect(response.status).toBe(200);
    const body = response.data;
    expect(body.statusCode).toBe(200);
    expect(body.message).toBe("Orders fetched successfully");
    expect(body.data.length).toBeGreaterThan(0);
  });

  test("should validate order structure (id, nseSymbol, entryPrice, stopLossPrice, takeProfitPrice, timestamp, runId)", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const orderData = createOrderTestData();
    await createOrder(
      run.id,
      orderData.nseSymbol,
      orderData.entryPrice,
      orderData.stopLossPrice,
      orderData.takeProfitPrice,
      orderData.timestamp
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

  test("should validate gain metrics structure when targetGainPercentage provided", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const orderData = createOrderTestData();
    await createOrder(
      run.id,
      orderData.nseSymbol,
      orderData.entryPrice,
      orderData.stopLossPrice,
      orderData.takeProfitPrice,
      orderData.timestamp
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

  test("should validate orders are ordered by timestamp ascending", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const orderData1 = createOrderTestData(TEST_SYMBOL, 2500, 2400, 2600, "2025-12-26T10:00:00Z");
    const orderData2 = createOrderTestData(TEST_SYMBOL, 2500, 2400, 2600, "2025-12-26T11:00:00Z");

    await createOrder(
      run.id,
      orderData1.nseSymbol,
      orderData1.entryPrice,
      orderData1.stopLossPrice,
      orderData1.takeProfitPrice,
      orderData1.timestamp
    );
    await createOrder(
      run.id,
      orderData2.nseSymbol,
      orderData2.entryPrice,
      orderData2.stopLossPrice,
      orderData2.takeProfitPrice,
      orderData2.timestamp
    );

    const response = await authenticatedGet(`/v1/dashboard/runs/${run.id}/orders`, developerToken);

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunOrders.response.parse(response.data);

    for (let i = 1; i < validatedData.data.length; i++) {
      const prevTimestamp = validatedData.data[i - 1].timestamp.getTime();
      const currTimestamp = validatedData.data[i].timestamp.getTime();
      expect(currTimestamp).toBeGreaterThanOrEqual(prevTimestamp);
    }
  });

  test("should validate exact order values (placeholder for user to fill)", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const orderData = createOrderTestData();
    await createOrder(
      run.id,
      orderData.nseSymbol,
      orderData.entryPrice,
      orderData.stopLossPrice,
      orderData.takeProfitPrice,
      orderData.timestamp
    );

    const response = await authenticatedGet(`/v1/dashboard/runs/${run.id}/orders`, developerToken);

    expect(response.status).toBe(200);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunOrders.response.parse(response.data);

    if (validatedData.data.length > 0) {
      const firstOrder = validatedData.data[0];
      // TODO: Add exact value assertions here
      // expect(firstOrder.nseSymbol).toBe(TEST_SYMBOL);
      // expect(firstOrder.entryPrice).toBe(2500.0);
      // expect(firstOrder.stopLossPrice).toBe(2400.0);
      // expect(firstOrder.takeProfitPrice).toBe(2600.0);
    }
  });

  test("should validate exact gain metrics values (placeholder for user to fill)", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const orderData = createOrderTestData();
    await createOrder(
      run.id,
      orderData.nseSymbol,
      orderData.entryPrice,
      orderData.stopLossPrice,
      orderData.takeProfitPrice,
      orderData.timestamp
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
      // TODO: Add exact gain metrics assertions here
      // expect(firstOrder.targetGainPercentage).toBe(10);
      // expect(firstOrder.targetAchieved).toBe(/* expected value */);
    }
  });
});

test.describe("POST /v1/dashboard/runs/:runId/orders", () => {
  test("should return 401 when authorization header is missing", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const orderData = createOrderTestData();
    const response = await unauthenticatedPost(`/v1/dashboard/runs/${run.id}/orders`, orderData);

    expect(response.status).toBe(401);
  });

  test("should return 401 when invalid token is provided", async () => {
    const run = await createRun(developerId, new Date(), new Date());
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

  test("should return 404 when run belongs to different developer", async () => {
    const run = await createRun(otherDeveloperId, new Date(), new Date());
    const orderData = createOrderTestData();
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderData,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(404);
  });

  test("should return 400 when nseSymbol is missing", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const orderData = createOrderTestData();
    delete (orderData as any).nseSymbol;
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderData,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when entryPrice is missing", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const orderData = createOrderTestData();
    delete (orderData as any).entryPrice;
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderData,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when stopLossPrice is missing", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const orderData = createOrderTestData();
    delete (orderData as any).stopLossPrice;
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderData,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when takeProfitPrice is missing", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const orderData = createOrderTestData();
    delete (orderData as any).takeProfitPrice;
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderData,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when timestamp is missing", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const orderData = createOrderTestData();
    delete (orderData as any).timestamp;
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderData,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when timestamp is invalid date format", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const orderData = createOrderTestData();
    orderData.timestamp = "invalid-date" as any;
    const response = await authenticatedPost(
      `/v1/dashboard/runs/${run.id}/orders`,
      developerToken,
      orderData,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });

  test("should return 201 with created order when valid data provided", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const orderData = createOrderTestData();
    const response = await authenticatedPost(`/v1/dashboard/runs/${run.id}/orders`, developerToken, orderData);

    expect(response.status).toBe(201);
    const body = response.data;
    expect(body.statusCode).toBe(201);
    expect(body.message).toBe("Order created successfully");
    expect(body.data).toHaveProperty("id");
    expect(body.data).toHaveProperty("nseSymbol");
    expect(body.data).toHaveProperty("entryPrice");
    expect(body.data).toHaveProperty("stopLossPrice");
    expect(body.data).toHaveProperty("takeProfitPrice");
    expect(body.data).toHaveProperty("timestamp");
    expect(body.data).toHaveProperty("runId");
  });

  test("should validate response structure matches schema", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const orderData = createOrderTestData();
    const response = await authenticatedPost(`/v1/dashboard/runs/${run.id}/orders`, developerToken, orderData);

    expect(response.status).toBe(201);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_runs_schemas.createOrder.response.parse(response.data);
    expect(validatedData.data).toHaveProperty("id");
    expect(validatedData.data).toHaveProperty("nseSymbol");
    expect(validatedData.data).toHaveProperty("entryPrice");
    expect(validatedData.data).toHaveProperty("stopLossPrice");
    expect(validatedData.data).toHaveProperty("takeProfitPrice");
    expect(validatedData.data).toHaveProperty("timestamp");
    expect(validatedData.data).toHaveProperty("runId");
  });

  test("should validate order belongs to specified run", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const orderData = createOrderTestData();
    const response = await authenticatedPost(`/v1/dashboard/runs/${run.id}/orders`, developerToken, orderData);

    expect(response.status).toBe(201);
    const orderId = response.data.data.id;
    const order = await getOrderById(orderId);
    expect(order).not.toBeNull();
    expect(order?.runId).toBe(run.id);
  });

  test("should validate exact order values (placeholder for user to fill)", async () => {
    const run = await createRun(developerId, new Date(), new Date());
    const orderData = createOrderTestData();
    const response = await authenticatedPost(`/v1/dashboard/runs/${run.id}/orders`, developerToken, orderData);

    expect(response.status).toBe(201);
    const validatedData =
      v1_dashboard_schemas.v1_dashboard_runs_schemas.createOrder.response.parse(response.data);
    // TODO: Add exact value assertions here
    // expect(validatedData.data.nseSymbol).toBe(orderData.nseSymbol);
    // expect(validatedData.data.entryPrice).toBe(orderData.entryPrice);
    // expect(validatedData.data.stopLossPrice).toBe(orderData.stopLossPrice);
    // expect(validatedData.data.takeProfitPrice).toBe(orderData.takeProfitPrice);
  });
});

