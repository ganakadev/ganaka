import { FastifyPluginAsync } from "fastify";
import { validateRequest } from "../../../../utils/validator";
import { v1_admin_schemas } from "@ganaka/schemas";
import { sendResponse } from "../../../../utils/sendResponse";
import { prisma } from "../../../../utils/prisma";
import z from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { formatDate } from "../../../../utils/date-formatter";

dayjs.extend(utc);
dayjs.extend(timezone);

const holidaysRoutes: FastifyPluginAsync = async (fastify) => {
  // ==================== GET /holidays ====================

  fastify.get("/", async (request, reply) => {
    try {
      const holidays = await prisma.nseHoliday.findMany({
        orderBy: {
          date: "asc",
        },
      });

      // Format dates to YYYY-MM-DD
      const formattedHolidays = holidays.map((holiday) => ({
        id: holiday.id,
        date: formatDate(holiday.date),
        createdAt: holiday.createdAt,
        updatedAt: holiday.updatedAt,
      }));

      return sendResponse<
        z.infer<typeof v1_admin_schemas.v1_admin_holidays_schemas.getHolidays.response>
      >(reply, {
        statusCode: 200,
        message: "Holidays fetched successfully",
        data: {
          holidays: formattedHolidays,
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching holidays: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to fetch holidays. Please check server logs for more details."
      );
    }
  });

  // ==================== POST /holidays ====================

  fastify.post("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.body,
      reply,
      v1_admin_schemas.v1_admin_holidays_schemas.addHolidays.body,
      "body"
    );
    if (!validationResult) {
      return;
    }

    try {
      // Parse dates and convert to Date objects (start of day in UTC)
      const dateObjects = validationResult.dates.map((dateStr) => {
        // Parse YYYY-MM-DD and convert to UTC start of day
        return dayjs.utc(dateStr).startOf("day").toDate();
      });

      // Check for duplicates in the input
      const uniqueDates = Array.from(new Set(validationResult.dates));
      if (uniqueDates.length !== validationResult.dates.length) {
        return reply.badRequest("Duplicate dates found in request");
      }

      // Check for existing holidays
      const existingHolidays = await prisma.nseHoliday.findMany({
        where: {
          date: {
            in: dateObjects,
          },
        },
      });

      if (existingHolidays.length > 0) {
        const existingDates = existingHolidays.map((h) => formatDate(h.date));
        return reply.conflict(
          `Holidays already exist for dates: ${existingDates.join(", ")}`
        );
      }

      // Create holidays
      const createdHolidays = await Promise.all(
        dateObjects.map((date) =>
          prisma.nseHoliday.create({
            data: {
              date,
            },
          })
        )
      );

      // Format dates to YYYY-MM-DD
      const formattedHolidays = createdHolidays.map((holiday) => ({
        id: holiday.id,
        date: formatDate(holiday.date),
        createdAt: holiday.createdAt,
        updatedAt: holiday.updatedAt,
      }));

      return sendResponse<
        z.infer<typeof v1_admin_schemas.v1_admin_holidays_schemas.addHolidays.response>
      >(reply, {
        statusCode: 201,
        message: "Holidays added successfully",
        data: {
          holidays: formattedHolidays,
        },
      });
    } catch (error) {
      fastify.log.error("Error adding holidays: %s", JSON.stringify(error));

      // Handle Prisma unique constraint errors
      if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
        return reply.conflict("One or more holidays already exist");
      }

      return reply.internalServerError(
        "Failed to add holidays. Please check server logs for more details."
      );
    }
  });

  // ==================== DELETE /holidays ====================

  fastify.delete("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.body,
      reply,
      v1_admin_schemas.v1_admin_holidays_schemas.removeHolidays.body,
      "body"
    );
    if (!validationResult) {
      return;
    }

    try {
      // Parse dates and convert to Date objects (start of day in UTC)
      const dateObjects = validationResult.dates.map((dateStr) => {
        return dayjs.utc(dateStr).startOf("day").toDate();
      });

      // Check if holidays exist
      const existingHolidays = await prisma.nseHoliday.findMany({
        where: {
          date: {
            in: dateObjects,
          },
        },
      });

      if (existingHolidays.length === 0) {
        return reply.notFound("No holidays found for the specified dates");
      }

      // Delete holidays
      const deleteResult = await prisma.nseHoliday.deleteMany({
        where: {
          date: {
            in: dateObjects,
          },
        },
      });

      // Format deleted dates to YYYY-MM-DD
      const deletedDates = existingHolidays.map((h) => formatDate(h.date));

      return sendResponse<
        z.infer<typeof v1_admin_schemas.v1_admin_holidays_schemas.removeHolidays.response>
      >(reply, {
        statusCode: 200,
        message: "Holidays removed successfully",
        data: {
          deleted: {
            count: deleteResult.count,
            dates: deletedDates,
          },
        },
      });
    } catch (error) {
      fastify.log.error("Error removing holidays: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to remove holidays. Please check server logs for more details."
      );
    }
  });
};

export default holidaysRoutes;
