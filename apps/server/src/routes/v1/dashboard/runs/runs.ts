import { FastifyPluginAsync } from "fastify";
import { sendResponse } from "../../../../utils/sendResponse";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import z from "zod";
import { prisma } from "../../../../utils/prisma";
import dayjs from "dayjs";
import { validateRequest } from "../../../../utils/validator";

const runsRoutes: FastifyPluginAsync = async (fastify) => {

  // ==================== GET /runs ====================
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

  // ==================== GET /runs/:runId/orders ====================

  fastify.get("/:runId/orders", async (request, reply) => {
    const validationResult = validateRequest(
      request.params,
      reply,
      v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunOrders.params,
      "params"
    );
    if (!validationResult) {
      return;
    }

    try {
      const { runId } = validationResult;
      const token = request.headers.authorization?.split(" ")[1] || "";

      // Verify the run belongs to the authenticated developer
      const run = await prisma.run.findFirst({
        where: {
          id: runId,
          developer: {
            token: token,
          },
        },
      });

      if (!run) {
        return reply.notFound("Run not found or access denied");
      }

      // Fetch orders for the run
      const orders = await prisma.order.findMany({
        where: {
          runId: runId,
        },
        orderBy: {
          timestamp: "asc",
        },
      });

      return sendResponse<
        z.infer<
          typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunOrders.response
        >
      >({
        statusCode: 200,
        message: "Orders fetched successfully",
        data: orders.map((order) => ({
          id: order.id,
          nseSymbol: order.nseSymbol,
          entryPrice: Number(order.entryPrice),
          stopLossPrice: Number(order.stopLossPrice),
          takeProfitPrice: Number(order.takeProfitPrice),
          timestamp: order.timestamp,
          runId: order.runId,
        })),
      });
    } catch (error) {
      fastify.log.error("Error fetching orders: %s", error);
      return reply.internalServerError(
        "Failed to fetch orders. Please check server logs for more details."
      );
    }
  });
};

export default runsRoutes;
