import { FastifyPluginAsync } from "fastify";
import { sendResponse } from "../../../../utils/sendResponse";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import { validateRequest } from "../../../../utils/validator";
import z from "zod";
import { prisma } from "../../../../utils/prisma";
import { TokenManager } from "../../../../utils/token-manager";
import { RedisManager } from "../../../../utils/redis";
import { encrypt, decrypt } from "../../../../utils/encryption";

/**
 * Mask API key for display (show first 4 and last 4 characters)
 */
function maskApiKey(apiKey: string | null | undefined): string | null {
  if (!apiKey) {
    return null;
  }
  if (apiKey.length <= 8) {
    return "****";
  }
  return `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;
}

const settingsRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /settings/groww-credentials - Get current credential status
  fastify.get("/groww-credentials", async (request, reply) => {
    try {
      if (!request.developer) {
        return reply.unauthorized("Developer not authenticated");
      }

      const developer = await prisma.developer.findUnique({
        where: { id: request.developer.id },
        select: {
          growwApiKey: true,
          growwApiSecret: true,
        },
      });

      if (!developer) {
        return reply.notFound("Developer not found");
      }

      // Decrypt fields after reading from database
      let decryptedApiKey: string | null = null;
      let decryptedApiSecret: string | null = null;

      try {
        decryptedApiKey = decrypt(developer.growwApiKey);
        decryptedApiSecret = decrypt(developer.growwApiSecret);
      } catch (error) {
        fastify.log.error(
          `Failed to decrypt Groww credentials for developer ${request.developer.id}: ${JSON.stringify(error)}`
        );
        // Set to null if decryption fails (credentials may be corrupted or use different key)
        decryptedApiKey = null;
        decryptedApiSecret = null;
      }

      return sendResponse<
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_settings_schemas.getGrowwCredentials.response>
      >(reply, {
        statusCode: 200,
        message: "Groww credentials status fetched successfully",
        data: {
          hasGrowwApiKey: !!decryptedApiKey,
          hasGrowwApiSecret: !!decryptedApiSecret,
          growwApiKeyMasked: maskApiKey(decryptedApiKey),
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching Groww credentials: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to fetch Groww credentials. Please check server logs for more details."
      );
    }
  });

  // PUT /settings/groww-credentials - Update Groww credentials
  fastify.put("/groww-credentials", async (request, reply) => {
    try {
      if (!request.developer) {
        return reply.unauthorized("Developer not authenticated");
      }

      const validationResult = validateRequest(
        request.body,
        reply,
        v1_dashboard_schemas.v1_dashboard_settings_schemas.updateGrowwCredentials.body,
        "body"
      );
      if (!validationResult) {
        return;
      }

      // Encrypt credentials before saving to database
      const encryptedApiKey = encrypt(validationResult.growwApiKey);
      const encryptedApiSecret = encrypt(validationResult.growwApiSecret);

      // Update developer credentials
      await prisma.developer.update({
        where: { id: request.developer.id },
        data: {
          growwApiKey: encryptedApiKey,
          growwApiSecret: encryptedApiSecret,
        },
      });

      // Invalidate cached token for this developer
      const redisManager = RedisManager.getInstance(fastify);
      const tokenManager = new TokenManager(redisManager.redis, fastify);
      await tokenManager.invalidateTokenForDeveloper(request.developer.id);

      return sendResponse<
        z.infer<
          typeof v1_dashboard_schemas.v1_dashboard_settings_schemas.updateGrowwCredentials.response
        >
      >(reply, {
        statusCode: 200,
        message: "Groww credentials updated successfully",
        data: {
          success: true,
        },
      });
    } catch (error) {
      fastify.log.error("Error updating Groww credentials: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to update Groww credentials. Please check server logs for more details."
      );
    }
  });

  // DELETE /settings/groww-credentials - Remove Groww credentials
  fastify.delete("/groww-credentials", async (request, reply) => {
    try {
      if (!request.developer) {
        return reply.unauthorized("Developer not authenticated");
      }

      // Update developer to remove credentials
      await prisma.developer.update({
        where: { id: request.developer.id },
        data: {
          growwApiKey: null,
          growwApiSecret: null,
        },
      });

      // Invalidate cached token for this developer
      const redisManager = RedisManager.getInstance(fastify);
      const tokenManager = new TokenManager(redisManager.redis, fastify);
      await tokenManager.invalidateTokenForDeveloper(request.developer.id);

      return sendResponse<
        z.infer<
          typeof v1_dashboard_schemas.v1_dashboard_settings_schemas.deleteGrowwCredentials.response
        >
      >(reply, {
        statusCode: 200,
        message: "Groww credentials deleted successfully",
        data: {
          success: true,
        },
      });
    } catch (error) {
      fastify.log.error("Error deleting Groww credentials: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to delete Groww credentials. Please check server logs for more details."
      );
    }
  });
};

export default settingsRoutes;
