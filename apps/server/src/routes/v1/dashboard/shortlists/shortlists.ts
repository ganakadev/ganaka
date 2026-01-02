import { ShortlistType } from "@ganaka/db";
import { growwQuoteSchema, shortlistEntrySchema, v1_dashboard_schemas } from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { prisma } from "../../../../utils/prisma";
import { sendResponse } from "../../../../utils/sendResponse";
import { parseDateTimeInTimezone } from "../../../../utils/timezone";
import { validateRequest } from "../../../../utils/validator";
import { formatDateTime } from "../../../../utils/date-formatter";

dayjs.extend(utc);
dayjs.extend(timezone);

const shortlistsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    try {
      const {
        datetime: dateTimeParam,
        timezone: timezoneParam,
        type: typeParam,
      } = validationResult;

      // Convert datetime string to UTC Date
      const selectedDateTimeUTC = parseDateTimeInTimezone(dateTimeParam, timezoneParam);

      const shortlists = await prisma.shortlistSnapshot.findMany({
        where: {
          timestamp: {
            gte: selectedDateTimeUTC,
            lte: new Date(selectedDateTimeUTC.getTime() + 1000), // Add 1 second
          },
          shortlistType: typeParam as ShortlistType,
        },
      });
      const quoteSnapshots = await prisma.quoteSnapshot.findMany({
        where: {
          timestamp: {
            gte: selectedDateTimeUTC,
            lte: new Date(selectedDateTimeUTC.getTime() + 60000), // Add 1 minute
          },
        },
      });

      if (shortlists.length === 0) {
        return sendResponse<
          z.infer<
            typeof v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.response
          >
        >(reply, {
          statusCode: 200,
          message: "Shortlist fetched successfully",
          data: {
            shortlist: null,
          },
        });
      }

      const shortlistFromDb = shortlists[0];
      const shortlistEntries = shortlistFromDb.entries as
        | z.infer<typeof shortlistEntrySchema>[]
        | null;
      let entries: Array<z.infer<typeof shortlistEntrySchema>> = [];

      if (shortlistEntries) {
        entries = shortlistEntries.flatMap((entry) => {
          const quoteSnapshot = quoteSnapshots.find(
            (quoteSnapshot) => quoteSnapshot.nseSymbol === entry.nseSymbol
          );
          const quoteData = quoteSnapshot?.quoteData;

          if (quoteData) {
            const data: NonNullable<
              z.infer<
                typeof v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.response
              >["data"]["shortlist"]
            >["entries"][number] = {
              nseSymbol: entry.nseSymbol,
              name: entry.name,
              price: entry.price,
              quoteData: quoteData as unknown as z.infer<typeof growwQuoteSchema>,
            };

            return data;
          }

          return [];
        });
      }

      return sendResponse<
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.response>
      >(reply, {
        statusCode: 200,
        message: "Shortlist fetched successfully",
        data: {
          shortlist: {
            id: shortlistFromDb.id,
            timestamp: formatDateTime(shortlistFromDb.timestamp),
            shortlistType: shortlistFromDb.shortlistType,
            entries,
          },
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching shortlists: %s", JSON.stringify(error));
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch shortlists";
      return reply.internalServerError(errorMessage);
    }
  });
};

export default shortlistsRoutes;
