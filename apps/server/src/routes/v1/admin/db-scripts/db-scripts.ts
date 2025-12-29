import { v1_admin_schemas } from "@ganaka/schemas";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { sendResponse } from "../../../../utils/sendResponse";

const dbScriptsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/", async (request, reply) => {
    try {
      // Execute the migration script
      fastify.log.info(`Executing DB script: fix-timestamps`);

      return sendResponse<
        z.infer<typeof v1_admin_schemas.v1_admin_db_scripts_schemas.dbScriptsSchema.response>
      >(reply, {
        statusCode: 200,
        message: "DB script executed successfully",
        data: {
          status: "completed",
          logs: [],
          affectedRows: {},
        },
      });
    } catch (error) {
      fastify.log.error("Error executing DB script: %s", JSON.stringify(error));

      const errorMessage = error instanceof Error ? error.message : "Failed to execute DB script";

      return sendResponse<
        z.infer<typeof v1_admin_schemas.v1_admin_db_scripts_schemas.dbScriptsSchema.response>
      >(reply, {
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
