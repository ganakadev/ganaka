import { v1_admin_schemas } from "@ganaka/schemas";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { sendResponse } from "../../../../utils/sendResponse";
import { validateRequest } from "../../../../utils/validator";
import { FastifyInstance } from "fastify";
import { prisma } from "../../../../utils/prisma";

/**
 * Fixes timestamps that were incorrectly stored as UTC when they were actually IST
 * Subtracts 5 hours 30 minutes (IST offset) from all affected timestamps
 */
async function fixTimestamps(fastify: FastifyInstance): Promise<{
  logs: string[];
  affectedRows: Record<string, number>;
}> {
  const logs: string[] = [];
  const affectedRows: Record<string, number> = {};

  try {
    logs.push("Starting timestamp migration...");
    fastify.log.info("Starting timestamp migration");

    // IST offset: 5 hours 30 minutes = 330 minutes
    const IST_OFFSET_MINUTES = 330;

    // Fix ShortlistSnapshot timestamps using raw SQL for better performance
    logs.push("Fixing ShortlistSnapshot timestamps...");
    fastify.log.info("Fixing ShortlistSnapshot timestamps");
    const shortlistResult = await prisma.$executeRaw`
      UPDATE shortlist_snapshots 
      SET timestamp = timestamp - INTERVAL '330 minutes'
    `;
    affectedRows.shortlist_snapshots = Number(shortlistResult);
    logs.push(
      `Fixed ${affectedRows.shortlist_snapshots} ShortlistSnapshot records`
    );

    // Fix QuoteSnapshot timestamps
    logs.push("Fixing QuoteSnapshot timestamps...");
    fastify.log.info("Fixing QuoteSnapshot timestamps");
    const quoteResult = await prisma.$executeRaw`
      UPDATE quote_snapshots 
      SET timestamp = timestamp - INTERVAL '330 minutes'
    `;
    affectedRows.quote_snapshots = Number(quoteResult);
    logs.push(`Fixed ${affectedRows.quote_snapshots} QuoteSnapshot records`);

    // Fix NiftyQuote timestamps
    logs.push("Fixing NiftyQuote timestamps...");
    fastify.log.info("Fixing NiftyQuote timestamps");
    const niftyResult = await prisma.$executeRaw`
      UPDATE nifty_quotes 
      SET timestamp = timestamp - INTERVAL '330 minutes'
    `;
    affectedRows.nifty_quotes = Number(niftyResult);
    logs.push(`Fixed ${affectedRows.nifty_quotes} NiftyQuote records`);

    // Fix CollectorError timestamps
    logs.push("Fixing CollectorError timestamps...");
    fastify.log.info("Fixing CollectorError timestamps");
    const errorResult = await prisma.$executeRaw`
      UPDATE collector_errors 
      SET timestamp = timestamp - INTERVAL '330 minutes'
    `;
    affectedRows.collector_errors = Number(errorResult);
    logs.push(`Fixed ${affectedRows.collector_errors} CollectorError records`);

    logs.push("Timestamp migration completed successfully!");
    fastify.log.info("Timestamp migration completed successfully");

    return { logs, affectedRows };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    logs.push(`Error during timestamp migration: ${errorMessage}`);
    fastify.log.error(error, "Error during timestamp migration");
    throw error;
  }
}

const dbScriptsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/", async (request, reply) => {
    try {
      // Execute the migration script
      fastify.log.info(`Executing DB script: fix-timestamps`);
      const result = await fixTimestamps(fastify);

      return sendResponse<
        z.infer<
          typeof v1_admin_schemas.v1_admin_db_scripts_schemas.dbScriptsSchema.response
        >
      >({
        statusCode: 200,
        message: "DB script executed successfully",
        data: {
          status: "completed",
          logs: result.logs,
          affectedRows: result.affectedRows,
        },
      });
    } catch (error) {
      fastify.log.error("Error executing DB script: %s", error);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to execute DB script";

      return sendResponse<
        z.infer<
          typeof v1_admin_schemas.v1_admin_db_scripts_schemas.dbScriptsSchema.response
        >
      >({
        statusCode: 500,
        message: "DB script execution failed",
        data: {
          status: "failed",
          logs: [`Error: ${errorMessage}`],
          error: errorMessage,
        },
      });
    }
  });
};

export default dbScriptsRoutes;
