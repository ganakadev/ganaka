import { test, expect } from "../../../helpers/test-fixtures";
import {
  authenticatedGet,
  authenticatedPost,
  authenticatedPatch,
  authenticatedDelete,
} from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { createRun, createOrder, getRunById, getOrderById } from "../../../helpers/db-helpers";
import { createRunTestData, createOrderTestData, TEST_SYMBOL } from "../../../fixtures/test-data";
import { v1_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
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

test.describe("GET /v1/runs", () => {
  test("should return 200 with runs grouped by date", async ({ tracker }) => {
    const startTime1 = "2025-12-26T09:15:00";
    const endTime1 = "2025-12-26T15:30:00";
    const startTime2 = "2025-12-27T09:15:00";
    const endTime2 = "2025-12-27T15:30:00";

    await createRun(developerId, startTime1, endTime1, tracker, "Asia/Kolkata");
    await createRun(developerId, startTime2, endTime2, tracker, "Asia/Kolkata");

    const response = await authenticatedGet("/v1/runs", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.getRuns.response.parse(
      response.data
    );
    expect(Object.keys(validatedData.data).length).toBeGreaterThan(0);
  });

  test("should include name and tags in run response", async ({ tracker }) => {
    await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata",
      "Test Run",
      ["v1", "test"]
    );

    const response = await authenticatedGet("/v1/runs", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.getRuns.response.parse(
      response.data
    );
    const allRuns = Object.values(validatedData.data).flat();
    const testRun = allRuns.find((run) => run.name === "Test Run");
    expect(testRun).toBeDefined();
    expect(testRun?.name).toBe("Test Run");
    expect(testRun?.tags).toEqual(["v1", "test"]);
  });

  test("should validate runs are grouped correctly by date (YYYY-MM-DD)", async ({ tracker }) => {
    const startTime = "2025-12-26T09:15:00";
    const endTime = "2025-12-26T15:30:00";
    await createRun(developerId, startTime, endTime, tracker, "Asia/Kolkata");

    const response = await authenticatedGet("/v1/runs", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.getRuns.response.parse(
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

    const response = await authenticatedGet("/v1/runs", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.getRuns.response.parse(
      response.data
    );
    const dateKeys = Object.keys(validatedData.data);

    for (let i = 1; i < dateKeys.length; i++) {
      const prevDate = dayjs.utc(dateKeys[i - 1]).valueOf();
      const currDate = dayjs.utc(dateKeys[i]).valueOf();
      expect(prevDate).toBeGreaterThanOrEqual(currDate);
    }
  });

  test("should validate run structure (id, startTime, endTime, completed, orderCount)", async ({
    tracker,
  }) => {
    const startTime = "2025-12-26T09:15:00";
    const endTime = "2025-12-26T15:30:00";
    await createRun(developerId, startTime, endTime, tracker, "Asia/Kolkata");

    const response = await authenticatedGet("/v1/runs", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.getRuns.response.parse(
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
    const run = await createRun(developerId, startTime, endTime, tracker);

    const response = await authenticatedGet("/v1/runs", developerToken);

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.getRuns.response.parse(
      response.data
    );

    // Group by creation date (createdAt), not execution date (startTime)
    const creationDateKey = dayjs.utc(run.createdAt).format("YYYY-MM-DD");
    expect(validatedData.data).toHaveProperty(creationDateKey);
    expect(validatedData.data[creationDateKey].length).toBe(1);
  });
});

test.describe("POST /v1/runs", () => {
  test("should return 201 with created run when valid data provided", async () => {
    const testData = createRunTestData();
    const response = await authenticatedPost("/v1/runs", developerToken, testData);

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
    const response = await authenticatedPost("/v1/runs", developerToken, testData);

    expect(response.status).toBe(201);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.createRun.response.parse(
      response.data
    );
    expect(validatedData.data).toHaveProperty("id");
    expect(validatedData.data).toHaveProperty("start_datetime");
    expect(validatedData.data).toHaveProperty("end_datetime");
    expect(validatedData.data).toHaveProperty("completed");
  });

  test("should validate run belongs to authenticated developer", async () => {
    const testData = createRunTestData();
    const response = await authenticatedPost("/v1/runs", developerToken, testData);

    expect(response.status).toBe(201);
    const runId = response.data.data.id;
    const run = await getRunById(runId);
    expect(run).not.toBeNull();
    expect(run?.developerId).toBe(developerId);
  });

  test("should validate exact timestamps", async () => {
    const testData = createRunTestData();
    const response = await authenticatedPost("/v1/runs", developerToken, testData);

    expect(response.status).toBe(201);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.createRun.response.parse(
      response.data
    );
    expect(validatedData.data).toHaveProperty("start_datetime");
    expect(validatedData.data).toHaveProperty("end_datetime");
    expect(validatedData.data.start_datetime).toBe("2025-12-26T03:45:00");
    expect(validatedData.data.end_datetime).toBe("2025-12-26T10:00:00");
  });

  test("should create run with name", async () => {
    const testData = {
      ...createRunTestData(),
      name: "Test Run Name",
    };
    const response = await authenticatedPost("/v1/runs", developerToken, testData);

    expect(response.status).toBe(201);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.createRun.response.parse(
      response.data
    );
    expect(validatedData.data.name).toBe("Test Run Name");
  });

  test("should create run with single tag", async () => {
    const testData = {
      ...createRunTestData(),
      tags: ["v1"],
    };
    const response = await authenticatedPost("/v1/runs", developerToken, testData);

    expect(response.status).toBe(201);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.createRun.response.parse(
      response.data
    );
    expect(validatedData.data.tags).toEqual(["v1"]);
  });

  test("should create run with multiple tags", async () => {
    const testData = {
      ...createRunTestData(),
      tags: ["v1", "momentum", "experiment"],
    };
    const response = await authenticatedPost("/v1/runs", developerToken, testData);

    expect(response.status).toBe(201);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.createRun.response.parse(
      response.data
    );
    expect(validatedData.data.tags).toEqual(["experiment", "momentum", "v1"]); // Should be sorted
  });

  test("should create run with empty tags array", async () => {
    const testData = {
      ...createRunTestData(),
      tags: [],
    };
    const response = await authenticatedPost("/v1/runs", developerToken, testData);

    expect(response.status).toBe(201);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.createRun.response.parse(
      response.data
    );
    expect(validatedData.data.tags).toEqual([]);
  });

  test("should remove duplicate tags", async () => {
    const testData = {
      ...createRunTestData(),
      tags: ["v1", "v1", "momentum"],
    };
    const response = await authenticatedPost("/v1/runs", developerToken, testData);

    expect(response.status).toBe(201);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.createRun.response.parse(
      response.data
    );
    expect(validatedData.data.tags).toEqual(["momentum", "v1"]);
  });

  test("should create run with name and tags together", async () => {
    const testData = {
      ...createRunTestData(),
      name: "Momentum Strategy v1",
      tags: ["v1", "momentum"],
    };
    const response = await authenticatedPost("/v1/runs", developerToken, testData);

    expect(response.status).toBe(201);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.createRun.response.parse(
      response.data
    );
    expect(validatedData.data.name).toBe("Momentum Strategy v1");
    expect(validatedData.data.tags).toEqual(["momentum", "v1"]);
  });
});

test.describe("PATCH /v1/runs/:runId", () => {
  test("should return 200 with updated run when valid data provided", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await authenticatedPatch(`/v1/runs/${run.id}`, developerToken, {
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
    const response = await authenticatedPatch(`/v1/runs/${run.id}`, developerToken, {
      completed: true,
    });

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.updateRun.response.parse(
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

    const response = await authenticatedPatch(`/v1/runs/${run.id}`, developerToken, {
      completed: true,
    });

    expect(response.status).toBe(200);
    const updatedRun = await getRunById(run.id);
    expect(updatedRun?.completed).toBe(true);
  });

  test("should validate response times are returned in UTC timezone", async ({ tracker }) => {
    const startTime = "2025-12-26T09:15:00";
    const endTime = "2025-12-26T15:30:00";
    const run = await createRun(developerId, startTime, endTime, tracker);

    const response = await authenticatedPatch(`/v1/runs/${run.id}`, developerToken, {
      completed: true,
    });

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.updateRun.response.parse(
      response.data
    );

    expect(validatedData.data.start_datetime).toBe("2025-12-26T03:45:00");
    expect(validatedData.data.end_datetime).toBe("2025-12-26T10:00:00");
  });

  test("should update run name", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );

    const response = await authenticatedPatch(`/v1/runs/${run.id}`, developerToken, {
      name: "Updated Run Name",
    });

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.updateRun.response.parse(
      response.data
    );
    expect(validatedData.data.name).toBe("Updated Run Name");
    const updatedRun = await getRunById(run.id);
    expect(updatedRun?.name).toBe("Updated Run Name");
  });

  test("should update run tags", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata",
      null,
      ["old-tag"]
    );

    const response = await authenticatedPatch(`/v1/runs/${run.id}`, developerToken, {
      tags: ["new-tag1", "new-tag2"],
    });

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.updateRun.response.parse(
      response.data
    );
    expect(validatedData.data.tags).toEqual(["new-tag1", "new-tag2"]);
    const updatedRun = await getRunById(run.id);
    expect(updatedRun?.tags).toEqual(["new-tag1", "new-tag2"]);
  });

  test("should update run name and tags together", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );

    const response = await authenticatedPatch(`/v1/runs/${run.id}`, developerToken, {
      name: "Updated Name",
      tags: ["tag1", "tag2"],
    });

    expect(response.status).toBe(200);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.updateRun.response.parse(
      response.data
    );
    expect(validatedData.data.name).toBe("Updated Name");
    expect(validatedData.data.tags).toEqual(["tag1", "tag2"]);
  });

  test("should clear run name when set to null", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata",
      "Original Name"
    );

    const response = await authenticatedPatch(`/v1/runs/${run.id}`, developerToken, {
      name: null,
    });

    expect(response.status).toBe(200);
    const updatedRun = await getRunById(run.id);
    expect(updatedRun?.name).toBeNull();
  });

  test("should clear run tags when set to empty array", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata",
      null,
      ["tag1", "tag2"]
    );

    const response = await authenticatedPatch(`/v1/runs/${run.id}`, developerToken, {
      tags: [],
    });

    expect(response.status).toBe(200);
    const updatedRun = await getRunById(run.id);
    expect(updatedRun?.tags).toEqual([]);
  });
});

