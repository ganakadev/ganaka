import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { sendResponse } from "../../../../utils/sendResponse";
import { validateRequest } from "../../../../utils/validator";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import { QuoteData, ShortlistEntry, ShortlistType } from "@ganaka/db";
import {
  BuyerControlMethod,
  QuoteData as BuyerControlQuoteData,
  calculateBuyerControlPercentage,
  isQuoteData,
} from "../../../../utils/buyerControl";
import { prisma } from "../../../../utils/prisma";

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
      const { date: dateParam, type: typeParam, method: methodParam } = validationResult;

      // Parse date with explicit UTC handling
      const selectedDateTime = dayjs(dateParam).utc();

      // Set method to provided value or default to "hybrid"
      const method: BuyerControlMethod = methodParam || "hybrid";

      const shortlists = await prisma.shortlistSnapshot.findMany({
        where: {
          timestamp: {
            gte: selectedDateTime.toDate(),
            lte: selectedDateTime.add(1, "s").toDate(),
          },
          shortlistType: typeParam as ShortlistType,
        },
      });
      const quoteSnapshots = await prisma.quoteSnapshot.findMany({
        where: {
          timestamp: {
            gte: selectedDateTime.toDate(),
            lte: selectedDateTime.add(1, "m").toDate(),
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
      const shortlistEntries = shortlistFromDb.entries as ShortlistEntry[] | null;
      let entries: Array<{
        nseSymbol: string;
        name: string;
        price: number;
        quoteData: QuoteData;
        buyerControlPercentage: number;
      }> = [];

      if (shortlistEntries) {
        entries = shortlistEntries.flatMap((entry) => {
          const quoteSnapshot = quoteSnapshots.find(
            (quoteSnapshot) => quoteSnapshot.nseSymbol === entry.nseSymbol
          );
          const quoteData = quoteSnapshot?.quoteData;

          // Calculate buyer control percentage
          let buyerControlPercentage: number = 0;

          // Safely cast quoteData if it's valid
          const validQuoteData: BuyerControlQuoteData | null =
            quoteData && isQuoteData(quoteData) ? quoteData : null;

          // If method is specified, calculate on-the-fly
          // Otherwise, use stored value if available
          if (methodParam !== null && methodParam !== undefined) {
            buyerControlPercentage = calculateBuyerControlPercentage(validQuoteData, method) ?? 0;
          } else {
            // Use stored value from database if available
            buyerControlPercentage =
              calculateBuyerControlPercentage(
                validQuoteData,
                "hybrid" // Default to hybrid if no stored value
              ) ?? 0;
          }

          if (quoteData) {
            const data = {
              nseSymbol: entry.nseSymbol,
              name: entry.name,
              price: entry.price,
              quoteData: quoteData as unknown as QuoteData,
              buyerControlPercentage: buyerControlPercentage,
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
