import { test, expect } from "../../../helpers/test-fixtures";
import {
  authenticatedPost,
  authenticatedPatch,
  authenticatedDelete,
  authenticatedGet,
} from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import { createRun, createOrder } from "../../../helpers/db-helpers";
import {
  createRunTestData,
  createOrderTestData,
  generateUUID as generateTestUUID,
} from "../../../fixtures/test-data";
import { TestDataTracker } from "../../../helpers/test-tracker";

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

test.describe("POST /v1/runs", () => {
  test("should return 400 when startTime is missing", async () => {
    const testData = { end_datetime: createRunTestData().end_datetime };
    const response = await authenticatedPost("/v1/runs", developerToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when endTime is missing", async () => {
    const testData = { start_datetime: createRunTestData().start_datetime };
    const response = await authenticatedPost("/v1/runs", developerToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when startTime is invalid date format", async () => {
    const testData = {
      start_datetime: "invalid-date",
      end_datetime: createRunTestData().end_datetime,
    };
    const response = await authenticatedPost("/v1/runs", developerToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when endTime is invalid date format", async () => {
    const testData = {
      start_datetime: createRunTestData().start_datetime,
      end_datetime: "invalid-date",
    };
    const response = await authenticatedPost("/v1/runs", developerToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when tag exceeds max length", async () => {
    const testData = {
      ...createRunTestData(),
      tags: ["a".repeat(51)], // 51 characters
    };
    const response = await authenticatedPost("/v1/runs", developerToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when tag contains invalid characters", async () => {
    const testData = {
      ...createRunTestData(),
      tags: ["tag with spaces"],
    };
    const response = await authenticatedPost("/v1/runs", developerToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when more than 10 tags provided", async () => {
    const testData = {
      ...createRunTestData(),
      tags: Array.from({ length: 11 }, (_, i) => `tag${i}`),
    };
    const response = await authenticatedPost("/v1/runs", developerToken, testData, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });
});

test.describe("PATCH /v1/runs/:runId", () => {
  test("should return 404 when runId is invalid UUID", async () => {
    const response = await authenticatedPatch(
      "/v1/runs/invalid-id",
      developerToken,
      { completed: true },
      { validateStatus: () => true }
    );

    expect([400, 404]).toContain(response.status);
  });

  test("should return 404 when run does not exist", async () => {
    const fakeId = generateTestUUID();
    const response = await authenticatedPatch(
      `/v1/runs/${fakeId}`,
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
      `/v1/runs/${run.id}`,
      developerToken,
      { completed: true },
      { validateStatus: () => true }
    );

    expect(response.status).toBe(404);
  });
});

test.describe("DELETE /v1/runs/:runId", () => {
  test("should return 404 when runId is invalid UUID", async () => {
    const response = await authenticatedDelete("/v1/runs/invalid-id", developerToken, {
      validateStatus: () => true,
    });

    expect([400, 404]).toContain(response.status);
  });

  test("should return 404 when run does not exist", async () => {
    const fakeId = generateTestUUID();
    const response = await authenticatedDelete(`/v1/runs/${fakeId}`, developerToken, {
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
    const response = await authenticatedDelete(`/v1/runs/${run.id}`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(404);
  });
});

test.describe("GET /v1/runs/:runId/orders", () => {
  test("should return 404 when runId is invalid UUID", async () => {
    const response = await authenticatedGet(
      "/v1/runs/invalid-id/orders",
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect([400, 404]).toContain(response.status);
  });

  test("should return 404 when run does not exist", async () => {
    const fakeId = generateTestUUID();
    const response = await authenticatedGet(`/v1/runs/${fakeId}/orders`, developerToken, {
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
    const response = await authenticatedGet(`/v1/runs/${run.id}/orders`, developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(404);
  });
});

test.describe("POST /v1/runs/:runId/orders", () => {
  test("should return 404 when runId is invalid UUID", async () => {
    const orderData = createOrderTestData();
    const response = await authenticatedPost(
      "/v1/runs/invalid-id/orders",
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
      `/v1/runs/${fakeId}/orders`,
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
      `/v1/runs/${run.id}/orders`,
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
    const orderDataWithoutSymbol = {
      entryPrice: orderData.entryPrice,
      stopLossPrice: orderData.stopLossPrice,
      takeProfitPrice: orderData.takeProfitPrice,
      datetime: orderData.datetime,
    };
    const response = await authenticatedPost(
      `/v1/runs/${run.id}/orders`,
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
    const orderDataWithoutEntryPrice = {
      nseSymbol: orderData.nseSymbol,
      stopLossPrice: orderData.stopLossPrice,
      takeProfitPrice: orderData.takeProfitPrice,
      datetime: orderData.datetime,
    };
    const response = await authenticatedPost(
      `/v1/runs/${run.id}/orders`,
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
    const orderDataWithoutStopLoss = {
      nseSymbol: orderData.nseSymbol,
      entryPrice: orderData.entryPrice,
      takeProfitPrice: orderData.takeProfitPrice,
      datetime: orderData.datetime,
    };
    const response = await authenticatedPost(
      `/v1/runs/${run.id}/orders`,
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
    const orderDataWithoutTakeProfit = {
      nseSymbol: orderData.nseSymbol,
      entryPrice: orderData.entryPrice,
      stopLossPrice: orderData.stopLossPrice,
      datetime: orderData.datetime,
    };
    const response = await authenticatedPost(
      `/v1/runs/${run.id}/orders`,
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
    const orderDataWithoutTimestamp = {
      nseSymbol: orderData.nseSymbol,
      entryPrice: orderData.entryPrice,
      stopLossPrice: orderData.stopLossPrice,
      takeProfitPrice: orderData.takeProfitPrice,
    };
    const response = await authenticatedPost(
      `/v1/runs/${run.id}/orders`,
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
      nseSymbol: orderData.nseSymbol,
      entryPrice: orderData.entryPrice,
      stopLossPrice: orderData.stopLossPrice,
      takeProfitPrice: orderData.takeProfitPrice,
      datetime: "invalid-date",
    };
    const response = await authenticatedPost(
      `/v1/runs/${run.id}/orders`,
      developerToken,
      orderDataWithInvalidDatetime,
      { validateStatus: () => true }
    );

    expect(response.status).toBe(400);
  });
});
