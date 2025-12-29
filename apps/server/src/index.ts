import autoLoad from "@fastify/autoload";
import compress from "@fastify/compress";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import dotenv from "dotenv";
import Fastify from "fastify";
import path from "path";
import authPlugin from "./plugins/auth";
import { prisma } from "./utils/prisma";
import { RedisManager } from "./utils/redis";

dotenv.config();

async function main() {
  // FASTIFY CONFIGURATION
  const fastify = Fastify({ logger: true });
  fastify.register(sensible);
  fastify.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });
  fastify.register(compress, {
    encodings: ["br", "gzip", "deflate"],
    threshold: 1024, // Only compress responses larger than 1KB,
  });

  // Health check endpoint (public, no auth required)
  fastify.get("/health", async (_, reply) => {
    try {
      return reply.send({ status: "healthy", timestamp: new Date().toISOString() });
    } catch (error) {
      fastify.log.error(error, "Health check failed");
      return reply.status(503).send({ status: "unhealthy", error: "Health check failed" });
    }
  });

  // ROUTES CONFIGURATION
  // Register routes with authentication plugins
  // Developer routes (/v1/developer) - protected with developer token
  fastify.register(async function (fastify, opts) {
    await authPlugin("developer")(fastify, opts);
    fastify.register(autoLoad, {
      dir: path.join(__dirname, "routes/v1/developer"),
      options: { prefix: "/v1/developer/" },
      maxDepth: 5,
    });
  });

  // Dashboard routes (/v1/dashboard) - protected with developer token
  fastify.register(async function (fastify, opts) {
    await authPlugin("developer")(fastify, opts);
    fastify.register(autoLoad, {
      dir: path.join(__dirname, "routes/v1/dashboard"),
      options: { prefix: "/v1/dashboard/" },
      maxDepth: 5,
    });
  });

  // Admin routes (/v1/admin) - protected with admin token
  fastify.register(async function (fastify, opts) {
    await authPlugin("admin")(fastify, opts);
    fastify.register(autoLoad, {
      dir: path.join(__dirname, "routes/v1/admin"),
      options: { prefix: "/v1/admin/" },
      maxDepth: 5,
    });
  });

  // SERVER CONFIGURATION
  try {
    const port = parseInt(process.env.PORT || "4000", 10);
    await prisma.$connect();
    fastify.log.info("Database connection established successfully");
    await fastify.listen({ port, host: "0.0.0.0" });
    fastify.log.info(`Server listening on port ${port}`);
  } catch (error) {
    fastify.log.error(error, "Error starting server");
    process.exit(1);
  }

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    fastify.log.info(`Received ${signal}, shutting down gracefully...`);
    try {
      // Close Redis connection if it exists
      const redisManager = RedisManager.getInstance(fastify);
      await redisManager.close();
    } catch (error) {
      // Ignore errors if Redis wasn't initialized or already closed
      fastify.log.warn("Error closing Redis connection: %s", error);
    }
    await prisma.$disconnect();
    await fastify.close();
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
