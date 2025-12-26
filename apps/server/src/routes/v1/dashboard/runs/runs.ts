import { FastifyPluginAsync } from "fastify";
import { sendResponse } from "../../../../utils/sendResponse";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import z from "zod";
import { prisma } from "../../../../utils/prisma";
import { Decimal } from "@ganaka/db/prisma";
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
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.getRuns.response>
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
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunOrders.response>
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

  // ==================== POST /runs ====================

  fastify.post("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.body,
      reply,
      v1_dashboard_schemas.v1_dashboard_runs_schemas.createRun.body,
      "body"
    );
    if (!validationResult) {
      return;
    }

    try {
      const { startTime, endTime } = validationResult;
      const token = request.headers.authorization?.split(" ")[1] || "";

      // Get developer from token
      const developer = await prisma.developer.findUnique({
        where: { token },
      });

      if (!developer) {
        return reply.unauthorized("Developer not found or invalid token");
      }

      // Create a new run
      const run = await prisma.run.create({
        data: {
          startTime: startTime,
          endTime: endTime,
          developer: {
            connect: {
              id: developer.id,
            },
          },
        },
      });

      return sendResponse<
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.createRun.response>
      >({
        statusCode: 201,
        message: "Run created successfully",
        data: {
          id: run.id,
          startTime: run.startTime,
          endTime: run.endTime,
          completed: run.completed,
        },
      });
    } catch (error) {
      fastify.log.error("Error creating run: %s", error);
      return reply.internalServerError(
        "Failed to create run. Please check server logs for more details."
      );
    }
  });

  // ==================== PATCH /runs/:runId ====================

  fastify.patch("/:runId", async (request, reply) => {
    const paramsValidationResult = validateRequest(
      request.params,
      reply,
      v1_dashboard_schemas.v1_dashboard_runs_schemas.updateRun.params,
      "params"
    );
    if (!paramsValidationResult) {
      return;
    }

    const bodyValidationResult = validateRequest(
      request.body,
      reply,
      v1_dashboard_schemas.v1_dashboard_runs_schemas.updateRun.body,
      "body"
    );
    if (!bodyValidationResult) {
      return;
    }

    try {
      const { runId } = paramsValidationResult;
      const { completed } = bodyValidationResult;
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

      // Update the run
      const updatedRun = await prisma.run.update({
        where: { id: runId },
        data: {
          ...(completed !== undefined && { completed }),
        },
      });

      return sendResponse<
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.updateRun.response>
      >({
        statusCode: 200,
        message: "Run updated successfully",
        data: {
          id: updatedRun.id,
          startTime: updatedRun.startTime,
          endTime: updatedRun.endTime,
          completed: updatedRun.completed,
        },
      });
    } catch (error) {
      fastify.log.error("Error updating run: %s", error);
      return reply.internalServerError(
        "Failed to update run. Please check server logs for more details."
      );
    }
  });

  // ==================== DELETE /runs/:runId ====================

  fastify.delete("/:runId", async (request, reply) => {
    const validationResult = validateRequest(
      request.params,
      reply,
      v1_dashboard_schemas.v1_dashboard_runs_schemas.deleteRun.params,
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

      // Delete the run
      await prisma.run.delete({
        where: { id: runId },
      });

      return sendResponse<
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.deleteRun.response>
      >({
        statusCode: 200,
        message: "Run deleted successfully",
        data: {
          id: runId,
        },
      });
    } catch (error) {
      fastify.log.error("Error deleting run: %s", error);
      return reply.internalServerError(
        "Failed to delete run. Please check server logs for more details."
      );
    }
  });

  // ==================== POST /runs/:runId/orders ====================

  fastify.post("/:runId/orders", async (request, reply) => {
    const paramsValidationResult = validateRequest(
      request.params,
      reply,
      v1_dashboard_schemas.v1_dashboard_runs_schemas.createOrder.params,
      "params"
    );
    if (!paramsValidationResult) {
      return;
    }

    const bodyValidationResult = validateRequest(
      request.body,
      reply,
      v1_dashboard_schemas.v1_dashboard_runs_schemas.createOrder.body,
      "body"
    );
    if (!bodyValidationResult) {
      return;
    }

    try {
      const { runId } = paramsValidationResult;
      const { nseSymbol, entryPrice, stopLossPrice, takeProfitPrice, timestamp } =
        bodyValidationResult;
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

      // Create the order
      const order = await prisma.order.create({
        data: {
          nseSymbol: nseSymbol,
          entryPrice: new Decimal(entryPrice),
          stopLossPrice: new Decimal(stopLossPrice),
          takeProfitPrice: new Decimal(takeProfitPrice),
          timestamp: timestamp,
          run: {
            connect: {
              id: runId,
            },
          },
        },
      });

      return sendResponse<
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.createOrder.response>
      >({
        statusCode: 201,
        message: "Order created successfully",
        data: {
          id: order.id,
          nseSymbol: order.nseSymbol,
          entryPrice: Number(order.entryPrice),
          stopLossPrice: Number(order.stopLossPrice),
          takeProfitPrice: Number(order.takeProfitPrice),
          timestamp: order.timestamp,
          runId: order.runId,
        },
      });
    } catch (error) {
      fastify.log.error("Error creating order: %s", error);
      return reply.internalServerError(
        "Failed to create order. Please check server logs for more details."
      );
    }
  });
};

export default runsRoutes;
