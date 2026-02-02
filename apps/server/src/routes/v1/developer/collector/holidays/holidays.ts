import { v1_developer_collector_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import { prisma } from "../../../../../utils/prisma";
import { sendResponse } from "../../../../../utils/sendResponse";
import { validateRequest } from "../../../../../utils/validator";

dayjs.extend(utc);
dayjs.extend(timezone);

const holidaysRoutes: FastifyPluginAsync = async (fastify) => {
  // ==================== GET /v1/developer/collector/holidays/check ====================
  fastify.get("/check", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_developer_collector_schemas.checkHoliday.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    try {
      // Parse the date from query parameter and convert to UTC Date range
      const dateStr = validationResult.date;
      const dateStart = dayjs.utc(dateStr).startOf("day").toDate();
      const dateEnd = dayjs.utc(dateStr).endOf("day").toDate();

      // Check if the provided date is a holiday
      const holiday = await prisma.nseHoliday.findFirst({
        where: {
          date: {
            gte: dateStart,
            lte: dateEnd,
          },
        },
      });

      return sendResponse(reply, {
        statusCode: 200,
        message: "Holiday check completed",
        data: {
          isHoliday: !!holiday,
          date: dateStr,
        },
      });
    } catch (error) {
      fastify.log.error("Error checking holiday: %s", JSON.stringify(error));
      const errorMessage = error instanceof Error ? error.message : "Failed to check holiday";
      return reply.internalServerError(errorMessage);
    }
  });
};

export default holidaysRoutes;
