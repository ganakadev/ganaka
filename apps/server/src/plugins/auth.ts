import { FastifyPluginAsync } from "fastify";
import { prisma } from "../utils/prisma";

const authPlugin =
  (type: "admin" | "developer"): FastifyPluginAsync =>
  async (fastify) => {
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

        // authenticate user or developer
        switch (type) {
          case "admin": {
            const adminRecord = await prisma.developer.findUnique({
              where: {
                username: "admin",
              },
            });
            if (!adminRecord || adminRecord.token !== token) {
              fastify.log.info("Admin not found or inactive");
              return reply.unauthorized(
                "Authorization failed for this admin request. Please check your credentials and try again."
              );
            }

            // Attach admin info to request object
            request.admin = {
              id: adminRecord.id,
              username: adminRecord.username,
              token: token,
            };

            fastify.log.info(`Admin authenticated: ${adminRecord.username}`);
            break;
          }
          case "developer": {
            const developer = await prisma.developer.findUnique({
              where: { token },
            });
            if (!developer) {
              fastify.log.info("Developer not found or inactive");
              return reply.unauthorized(
                "Authorization failed for this developer request. Please check your credentials and try again."
              );
            }

            // Attach developer info to request object
            request.developer = {
              id: developer.id,
              username: developer.username,
              token: token,
            };

            // Authentication successful, continue to the route handler
            fastify.log.info(`Developer authenticated: ${developer.username}`);
            break;
          }
        }
      } catch (error) {
        fastify.log.error(JSON.stringify(error));
        return reply.internalServerError("Authentication failed due to an internal error.");
      }
    });

    fastify.log.info(`${type} authentication plugin loaded`);
  };

export default authPlugin;
