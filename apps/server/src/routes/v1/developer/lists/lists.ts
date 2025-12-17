import { FastifyPluginAsync } from "fastify";
import { validateRequest } from "../../../../utils/validator";
import { v1_developer_lists_schemas } from "@ganaka/schemas";
import { sendResponse } from "../../../../utils/sendResponse";
import z from "zod";
import * as cheerio from "cheerio";
import axios from "axios";

const listsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_developer_lists_schemas.getLists.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    try {
      const url =
        validationResult.type === "volume-shockers"
          ? `https://groww.in/markets/volume-shockers`
          : `https://groww.in/markets/top-gainers?index=GIDXNIFTYTOTALMCAP`;

      // Fetch the HTML page
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      // Parse HTML with cheerio to find __NEXT_DATA__ script tag
      const $ = cheerio.load(response.data);
      const nextDataScript = $("#__NEXT_DATA__").html();

      if (!nextDataScript) {
        throw new Error("__NEXT_DATA__ script tag not found");
      }

      // Parse the JSON data
      const nextData = JSON.parse(nextDataScript);
      const stocks = nextData?.props?.pageProps?.stocks ?? [];

      return sendResponse<
        z.infer<typeof v1_developer_lists_schemas.getLists.response>
      >({
        statusCode: 200,
        message: "Lists fetched successfully",
        data: stocks
          .map((stock: any) => ({
            name: stock.companyName || stock.companyShortName || "",
            price: stock.ltp || 0,
            nseSymbol: stock.nseScriptCode || "",
          }))
          .filter(
            (shortlistItem: {
              name?: string;
              nseSymbol?: string;
              price?: number;
            }) => shortlistItem.name && shortlistItem.nseSymbol
          ),
      });
    } catch (error) {
      fastify.log.error("Error fetching lists: %s", error);
      return reply.internalServerError(
        "Failed to fetch lists. Please check server logs for more details."
      );
    }
  });
};

export default listsRoutes;
