import { FastifyPluginAsync } from "fastify";
import { RedisManager } from "../../../../utils/redis";
import { sendResponse } from "../../../../utils/sendResponse";
import { TokenManager } from "../../../../utils/token-manager";
import { v1_schemas } from "@ganaka/schemas";
import z from "zod";

const tokenRoutes: FastifyPluginAsync = async (fastify) => {
  const redisManager = RedisManager.getInstance(fastify);
  const tokenManager = new TokenManager(redisManager.redis, fastify);

  // ==================== GET /v1/groww/token ====================
  fastify.get("/", async (request, reply) => {
    try {
      const developerCredentials = request.developer
        ? {
            developerId: request.developer.id,
            growwApiKey: request.developer.growwApiKey,
            growwApiSecret: request.developer.growwApiSecret,
          }
        : undefined;

      const token = await tokenManager.getToken(
        developerCredentials?.developerId,
        developerCredentials?.growwApiKey,
        developerCredentials?.growwApiSecret
      );

      return sendResponse<z.infer<typeof v1_schemas.v1_groww_token_schemas.getGrowwToken.response>>(
        reply,
        {
          statusCode: 200,
          message: "Token fetched successfully",
          data: token,
        }
      );
    } catch (error) {
      fastify.log.error("Error fetching Groww token: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to fetch Groww token. Please check server logs for more details."
      );
    }
  });
};

export default tokenRoutes;
