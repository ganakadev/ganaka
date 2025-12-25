import { FastifyPluginAsync } from "fastify";
import { sendResponse } from "../../../../utils/sendResponse";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import z from "zod";
import { prisma } from "../../../../utils/prisma";
import dayjs from "dayjs";

const runsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async (request, reply) => {
    try {
      // Fetch runs with order count for the authenticated developer
      const runs = await prisma.run.findMany({
        where: {
          developer: {
            token: request.headers.authorization?.split(" ")[1] || "",
          },
        },
        include: {
          _count: {
            select: { orders: true },
          },
        },
        orderBy: { startTime: "desc" },
      });

      // Group runs by date (startTime date)
      const groupedRuns: Record<
        string,
        Array<{
          id: string;
          startTime: Date;
          endTime: Date;
          completed: boolean;
          orderCount: number;
        }>
      > = {};

      for (const run of runs) {
        const dateKey = dayjs(run.startTime).format("YYYY-MM-DD");
        if (!groupedRuns[dateKey]) {
          groupedRuns[dateKey] = [];
        }
        groupedRuns[dateKey].push({
          id: run.id,
          startTime: run.startTime,
          endTime: run.endTime,
          completed: run.completed,
          orderCount: run._count.orders,
        });
      }

      // Sort dates descending (newest first)
      const sortedDates = Object.keys(groupedRuns).sort((a, b) => {
        return dayjs(b).valueOf() - dayjs(a).valueOf();
      });

      // Create final grouped object with sorted dates
      const sortedGroupedRuns: Record<
        string,
        Array<{
          id: string;
          startTime: Date;
          endTime: Date;
          completed: boolean;
          orderCount: number;
        }>
      > = {};
      for (const date of sortedDates) {
        sortedGroupedRuns[date] = groupedRuns[date];
      }

      return sendResponse<
        z.infer<
          typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.getRuns.response
        >
      >({
        statusCode: 200,
        message: "Runs fetched successfully",
        data: sortedGroupedRuns,
      });
    } catch (error) {
      fastify.log.error("Error fetching runs: %s", error);
      return reply.internalServerError(
        "Failed to fetch runs. Please check server logs for more details."
      );
    }
  });
};

export default runsRoutes;
