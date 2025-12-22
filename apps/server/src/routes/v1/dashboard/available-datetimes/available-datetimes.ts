import { FastifyPluginAsync } from "fastify";
import { prisma } from "../../../../utils/prisma";
import { sendResponse } from "../../../../utils/sendResponse";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import z from "zod";

const availableDatetimesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async (request, reply) => {
    try {
      // Get all unique timestamps from ShortlistSnapshot
      const snapshots = await prisma.shortlistSnapshot.findMany({
        select: {
          timestamp: true,
        },
        distinct: ["timestamp"],
        orderBy: {
          timestamp: "asc",
        },
      });

      // Group timestamps by date
      const dateMap = new Map<string, string[]>();

      snapshots.forEach((snapshot) => {
        const dateKey = snapshot.timestamp.toISOString().split("T")[0];
        const timestampISO = snapshot.timestamp.toISOString();

        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, []);
        }

        dateMap.get(dateKey)!.push(timestampISO);
      });

      // Convert to response format
      const dates = Array.from(dateMap.entries()).map(([date, timestamps]) => ({
        date,
        timestamps,
      }));

      return sendResponse<
        z.infer<
          typeof v1_dashboard_schemas.v1_dashboard_available_datetimes_schemas.getAvailableDatetimes.response
        >
      >({
        statusCode: 200,
        message: "Available datetimes fetched successfully",
        data: {
          dates,
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching available datetimes: %s", error);
      return reply.internalServerError(
        "Failed to fetch available datetimes. Please check server logs for more details."
      );
    }
  });
};

export default availableDatetimesRoutes;
