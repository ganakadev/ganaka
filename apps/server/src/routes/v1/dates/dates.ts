import { v1_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { formatDate, formatDateTime } from "../../../utils/date-formatter";
import { prisma } from "../../../utils/prisma";
import { roleBasedExecute } from "../../../utils/roleBasedExecute";
import { sendResponse } from "../../../utils/sendResponse";
import { validateRequest } from "../../../utils/validator";

dayjs.extend(utc);
dayjs.extend(timezone);

const datesRoutes: FastifyPluginAsync = async (fastify) => {
  // ==================== GET /v1/dates ====================
  fastify.get("/", async (request, reply) => {
    try {
      return await roleBasedExecute({
        request,
        reply,
        roles: {
          admin: async () => {
            // Get all shortlist snapshots to count records per date
            const shortlistSnapshots = await prisma.shortlistSnapshot.findMany({
              select: {
                timestamp: true,
              },
              orderBy: {
                timestamp: "asc",
              },
            });

            // Group by date and count records
            const dateMap = new Map<string, { shortlistCount: number }>();

            // Process shortlists
            shortlistSnapshots.forEach((snapshot) => {
              const dateKey = formatDate(snapshot.timestamp);
              if (!dateMap.has(dateKey)) {
                dateMap.set(dateKey, {
                  shortlistCount: 0,
                });
              }
              const dateData = dateMap.get(dateKey)!;
              dateData.shortlistCount += 1;
            });

            // Convert to response format
            const dates = Array.from(dateMap.entries())
              .map(([date, counts]) => ({
                date,
                shortlistCount: counts.shortlistCount,
              }))
              .sort((a, b) => a.date.localeCompare(b.date));

            return sendResponse<
              z.infer<typeof v1_schemas.v1_dates_schemas.getAvailableDatesAdmin.response>
            >(reply, {
              statusCode: 200,
              message: "Available dates fetched successfully",
              data: {
                dates,
              },
            });
          },
          developer: async () => {
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
              z.infer<typeof v1_schemas.v1_dates_schemas.getAvailableDatetimes.response>
            >(reply, {
              statusCode: 200,
              message: "Available datetimes fetched successfully",
              data: {
                dates,
              },
            });
          },
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching available dates: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to fetch available dates. Please check server logs for more details."
      );
    }
  });

  // ==================== DELETE /v1/dates ====================
  fastify.delete("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.body,
      reply,
      v1_schemas.v1_dates_schemas.deleteDates.body,
      "body"
    );
    if (!validationResult) {
      return;
    }

    try {
      return await roleBasedExecute({
        request,
        reply,
        roles: {
          admin: async () => {
            // Parse dates and convert to Date objects (start and end of day in UTC)
            const dateRanges = validationResult.dates.map((dateStr) => {
              const startOfDay = dayjs.utc(dateStr).startOf("day").toDate();
              const endOfDay = dayjs.utc(dateStr).endOf("day").toDate();
              return { startOfDay, endOfDay };
            });

            // Use transaction to ensure atomicity
            const result = await prisma.$transaction(async (tx) => {
              let shortlistCount = 0;

              // Delete shortlists
              for (const range of dateRanges) {
                const deleted = await tx.shortlistSnapshot.deleteMany({
                  where: {
                    timestamp: {
                      gte: range.startOfDay,
                      lte: range.endOfDay,
                    },
                  },
                });
                shortlistCount += deleted.count;
              }

              return {
                shortlists: shortlistCount,
              };
            });

            return sendResponse<z.infer<typeof v1_schemas.v1_dates_schemas.deleteDates.response>>(
              reply,
              {
                statusCode: 200,
                message: "Data deleted successfully",
                data: {
                  deleted: result,
                },
              }
            );
          },
        },
      });
    } catch (error) {
      fastify.log.error("Error deleting data: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to delete data. Please check server logs for more details."
      );
    }
  });
};

export default datesRoutes;
