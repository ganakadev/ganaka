import { v1_dashboard_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { prisma } from "../../../../utils/prisma";
import { sendResponse } from "../../../../utils/sendResponse";

dayjs.extend(utc);
dayjs.extend(timezone);

const tagsRoutes: FastifyPluginAsync = async (fastify) => {
  // ==================== GET /v1/runs/tags ====================
  fastify.get("/", async (request, reply) => {
    try {
      if (!request.developer) {
        return reply.unauthorized("Developer not found or invalid token");
      }

      // Fetch all runs for the authenticated developer
      const runs = await prisma.run.findMany({
        where: {
          developerId: request.developer.id,
        },
        select: {
          tags: true,
        },
      });

      // Extract all tags from all runs and flatten
      const allTags: string[] = [];
      for (const run of runs) {
        if (run.tags && run.tags.length > 0) {
          allTags.push(...run.tags);
        }
      }

      // Remove duplicates and sort
      const uniqueTags = Array.from(new Set(allTags)).sort();

      return sendResponse<
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_tags_schemas.getRunTags.response>
      >(reply, {
        statusCode: 200,
        message: "Tags fetched successfully",
        data: uniqueTags,
      });
    } catch (error) {
      fastify.log.error("Error fetching tags: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to fetch tags. Please check server logs for more details."
      );
    }
  });
};

export default tagsRoutes;
