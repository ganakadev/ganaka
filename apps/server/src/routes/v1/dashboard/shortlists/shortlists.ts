import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { sendResponse } from "../../../../utils/sendResponse";
import { validateRequest } from "../../../../utils/validator";
import { growwQuotePayloadSchema, growwQuoteSchema, v1_dashboard_schemas } from "@ganaka/schemas";
import { ShortlistType } from "@ganaka/db";
import { shortlistEntrySchema } from "@ganaka/schemas";
import {
  BuyerControlMethod,
  QuoteData as BuyerControlQuoteData,
  calculateBuyerControlPercentage,
  isQuoteData,
} from "../../../../utils/buyerControl";
import { prisma } from "../../../../utils/prisma";
import { parseDateTimeInTimezone } from "../../../../utils/timezone";

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
        datetime: dateParam,
        timezone = "Asia/Kolkata",
        type: typeParam,
        method: methodParam,
      } = validationResult;

      // Convert datetime string to UTC Date
      const selectedDateTime = parseDateTimeInTimezone(dateParam, timezone);

      // Set method to provided value or default to "hybrid"
      const method: BuyerControlMethod = methodParam || "hybrid";

      const shortlists = await prisma.shortlistSnapshot.findMany({
        where: {
          timestamp: {
            gte: selectedDateTime,
            lte: new Date(selectedDateTime.getTime() + 1000), // Add 1 second
          },
          shortlistType: typeParam as ShortlistType,
        },
      });
      const quoteSnapshots = await prisma.quoteSnapshot.findMany({
        where: {
          timestamp: {
            gte: selectedDateTime,
            lte: new Date(selectedDateTime.getTime() + 60000), // Add 1 minute
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
            timestamp: `${shortlistFromDb.timestamp.toISOString()}`,
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
