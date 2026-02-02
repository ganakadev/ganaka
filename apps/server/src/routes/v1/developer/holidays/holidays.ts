import { FastifyPluginAsync } from "fastify";
import { sendResponse } from "../../../../utils/sendResponse";
import { v1_developer_holidays_schemas } from "@ganaka/schemas";
import { prisma } from "../../../../utils/prisma";
import z from "zod";
import { formatDate } from "../../../../utils/date-formatter";

const holidaysRoutes: FastifyPluginAsync = async (fastify) => {
  // ==================== GET /v1/developer/holidays ====================
  fastify.get("/", async (_, reply) => {
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

      return sendResponse<z.infer<typeof v1_developer_holidays_schemas.getHolidays.response>>(
        reply,
        {
          statusCode: 200,
          message: "Holidays fetched successfully",
          data: {
            holidays: formattedHolidays,
          },
        }
      );
    } catch (error) {
      fastify.log.error("Error fetching holidays: %s", JSON.stringify(error));
      return reply.internalServerError(
        "Failed to fetch holidays. Please check server logs for more details."
      );
    }
  });
};

export default holidaysRoutes;
