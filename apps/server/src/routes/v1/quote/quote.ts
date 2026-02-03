import { growwQuoteSchema, v1_developer_quote_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { makeGrowwAPIRequest } from "../../../utils/groww-api-request";
import { RedisManager } from "../../../utils/redis";
import { sendResponse } from "../../../utils/sendResponse";
import { TokenManager } from "../../../utils/token-manager";
import { validateRequest } from "../../../utils/validator";

dayjs.extend(utc);
dayjs.extend(timezone);

const quoteRoutes: FastifyPluginAsync = async (fastify) => {
  const redisManager = RedisManager.getInstance(fastify);
  const tokenManager = new TokenManager(redisManager.redis, fastify);
  const growwAPIRequest = makeGrowwAPIRequest(fastify, tokenManager);

  // ==================== GET /v1/quote ====================
  fastify.get("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_developer_quote_schemas.getGrowwQuote.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    try {
      const developerCredentials = request.developer
        ? {
            developerId: request.developer.id,
            growwApiKey: request.developer.growwApiKey,
            growwApiSecret: request.developer.growwApiSecret,
          }
        : undefined;

      const response = await growwAPIRequest<z.infer<typeof growwQuoteSchema>>({
        method: "get",
        url: `https://api.groww.in/v1/live-data/quote`,
        params: {
          exchange: "NSE",
          segment: "CASH",
          trading_symbol: validationResult.symbol,
        },
        developerCredentials,
      });

      return sendResponse<z.infer<typeof v1_developer_quote_schemas.getGrowwQuote.response>>(
        reply,
        {
          statusCode: 200,
          message: "Quote fetched successfully",
          data: response,
        }
      );
    } catch (error) {
      fastify.log.error("Error fetching quote: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to fetch quote. Please check server logs for more details."
      );
    }
  });
};

export default quoteRoutes;
