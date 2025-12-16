import dotenv from "dotenv";
import Redis from "ioredis";
import { TokenManager } from "./utils/token-manager";
import { createServer } from "./server";

dotenv.config();

async function main() {
  // Get configuration from environment variables
  const port = parseInt(process.env.PORT || "4000", 10);
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    throw new Error("REDIS_URL is not set");
  }

  // Initialize Redis
  const redis = new Redis(redisUrl);

  redis.on("error", (error) => {
    console.error("Redis connection error:", error);
  });

  redis.on("connect", () => {
    console.log("Connected to Redis");
  });

  // Initialize token manager
  const tokenManager = new TokenManager(redis);

  // Create and start Fastify server
  const server = await createServer({
    port,
    tokenManager,
  });

  // Start server
  try {
    await server.listen({ port, host: "0.0.0.0" });
    console.log(`Groww service server listening on port ${port}`);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}, shutting down gracefully...`);
    await server.close();
    await redis.quit();
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
