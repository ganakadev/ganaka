import { FastifyPluginAsync } from "fastify";
import { v1_developer_groww_schemas } from "@ganaka/schemas";
import { sendResponse } from "../../../../utils/sendResponse";
import { TokenManager } from "../../../../utils/token-manager";
import { RedisManager } from "../../../../utils/redis";

const tokenRoutes: FastifyPluginAsync = async (fastify) => {
  const redisManager = RedisManager.getInstance(fastify);
  const tokenManager = new TokenManager(redisManager.redis, fastify);

  // Get latest token endpoint
  fastify.get("/", async (request, reply) => {
    const token = await tokenManager.getToken();
    return sendResponse(reply, {
      statusCode: 200,
      message: "Token fetched successfully",
      data: token,
    });
  });
};

export default tokenRoutes;