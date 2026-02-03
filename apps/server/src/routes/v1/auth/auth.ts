import { v1_schemas } from "@ganaka/schemas";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { prisma } from "../../../utils/prisma";
import { sendResponse } from "../../../utils/sendResponse";
import { validateRequest } from "../../../utils/validator";

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // ==================== POST /v1/auth ====================
  fastify.post("/", async (request, reply) => {
    try {
      // Validate request body
      const validationResult = validateRequest(
        request.body,
        reply,
        v1_schemas.v1_auth_schemas.signIn.body,
        "body"
      );
      if (!validationResult) {
        return;
      }

      // Get developer from database
      const developer = await prisma.developer.findUnique({
        where: { token: validationResult.developerToken },
      });

      if (!developer) {
        return reply.unauthorized("Invalid developer token");
      }

      return sendResponse<z.infer<typeof v1_schemas.v1_auth_schemas.signIn.response>>(reply, {
        statusCode: 200,
        message: "Developer signed in successfully",
        data: {
          id: developer.id,
          username: developer.username,
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching developer details: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to fetch developer details. Please check server logs for more details."
      );
    }
  });
};

export default authRoutes;
