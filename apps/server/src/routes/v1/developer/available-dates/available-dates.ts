import { FastifyPluginAsync } from "fastify";
import { prisma } from "../../../../utils/prisma";
import { sendResponse } from "../../../../utils/sendResponse";
import { v1_developer_available_dates_schemas } from "@ganaka/schemas";
import z from "zod";
import { formatDateTime, formatDate } from "../../../../utils/date-formatter";

const availableDatesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async (_, reply) => {
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
        const dateKey = formatDate(snapshot.timestamp);
        const timestampUTC = formatDateTime(snapshot.timestamp);

        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, []);
        }

        dateMap.get(dateKey)!.push(timestampUTC);
      });

      // Convert to response format
      const dates = Array.from(dateMap.entries()).map(([date, timestamps]) => ({
        date,
        timestamps,
      }));

      return sendResponse<
        z.infer<typeof v1_developer_available_dates_schemas.getAvailableDates.response>
      >(reply, {
        statusCode: 200,
        message: "Available dates fetched successfully",
        data: {
          dates,
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching available dates: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to fetch available dates. Please check server logs for more details."
      );
    }
  });
};

export default availableDatesRoutes;
