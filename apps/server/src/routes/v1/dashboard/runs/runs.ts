import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { sendResponse } from "../../../../utils/sendResponse";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import z from "zod";
import { prisma } from "../../../../utils/prisma";
import { Decimal } from "@ganaka/db/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { validateRequest } from "../../../../utils/validator";
import { RedisManager } from "../../../../utils/redis";
import { TokenManager } from "../../../../utils/token-manager";
import { makeGrowwAPIRequest } from "../../../../utils/groww-api-request";
import { parseDateTimeInTimezone } from "../../../../utils/timezone";
import { formatDateTime } from "../../../../utils/date-formatter";

dayjs.extend(utc);
dayjs.extend(timezone);

// Type for order with gain metrics, extracted from the Zod schema
type OrderWithMetrics = z.infer<
  typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunOrders.response
>["data"][number];

/**
 * Calculate gain metrics for an order based on historical candle data after order placement.
 * Only considers price movements that occurred after the order was placed, making it
 * more relevant for algorithm evaluation by showing actual post-entry opportunity.
 */
async function calculateOrderGainMetrics({
  nseSymbol,
  entryPrice,
  stopLossPrice,
  orderTimestamp,
  targetGainPercentage,
  growwAPIRequest,
}: {
  nseSymbol: string;
  entryPrice: number;
  stopLossPrice: number;
  orderTimestamp: Date;
  targetGainPercentage?: number;
  growwAPIRequest: <T>({
    method,
    url,
    params,
  }: {
    url: string;
    method: string;
    params?: Record<string, any>;
  }) => Promise<T>;
}): Promise<{
  targetGainPercentage?: number;
  targetAchieved?: boolean;
  targetGainPercentageActual?: number;
  timeToTargetMinutes?: number;
  targetTimestamp?: Date;
  stopLossHit?: boolean;
  stopLossTimestamp?: Date;
  timeToStopLossMinutes?: number;
  dynamicTakeProfitPrice?: number;
}> {
  try {
    // Get the date in IST timezone and set market hours (9:15 AM - 3:30 PM IST)
    const dateStr = dayjs.utc(orderTimestamp).tz("Asia/Kolkata").format("YYYY-MM-DD");
    const marketStart = dayjs.tz(`${dateStr} 09:15:00`, "Asia/Kolkata");
    const marketEnd = dayjs.tz(`${dateStr} 15:30:00`, "Asia/Kolkata");

    // Convert to format expected by Groww API: YYYY-MM-DDTHH:mm:ss (no milliseconds, no Z)
    // The API expects times in IST format without timezone suffix
    const start_time = marketStart.format("YYYY-MM-DDTHH:mm:ss");
    const end_time = marketEnd.format("YYYY-MM-DDTHH:mm:ss");

    // Fetch historical candles from Groww API
    const response = await growwAPIRequest<{
      status: "SUCCESS" | "FAILURE";
      payload: {
        candles: Array<[string, number, number, number, number, number, number | null]>;
        closing_price: number | null;
        start_time: string;
        end_time: string;
        interval_in_minutes: number;
      };
    }>({
      method: "get",
      url: `https://api.groww.in/v1/historical/candles`,
      params: {
        candle_interval: "1minute",
        start_time,
        end_time,
        exchange: "NSE",
        segment: "CASH",
        groww_symbol: `NSE-${nseSymbol}`,
      },
    });

    if (
      response.status !== "SUCCESS" ||
      !response.payload?.candles ||
      response.payload.candles.length === 0
    ) {
      return {};
    }

    // Parse candles: [timestamp, open, high, low, close, volume, turnover]
    const candles = response.payload.candles.map((candle) => {
      const [timestamp, open, high, low, close] = candle;
      return {
        // convert to UTC since orderTimestamp is in UTC
        timestamp: dayjs.tz(timestamp, "Asia/Kolkata").utc().toDate(),
        open,
        high,
        low,
        close,
      };
    });

    // Find entry price at placement: candle at or before orderTimestamp
    let entryPriceAtPlacement = entryPrice;
    for (let i = candles.length - 1; i >= 0; i--) {
      const candle = candles[i];
      // Only ignore candles strictly after order placement (not equal to orderTimestamp)
      if (
        dayjs.utc(candle.timestamp).isAfter(dayjs.utc(orderTimestamp), "minute") &&
        !dayjs.utc(candle.timestamp).isSame(dayjs.utc(orderTimestamp), "minute")
      ) {
        continue;
      }
      if (candle.close && typeof candle.close === "number") {
        entryPriceAtPlacement = candle.close;
        break;
      }
    }

    // Avoid division by zero
    if (!entryPriceAtPlacement || entryPriceAtPlacement === 0) {
      return {};
    }

    // If target percentage is not provided, return empty metrics
    if (targetGainPercentage === undefined) {
      return {};
    }

    const result: {
      targetGainPercentage?: number;
      targetAchieved?: boolean;
      targetGainPercentageActual?: number;
      timeToTargetMinutes?: number;
      targetTimestamp?: Date;
      stopLossHit?: boolean;
      stopLossTimestamp?: Date;
      timeToStopLossMinutes?: number;
      dynamicTakeProfitPrice?: number;
    } = {
      targetGainPercentage: targetGainPercentage,
    };

    /**
     * Calculates the target price needed to achieve the target gain percentage
     * Example:
     * Entry price: ₹100
     * Target gain percentage: 10%
     * Target price: 100 × (1 + 10/100) = 100 × 1.10 = ₹110
     * */
    const targetPrice = entryPriceAtPlacement * (1 + targetGainPercentage / 100);
    result.dynamicTakeProfitPrice = targetPrice;
    let targetTimestamp: Date | null = null;
    let stopLossTimestamp: Date | null = null;
    let bestPrice = entryPriceAtPlacement;

    // Check all candles after order placement to see if target or stop loss was reached
    for (const candle of candles) {
      // Only consider candles strictly after order placement (not equal to)
      if (!dayjs.utc(candle.timestamp).isAfter(dayjs.utc(orderTimestamp), "minute")) {
        continue;
      }

      // Check for stop loss hit (using candle low price)
      if (candle.low && typeof candle.low === "number" && stopLossTimestamp === null) {
        if (candle.low <= stopLossPrice) {
          stopLossTimestamp = candle.timestamp;
        }
      }

      // Check for take profit hit (using candle high price)
      if (candle.high && typeof candle.high === "number") {
        const highPrice = candle.high;

        // Track best price for calculating actual gain if target not achieved
        if (highPrice > bestPrice) {
          bestPrice = highPrice;
        }

        // Check if target price was reached (only record first occurrence)
        if (targetTimestamp === null && highPrice >= targetPrice) {
          targetTimestamp = candle.timestamp;
        }
      }
    }

    // Determine which happened first: stop loss or take profit
    // If stop loss was hit, we exit immediately, so target cannot be achieved
    // If take profit was hit first, we exit at take profit, so target is achieved
    let stopLossHit = false;
    let stopLossTimeDiffSeconds = Infinity;
    let targetTimeDiffSeconds = Infinity;

    if (stopLossTimestamp !== null) {
      const stopLossTimestampUTC = dayjs.utc(stopLossTimestamp).format("YYYY-MM-DD HH:mm:ss");
      stopLossTimeDiffSeconds = dayjs
        .utc(stopLossTimestampUTC)
        .diff(dayjs.utc(orderTimestamp), "second", true);

      // Ensure the timestamp is truly after the order (at least 1 second difference)
      if (stopLossTimeDiffSeconds >= 1) {
        stopLossHit = true;
      }
    }

    if (targetTimestamp !== null) {
      const targetTimestampUTC = dayjs.utc(targetTimestamp).format("YYYY-MM-DD HH:mm:ss");
      targetTimeDiffSeconds = dayjs
        .utc(targetTimestampUTC)
        .diff(dayjs.utc(orderTimestamp), "second", true);
    }

    // If stop loss was hit, mark it
    if (stopLossHit) {
      result.stopLossHit = true;
      result.timeToStopLossMinutes =
        stopLossTimeDiffSeconds < 30 ? 0 : Math.round(stopLossTimeDiffSeconds / 60);
      result.stopLossTimestamp = stopLossTimestamp!;

      // If stop loss was hit first, we exited, so target is not achieved
      if (targetTimestamp !== null && stopLossTimeDiffSeconds < targetTimeDiffSeconds) {
        result.targetAchieved = false;
        const maxGainPercentage =
          ((bestPrice - entryPriceAtPlacement) / entryPriceAtPlacement) * 100;
        result.targetGainPercentageActual = Number(maxGainPercentage.toFixed(2));
      } else if (targetTimestamp !== null && targetTimeDiffSeconds < stopLossTimeDiffSeconds) {
        // Take profit was hit first, so we exited at take profit (target achieved)
        result.targetAchieved = true;
        result.timeToTargetMinutes =
          targetTimeDiffSeconds < 30 ? 0 : Math.round(targetTimeDiffSeconds / 60);
        result.targetTimestamp = targetTimestamp;
      } else {
        // Stop loss hit, but target was never reached
        result.targetAchieved = false;
        const maxGainPercentage =
          ((bestPrice - entryPriceAtPlacement) / entryPriceAtPlacement) * 100;
        result.targetGainPercentageActual = Number(maxGainPercentage.toFixed(2));
      }
    } else {
      // Stop loss was not hit
      result.stopLossHit = false;

      // Handle target achievement if stop loss was not hit
      if (targetTimestamp !== null && targetTimeDiffSeconds >= 1) {
        result.targetAchieved = true;
        result.timeToTargetMinutes =
          targetTimeDiffSeconds < 30 ? 0 : Math.round(targetTimeDiffSeconds / 60);
        result.targetTimestamp = targetTimestamp;
      } else {
        // Target was not achieved
        result.targetAchieved = false;
        const maxGainPercentage =
          ((bestPrice - entryPriceAtPlacement) / entryPriceAtPlacement) * 100;
        result.targetGainPercentageActual = Number(maxGainPercentage.toFixed(2));
      }
    }

    return result;
  } catch (error) {
    // Return empty metrics on error
    return {};
  }
}

