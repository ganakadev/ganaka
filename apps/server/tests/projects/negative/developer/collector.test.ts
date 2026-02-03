import { test, expect } from "../../../helpers/test-fixtures";
import { authenticatedPost, authenticatedGet } from "../../../helpers/api-client";
import { createDeveloperUser } from "../../../helpers/auth-helpers";
import {
  createCollectorQuotesRequest,
  createCollectorShortlistRequest,
  createCollectorNiftyRequest,
  createValidGrowwQuotePayload,
  buildQueryString,
} from "../../../fixtures/test-data";
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

test.describe("POST /v1/developer/collector/lists", () => {
  test("should return 400 when data is missing", async () => {
    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
      developerToken,
      {},
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when timestamp is missing", async () => {
    const requestBody = {
      data: {
        shortlistType: "TOP_GAINERS",
        entries: [],
      },
    };
    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when shortlistType is missing", async () => {
    const requestBody = {
      data: {
        timestamp: "2025-12-31T09:15:00",
        entries: [],
      },
    };
    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when entries is missing", async () => {
    const requestBody = {
      data: {
        timestamp: "2025-12-31T09:15:00",
        shortlistType: "TOP_GAINERS",
      },
    };
    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when shortlistType is invalid", async () => {
    const requestBody = createCollectorShortlistRequest();
    requestBody.data.shortlistType = "INVALID_TYPE" as any;
    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when timestamp format is invalid", async () => {
    const requestBody = createCollectorShortlistRequest();
    requestBody.data.timestamp = "invalid-date";
    const response = await authenticatedPost(
      "/v1/developer/collector/lists",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });
});

test.describe("POST /v1/developer/collector/quotes", () => {
  test("should return 400 when data is missing", async () => {
    const response = await authenticatedPost(
      "/v1/developer/collector/quotes",
      developerToken,
      {},
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when timestamp is missing", async () => {
    const requestBody = {
      data: {
        quotes: [
          {
            nseSymbol: "RELIANCE",
            quoteData: createValidGrowwQuotePayload(),
          },
        ],
      },
    };
    const response = await authenticatedPost(
      "/v1/developer/collector/quotes",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when quotes is missing", async () => {
    const requestBody = {
      data: {
        timestamp: "2025-12-31T09:15:00",
        timezone: "Asia/Kolkata",
      },
    };
    const response = await authenticatedPost(
      "/v1/developer/collector/quotes",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when timestamp format is invalid", async () => {
    const requestBody = createCollectorQuotesRequest();
    requestBody.data.timestamp = "invalid-date";
    const response = await authenticatedPost(
      "/v1/developer/collector/quotes",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });
});

test.describe("POST /v1/developer/collector/nifty", () => {
  test("should return 400 when data is missing", async () => {
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      {},
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when timestamp is missing", async () => {
    const requestBody = {
      data: {
        quoteData: createValidGrowwQuotePayload(),
        dayChangePerc: 0.5,
      },
    };
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when quoteData is missing", async () => {
    const requestBody = {
      data: {
        timestamp: "2025-12-31T09:15:00",
        dayChangePerc: 0.5,
      },
    };
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when timestamp format is invalid", async () => {
    const requestBody = createCollectorNiftyRequest();
    requestBody.data.timestamp = "invalid-date";
    const response = await authenticatedPost(
      "/v1/developer/collector/nifty",
      developerToken,
      requestBody,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });
});

test.describe("GET /v1/developer/collector/lists", () => {
  test("should return 400 when type parameter is missing", async () => {
    const response = await authenticatedGet("/v1/developer/collector/lists", developerToken, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(400);
  });

  test("should return 400 when type is invalid enum value", async () => {
    const query = { type: "invalid-type" };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/collector/lists?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });

  test("should return 400 when datetime format is invalid", async () => {
    const query = { type: "top-gainers", datetime: "invalid-datetime" };
    const queryString = buildQueryString(query);
    const response = await authenticatedGet(
      `/v1/developer/collector/lists?${queryString}`,
      developerToken,
      {
        validateStatus: () => true,
      }
    );

    expect(response.status).toBe(400);
  });
});