test.describe("DELETE /v1/runs/:runId", () => {
  test("should return 200 with deleted run id when valid", async ({ tracker }) => {
    const run = await createRun(
      developerId,
      "2025-12-26T09:15:00",
      "2025-12-26T15:30:00",
      tracker,
      "Asia/Kolkata"
    );
    const response = await authenticatedDelete(`/v1/runs/${run.id}`, developerToken);

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
    await authenticatedDelete(`/v1/runs/${run.id}`, developerToken);

    const deletedRun = await getRunById(run.id);
    expect(deletedRun).toBeNull();
  });
});

test.describe("GET /v1/runs/:runId/orders", () => {
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

    const response = await authenticatedGet(`/v1/runs/${run.id}/orders`, developerToken);

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

    const response = await authenticatedGet(`/v1/runs/${run.id}/orders`, developerToken);

    expect(response.status).toBe(200);
    const validatedData =
      v1_schemas.v1_dashboard_runs_schemas.getRunOrders.response.parse(response.data);

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
      `/v1/runs/${run.id}/orders?targetGainPercentage=10`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_schemas.v1_dashboard_runs_schemas.getRunOrders.response.parse(response.data);

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

    const response = await authenticatedGet(`/v1/runs/${run.id}/orders`, developerToken);

    expect(response.status).toBe(200);
    const validatedData =
      v1_schemas.v1_dashboard_runs_schemas.getRunOrders.response.parse(response.data);

    for (let i = 1; i < validatedData.data.length; i++) {
      const prevTimestamp = dayjs.utc(validatedData.data[i - 1].timestamp).valueOf();
      const currTimestamp = dayjs.utc(validatedData.data[i].timestamp).valueOf();
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

    const response = await authenticatedGet(`/v1/runs/${run.id}/orders`, developerToken);

    expect(response.status).toBe(200);
    const validatedData =
      v1_schemas.v1_dashboard_runs_schemas.getRunOrders.response.parse(response.data);

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
      `/v1/runs/${run.id}/orders?targetGainPercentage=10`,
      developerToken
    );

    expect(response.status).toBe(200);
    const validatedData =
      v1_schemas.v1_dashboard_runs_schemas.getRunOrders.response.parse(response.data);

    if (validatedData.data.length > 0) {
      const firstOrder = validatedData.data[0];
      expect(firstOrder.targetGainPercentage).toBe(10);
      expect(firstOrder.targetAchieved).toBe(false);
    }
  });
});

test.describe("POST /v1/runs/:runId/orders", () => {
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
      `/v1/runs/${run.id}/orders`,
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
      `/v1/runs/${run.id}/orders`,
      developerToken,
      orderData
    );

    expect(response.status).toBe(201);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.createOrder.response.parse(
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
      `/v1/runs/${run.id}/orders`,
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
      `/v1/runs/${run.id}/orders`,
      developerToken,
      orderData
    );

    expect(response.status).toBe(201);
    const validatedData = v1_schemas.v1_dashboard_runs_schemas.createOrder.response.parse(
      response.data
    );
    expect(validatedData.data.nseSymbol).toBe(orderData.nseSymbol);
    expect(validatedData.data.entryPrice).toBe(orderData.entryPrice);
    expect(validatedData.data.stopLossPrice).toBe(orderData.stopLossPrice);
    expect(validatedData.data.takeProfitPrice).toBe(orderData.takeProfitPrice);
  });
});