const runsRoutes: FastifyPluginAsync = async (fastify) => {
  const redisManager = RedisManager.getInstance(fastify);
  const tokenManager = new TokenManager(redisManager.redis, fastify);
  const growwAPIRequest = makeGrowwAPIRequest(fastify, tokenManager);

  // ==================== GET /runs ====================
  fastify.get("/", async (request, reply) => {
    try {
      // Fetch runs with order count for the authenticated developer
      const runs = await prisma.run.findMany({
        where: {
          developerId: request.developer?.id,
        },
        include: {
          _count: {
            select: { orders: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Group runs by creation date (createdAt date)
      const groupedRuns: Record<
        string,
        Array<{
          id: string;
          start_datetime: string;
          end_datetime: string;
          completed: boolean;
          orderCount: number;
          name: string | null;
          tags: string[];
        }>
      > = {};

      for (const run of runs) {
        const dateKey = dayjs.utc(run.createdAt).format("YYYY-MM-DD");
        if (!groupedRuns[dateKey]) {
          groupedRuns[dateKey] = [];
        }
        groupedRuns[dateKey].push({
          id: run.id,
          start_datetime: formatDateTime(run.startTime),
          end_datetime: formatDateTime(run.endTime),
          completed: run.completed,
          orderCount: run._count.orders,
          name: run.name,
          tags: run.tags,
        });
      }

      // Sort dates descending (newest first)
      const sortedDates = Object.keys(groupedRuns).sort((a, b) => {
        return dayjs.utc(b).valueOf() - dayjs.utc(a).valueOf();
      });

      // Create final grouped object with sorted dates
      const sortedGroupedRuns: Record<
        string,
        Array<{
          id: string;
          start_datetime: string;
          end_datetime: string;
          completed: boolean;
          orderCount: number;
          name: string | null;
          tags: string[];
        }>
      > = {};
      for (const date of sortedDates) {
        sortedGroupedRuns[date] = groupedRuns[date];
      }

      return sendResponse<
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.getRuns.response>
      >(reply, {
        statusCode: 200,
        message: "Runs fetched successfully",
        data: sortedGroupedRuns,
      });
    } catch (error) {
      fastify.log.error("Error fetching runs: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to fetch runs. Please check server logs for more details."
      );
    }
  });

  // ==================== GET /runs/tags ====================

  fastify.get("/tags", async (request, reply) => {
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
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunTags.response>
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
      // Convert datetime strings to UTC Date objects
      const startTimeUTC = parseDateTimeInTimezone(
        validationResult.start_datetime,
        validationResult.timezone ?? "Asia/Kolkata"
      );
      const endTimeUTC = parseDateTimeInTimezone(
        validationResult.end_datetime,
        validationResult.timezone ?? "Asia/Kolkata"
      );

      if (!request.developer) {
        return reply.unauthorized("Developer not found or invalid token");
      }

      // Validate and process tags
      let processedTags: string[] = [];
      if (validationResult.tags && validationResult.tags.length > 0) {
        // Remove duplicates and validate each tag
        const tagSet = new Set<string>();
        for (const tag of validationResult.tags) {
          const trimmedTag = tag.trim();
          if (trimmedTag.length === 0) {
            continue; // Skip empty tags
          }
          if (trimmedTag.length > 50) {
            return reply.badRequest(`Tag "${trimmedTag}" exceeds maximum length of 50 characters`);
          }
          // Validate allowed characters: alphanumeric, hyphens, underscores
          if (!/^[a-zA-Z0-9_-]+$/.test(trimmedTag)) {
            return reply.badRequest(
              `Tag "${trimmedTag}" contains invalid characters. Only alphanumeric characters, hyphens, and underscores are allowed.`
            );
          }
          tagSet.add(trimmedTag);
        }
        processedTags = Array.from(tagSet).sort();
        // Limit total number of tags per run
        if (processedTags.length > 10) {
          return reply.badRequest("Maximum of 10 tags allowed per run");
        }
      }

      // Create a new run
      const run = await prisma.run.create({
        data: {
          startTime: startTimeUTC,
          endTime: endTimeUTC,
          name: validationResult.name || null,
          tags: processedTags,
          developer: {
            connect: {
              id: request.developer.id,
            },
          },
        },
      });

      return sendResponse<
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.createRun.response>
      >(reply, {
        statusCode: 201,
        message: "Run created successfully",
        data: {
          id: run.id,
          start_datetime: formatDateTime(run.startTime),
          end_datetime: formatDateTime(run.endTime),
          completed: run.completed,
          name: run.name,
          tags: run.tags,
        },
      });
    } catch (error) {
      fastify.log.error("Error creating run: %s", JSON.stringify(error));
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
      // Verify the run belongs to the authenticated developer
      const run = await prisma.run.findFirst({
        where: {
          id: paramsValidationResult.runId,
          developerId: request.developer?.id,
        },
      });

      if (!run) {
        return reply.notFound("Run not found or access denied");
      }

      // Validate and process tags if provided
      let processedTags: string[] | undefined = undefined;
      if (bodyValidationResult.tags !== undefined) {
        processedTags = [];
        if (bodyValidationResult.tags.length > 0) {
          // Remove duplicates and validate each tag
          const tagSet = new Set<string>();
          for (const tag of bodyValidationResult.tags) {
            const trimmedTag = tag.trim();
            if (trimmedTag.length === 0) {
              continue; // Skip empty tags
            }
            if (trimmedTag.length > 50) {
              return reply.badRequest(
                `Tag "${trimmedTag}" exceeds maximum length of 50 characters`
              );
            }
            // Validate allowed characters: alphanumeric, hyphens, underscores
            if (!/^[a-zA-Z0-9_-]+$/.test(trimmedTag)) {
              return reply.badRequest(
                `Tag "${trimmedTag}" contains invalid characters. Only alphanumeric characters, hyphens, and underscores are allowed.`
              );
            }
            tagSet.add(trimmedTag);
          }
          processedTags = Array.from(tagSet).sort();
          // Limit total number of tags per run
          if (processedTags.length > 10) {
            return reply.badRequest("Maximum of 10 tags allowed per run");
          }
        }
      }

      // Update the run
      const updateData: {
        completed?: boolean;
        name?: string | null;
        tags?: string[];
      } = {};
      if (bodyValidationResult.completed !== undefined) {
        updateData.completed = bodyValidationResult.completed;
      }
      if (bodyValidationResult.name !== undefined) {
        updateData.name = bodyValidationResult.name || null;
      }
      if (processedTags !== undefined) {
        updateData.tags = processedTags;
      }

      const updatedRun = await prisma.run.update({
        where: { id: paramsValidationResult.runId },
        data: updateData,
      });

      return sendResponse<
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.updateRun.response>
      >(reply, {
        statusCode: 200,
        message: "Run updated successfully",
        data: {
          id: updatedRun.id,
          start_datetime: formatDateTime(updatedRun.startTime),
          end_datetime: formatDateTime(updatedRun.endTime),
          completed: updatedRun.completed,
          name: updatedRun.name,
          tags: updatedRun.tags,
        },
      });
    } catch (error) {
      fastify.log.error("Error updating run: %s", JSON.stringify(error));
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
      // Verify the run belongs to the authenticated developer
      const run = await prisma.run.findFirst({
        where: {
          id: validationResult.runId,
          developerId: request.developer?.id,
        },
      });

      if (!run) {
        return reply.notFound("Run not found or access denied");
      }

      // Delete the run
      await prisma.run.delete({
        where: { id: validationResult.runId },
      });

      return sendResponse<
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.deleteRun.response>
      >(reply, {
        statusCode: 200,
        message: "Run deleted successfully",
        data: {
          id: validationResult.runId,
        },
      });
    } catch (error) {
      fastify.log.error("Error deleting run: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to delete run. Please check server logs for more details."
      );
    }
  });

  // ==================== GET /runs/:runId/orders ====================

  fastify.get("/:runId/orders", async (request, reply) => {
    // validation
    const paramsValidationResult = validateRequest(
      request.params,
      reply,
      v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunOrders.params,
      "params"
    );
    if (!paramsValidationResult) {
      return;
    }

    const queryValidationResult = validateRequest(
      request.query,
      reply,
      v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunOrders.query,
      "query"
    );
    if (!queryValidationResult) {
      return;
    }

    try {
      // Verify the run belongs to the authenticated developer
      const run = await prisma.run.findFirst({
        where: {
          id: paramsValidationResult.runId,
          developerId: request.developer?.id,
        },
      });

      if (!run) {
        return reply.notFound("Run not found or access denied");
      }

      // Fetch orders for the run
      const orders = await prisma.order.findMany({
        where: {
          runId: paramsValidationResult.runId,
        },
        orderBy: {
          timestamp: "asc",
        },
      });

      // Calculate gain metrics for each order
      const ordersWithMetrics = await Promise.all(
        orders.map(async (order) => {
          const gainMetrics = await calculateOrderGainMetrics({
            nseSymbol: order.nseSymbol,
            entryPrice: Number(order.entryPrice),
            stopLossPrice: Number(order.stopLossPrice),
            orderTimestamp: order.timestamp,
            targetGainPercentage: queryValidationResult.targetGainPercentage,
            growwAPIRequest,
          });

          const orderWithMetrics: OrderWithMetrics = {
            id: order.id,
            nseSymbol: order.nseSymbol,
            entryPrice: Number(order.entryPrice),
            stopLossPrice: Number(order.stopLossPrice),
            takeProfitPrice: Number(order.takeProfitPrice),
            timestamp: formatDateTime(order.timestamp),
            runId: order.runId,
            dynamicTakeProfitPrice: gainMetrics.dynamicTakeProfitPrice,
            targetAchieved: gainMetrics.targetAchieved,
            targetGainPercentage: gainMetrics.targetGainPercentage,
            targetGainPercentageActual: gainMetrics.targetGainPercentageActual,
            timeToTargetMinutes: gainMetrics.timeToTargetMinutes,
            targetTimestamp: gainMetrics.targetTimestamp
              ? formatDateTime(gainMetrics.targetTimestamp)
              : undefined,
            stopLossHit: gainMetrics.stopLossHit,
            stopLossTimestamp: gainMetrics.stopLossTimestamp
              ? formatDateTime(gainMetrics.stopLossTimestamp)
              : undefined,
            timeToStopLossMinutes: gainMetrics.timeToStopLossMinutes,
          };

          return orderWithMetrics;
        })
      );

      return sendResponse<
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunOrders.response>
      >(reply, {
        statusCode: 200,
        message: "Orders fetched successfully",
        data: ordersWithMetrics,
      });
    } catch (error) {
      fastify.log.error("Error fetching orders: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to fetch orders. Please check server logs for more details."
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
      // Convert timestamp string to UTC Date object
      const datetimeUTC = parseDateTimeInTimezone(
        bodyValidationResult.datetime,
        bodyValidationResult.timezone ?? "Asia/Kolkata"
      );

      // Verify the run belongs to the authenticated developer
      const run = await prisma.run.findFirst({
        where: {
          id: paramsValidationResult.runId,
          developerId: request.developer?.id,
        },
      });

      if (!run) {
        return reply.notFound("Run not found or access denied");
      }

      // Create the order
      const order = await prisma.order.create({
        data: {
          nseSymbol: bodyValidationResult.nseSymbol,
          entryPrice: new Decimal(bodyValidationResult.entryPrice),
          stopLossPrice: new Decimal(bodyValidationResult.stopLossPrice),
          takeProfitPrice: new Decimal(bodyValidationResult.takeProfitPrice),
          timestamp: datetimeUTC,
          run: {
            connect: {
              id: paramsValidationResult.runId,
            },
          },
        },
      });

      return sendResponse<
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.createOrder.response>
      >(reply, {
        statusCode: 201,
        message: "Order created successfully",
        data: {
          id: order.id,
          nseSymbol: order.nseSymbol,
          entryPrice: Number(order.entryPrice),
          stopLossPrice: Number(order.stopLossPrice),
          takeProfitPrice: Number(order.takeProfitPrice),
          datetime: formatDateTime(order.timestamp),
          runId: order.runId,
        },
      });
    } catch (error) {
      fastify.log.error("Error creating order: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to create order. Please check server logs for more details."
      );
    }
  });
};

export default runsRoutes;
