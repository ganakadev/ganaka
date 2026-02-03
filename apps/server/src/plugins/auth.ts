import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { prisma } from "../utils/prisma";
import { parseDateTimeInTimezone } from "../utils/timezone";
import { datetimeFormatSchema } from "@ganaka/schemas";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { decrypt } from "../utils/encryption";
import "../types/fastify";

dayjs.extend(utc);
dayjs.extend(timezone);

const authPlugin = async (fastify: FastifyInstance) => {
  fastify.addHook("preHandler", async (request, reply) => {
    try {
      // Check for authorization header - return 401 if missing
      const authorization = request.headers.authorization;
      if (!authorization || typeof authorization !== "string") {
        fastify.log.info("Missing authorization header");
        return reply.unauthorized(
          "Authorization header is required. Please check your credentials and try again."
        );
      }

      // validate authorization header format
      if (!authorization.startsWith("Bearer ")) {
        fastify.log.info("Invalid authorization header format");
        return reply.unauthorized(
          "Invalid authorization header. Please check your credentials and try again."
        );
      }
      const token = authorization.substring(7);

      // authenticate if admin or developer
      const userRecord = await prisma.developer.findUnique({
        where: { token },
      });

      if (!userRecord) {
        fastify.log.info(`Developer not found or inactive: ${token}`);
        return reply.unauthorized(
          "Authorization failed for this user request. Please check your credentials and try again."
        );
      }

      if (userRecord.username === "admin") {
        fastify.log.info(`Admin authenticated: ${userRecord.username}`);
        request.admin = {
          id: userRecord.id,
          username: userRecord.username,
          token: token,
        };
      } else {
        // Decrypt Groww credentials after reading from database
        let decryptedApiKey: string | null = null;
        let decryptedApiSecret: string | null = null;

        try {
          decryptedApiKey = decrypt(userRecord.growwApiKey);
          decryptedApiSecret = decrypt(userRecord.growwApiSecret);
        } catch (error) {
          fastify.log.error(
            `Failed to decrypt Groww credentials for developer ${userRecord.id}: ${JSON.stringify(error)}`
          );
          // Set to null if decryption fails (credentials may be corrupted or use different key)
          decryptedApiKey = null;
          decryptedApiSecret = null;
        }

        // Attach developer info to request object
        request.developer = {
          id: userRecord.id,
          username: userRecord.username,
          token: token,
          growwApiKey: decryptedApiKey,
          growwApiSecret: decryptedApiSecret,
        };

        // when algorithms call APIs, tagging their run id for analytics
        const runIdHeader = request.headers["x-run-id"];
        if (runIdHeader && typeof runIdHeader === "string") {
          request.runId = runIdHeader;
        }

        // used to time block the data being sent back (for backtesting)
        const currentTimestampHeader = request.headers["x-current-timestamp"];
        const currentTimezoneHeader = request.headers["x-current-timezone"];
        const timezone =
          currentTimezoneHeader && typeof currentTimezoneHeader === "string"
            ? currentTimezoneHeader
            : "Asia/Kolkata"; // Default to Asia/Kolkata if not provided

        if (currentTimestampHeader && typeof currentTimestampHeader === "string") {
          // Validate timestamp format - must be YYYY-MM-DDTHH:mm:ss without Z or timezone offset
          const validationResult = datetimeFormatSchema.safeParse(currentTimestampHeader);
          if (!validationResult.success) {
            const errorMessage = validationResult.error.issues.map((err) => err.message).join(", ");
            fastify.log.warn(
              `Invalid X-Current-Timestamp format: ${currentTimestampHeader}. ${errorMessage}`
            );
            return reply.badRequest(
              `Invalid X-Current-Timestamp header format: ${errorMessage}. Timestamp must be in format YYYY-MM-DDTHH:mm:ss without timezone information (Z or offset).`
            );
          }

          try {
            // Parse the validated datetime string in the specified timezone
            const parsedTimestamp = parseDateTimeInTimezone(validationResult.data, timezone);
            request.currentTimestamp = parsedTimestamp;
            request.currentTimezone = timezone;
          } catch (error) {
            fastify.log.warn(
              `Failed to parse X-Current-Timestamp: ${currentTimestampHeader}. Error: ${
                error instanceof Error ? error.message : String(error)
              }`
            );
            return reply.badRequest(
              `Failed to parse X-Current-Timestamp: ${
                error instanceof Error ? error.message : String(error)
              }`
            );
          }
        }

        // Log warning if runId is present but currentTimestamp is missing
        if (request.runId && !request.currentTimestamp) {
          fastify.log.warn(
            `X-Run-Id header present but X-Current-Timestamp is missing for run: ${request.runId}`
          );
        }

        // Authentication successful, continue to the route handler
        fastify.log.info(`Authentication successful for user: ${userRecord.username}`);
      }
    } catch (error) {
      fastify.log.error(JSON.stringify(error));
      return reply.internalServerError("Authentication failed due to an internal error.");
    }
  });

  fastify.log.info(`Authentication plugin loaded`);
};

export default authPlugin;
