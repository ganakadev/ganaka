import { ShortlistScope, ShortlistType } from "@ganaka/db/prisma";
import { Decimal } from "@ganaka/db/prisma";
import { v1_developer_collector_schemas, v1_developer_lists_schemas } from "@ganaka/schemas";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { isEmpty, shuffle } from "lodash";
import z from "zod";
import { validateCurrentTimestamp } from "../../../../utils/current-timestamp-validator";
import { formatDateTime } from "../../../../utils/date-formatter";
import { prisma } from "../../../../utils/prisma";
import { sendResponse } from "../../../../utils/sendResponse";
import { parseDateTimeInTimezone } from "../../../../utils/timezone";
import { validateRequest } from "../../../../utils/validator";

dayjs.extend(utc);
dayjs.extend(timezone);

const MAX_LIST_FETCH_RETRIES = 3;

/**
 * Maps API type format to database enum format
 */
function mapTypeToShortlistType(type: "top-gainers" | "volume-shockers"): ShortlistType {
  switch (type) {
    case "top-gainers":
      return ShortlistType.TOP_GAINERS;
    case "volume-shockers":
      return ShortlistType.VOLUME_SHOCKERS;
    default:
      throw new Error(`Unknown shortlist type: ${type}`);
  }
}

const getProxyList = async (fastify: FastifyInstance) => {
  try {
    const response = (await axios.get("https://proxy.webshare.io/api/v2/proxy/list", {
      params: {
        page: 1,
        page_size: 5,
        mode: "direct",
      },
      headers: {
        Authorization: `Token ${process.env.WEBSHARE_API_KEY}`,
      },
    })) as AxiosResponse<{
      count: number;
      next: string | null;
      previous: string | null;
      results: {
        id: string;
        username: string;
        password: string;
        proxy_address: string;
        port: number;
        valid: boolean;
        last_verification: string;
        country_code: string;
        city_name: string;
        asn_name: string;
        asn_number: number;
        high_country_confidence: boolean;
        created_at: string;
      }[];
    }>;

    return response.data?.results?.flatMap((proxy) => {
      if (proxy.valid) {
        return {
          host: proxy.proxy_address,
          port: proxy.port,
          username: proxy.username,
          password: proxy.password,
        };
      }
      return [];
    });
  } catch (error) {
    fastify.log.error("Error getting proxy list: %s", JSON.stringify(error));
    return [];
  }
};

const collectorRoutes: FastifyPluginAsync = async (fastify) => {
  // ==================== POST /v1/developer/collector/lists ====================
  fastify.post("/lists", async (request, reply) => {
    const validationResult = validateRequest(
      request.body,
      reply,
      v1_developer_collector_schemas.createShortlistSnapshot.body,
      "body"
    );
    if (!validationResult) {
      return;
    }

    try {
      // Convert datetime string to UTC Date
      const timestamp = parseDateTimeInTimezone(
        validationResult.data.timestamp,
        validationResult.data.timezone
      );

      // Store shortlist in database
      const shortlistSnapshot = await prisma.shortlistSnapshot.create({
        data: {
          timestamp,
          shortlistType: validationResult.data.shortlistType as ShortlistType,
          entries: validationResult.data.entries as any, // JSON data
          scope: (validationResult.data.scope ?? "TOP_5") as ShortlistScope,
        },
      });

      return sendResponse(reply, {
        statusCode: 201,
        message: "Shortlist snapshot created successfully",
        data: {
          id: shortlistSnapshot.id,
          timestamp: formatDateTime(shortlistSnapshot.timestamp),
          shortlistType: shortlistSnapshot.shortlistType,
          entriesCount: validationResult.data.entries.length,
        },
      });
    } catch (error) {
      fastify.log.error("Error creating shortlist snapshot: %s", JSON.stringify(error));
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create shortlist snapshot";
      return reply.internalServerError(errorMessage);
    }
  });

  // ==================== POST /v1/developer/collector/quotes ====================
  fastify.post("/quotes", async (request, reply) => {
    const validationResult = validateRequest(
      request.body,
      reply,
      v1_developer_collector_schemas.createQuoteSnapshots.body,
      "body"
    );
    if (!validationResult) {
      return;
    }

    try {
      // Convert datetime string to UTC Date
      const timestamp = parseDateTimeInTimezone(
        validationResult.data.timestamp,
        validationResult.data.timezone
      );

      // Prepare quote snapshot data array
      const quoteData = validationResult.data.quotes.map((quote) => ({
        timestamp,
        nseSymbol: quote.nseSymbol,
        quoteData: quote.quoteData as any, // JSON data
      }));

      // Store quote snapshots in database
      const createdQuotes = await prisma.quoteSnapshot.createMany({
        data: quoteData,
      });

      return sendResponse(reply, {
        statusCode: 201,
        message: "Quote snapshots created successfully",
        data: {
          count: createdQuotes.count,
          timestamp: formatDateTime(timestamp),
        },
      });
    } catch (error) {
      fastify.log.error("Error creating quote snapshots: %s", JSON.stringify(error));
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create quote snapshots";
      return reply.internalServerError(errorMessage);
    }
  });

  // ==================== POST /v1/developer/collector/nifty ====================
  fastify.post("/nifty", async (request, reply) => {
    const validationResult = validateRequest(
      request.body,
      reply,
      v1_developer_collector_schemas.createNiftyQuote.body,
      "body"
    );
    if (!validationResult) {
      return;
    }

    try {
      // Convert datetime string to UTC Date
      const timestamp = parseDateTimeInTimezone(
        validationResult.data.timestamp,
        validationResult.data.timezone
      );

      // Store NIFTY quote in database
      const niftyQuote = await prisma.niftyQuote.create({
        data: {
          timestamp,
          quoteData: validationResult.data.quoteData as any, // JSON data
          dayChangePerc: new Decimal(validationResult.data.dayChangePerc),
        },
      });

      return sendResponse(reply, {
        statusCode: 201,
        message: "NIFTY quote created successfully",
        data: {
          id: niftyQuote.id,
          timestamp: formatDateTime(niftyQuote.timestamp),
          dayChangePerc: Number(niftyQuote.dayChangePerc),
        },
      });
    } catch (error) {
      fastify.log.error("Error creating NIFTY quote: %s", JSON.stringify(error));
      const errorMessage = error instanceof Error ? error.message : "Failed to create NIFTY quote";
      return reply.internalServerError(errorMessage);
    }
  });

  // ==================== GET /v1/developer/collector/lists ====================
  fastify.get("/lists", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_developer_lists_schemas.getLists.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    // If datetime is provided, fetch from snapshot
    if (validationResult.datetime) {
      try {
        const shortlistType = mapTypeToShortlistType(validationResult.type);
        const timezone = validationResult.timezone || "Asia/Kolkata";
        const scope = (validationResult.scope ?? "TOP_5") as ShortlistScope;
        // Convert datetime string to UTC Date object
        const selectedDateTime = parseDateTimeInTimezone(validationResult.datetime, timezone);

        // Validate against currentTimestamp if present
        if (request.currentTimestamp) {
          try {
            validateCurrentTimestamp(request.currentTimestamp, [selectedDateTime], reply);
          } catch (error) {
            // Error already sent via reply in validator
            return;
          }
        }

        const shortlists = await prisma.shortlistSnapshot.findMany({
          where: {
            timestamp: {
              gte: selectedDateTime,
              lte: dayjs.utc(selectedDateTime).add(1, "second").toDate(), // Add 1 second
            },
            shortlistType: shortlistType,
            scope: scope,
          },
        });

        if (shortlists.length === 0) {
          return sendResponse<z.infer<typeof v1_developer_lists_schemas.getLists.response>>(reply, {
            statusCode: 200,
            message: "Shortlist snapshot not found",
            data: null,
          });
        }

        const shortlistFromDb = shortlists[0];
        const entries = shortlistFromDb.entries as Array<{
          nseSymbol: string;
          name: string;
          price: number;
        }> | null;

        if (!entries) {
          return sendResponse<z.infer<typeof v1_developer_lists_schemas.getLists.response>>(reply, {
            statusCode: 200,
            message: "Shortlist snapshot not found",
            data: null,
          });
        }

        return sendResponse<z.infer<typeof v1_developer_lists_schemas.getLists.response>>(reply, {
          statusCode: 200,
          message: "Lists fetched successfully",
          data: entries,
        });
      } catch (error) {
        fastify.log.error(
          `Error fetching shortlist snapshot for ${validationResult.type} at ${
            validationResult.datetime
          }: ${JSON.stringify(error)}`
        );
        return reply.internalServerError(
          "Failed to fetch shortlist snapshot. Please check server logs for more details."
        );
      }
    }

    // If no datetime, fetch live data from Groww
    const proxyList = await getProxyList(fastify);
    const shuffledProxyList =
      proxyList.length > 0
        ? shuffle(proxyList)
        : [
            // setting marker in case proxy list is empty
            {
              host: "127.0.0.1",
              port: 9090,
              username: "ganaka",
              password: "ganaka",
            },
          ];
    const url =
      validationResult.type === "volume-shockers"
        ? `https://groww.in/markets/volume-shockers`
        : `https://groww.in/markets/top-gainers?index=GIDXNIFTYTOTALMCAP`;

    for await (const [tryCount, proxy] of shuffledProxyList.entries()) {
      fastify.log.info(`Trying proxy: ${proxy ? `${proxy.host}:${proxy.port}` : "None"}`);

      try {
        // block to simulate proxy blocking
        // if (tryCount === 0) {
        //   // Fetch the HTML page
        //   throw new AxiosError("Proxy blocked", "429", undefined, undefined, {
        //     status: 429,
        //     config: {
        //       url: url,
        //       headers: {} as AxiosRequestHeaders,
        //       data: undefined,
        //     },
        //     data: undefined,
        //     statusText: "200 OK",
        //     headers: {},
        //   });
        // }

        const response = await axios.get(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            Referer: "https://groww.in/",
            "Accept-Encoding": "gzip, deflate, br",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
          },
          ...(proxy.host !== "127.0.0.1"
            ? {
                proxy: {
                  host: proxy.host,
                  port: proxy.port,
                  auth: {
                    username: proxy.username,
                    password: proxy.password,
                  },
                  protocol: "http",
                },
              }
            : {}),
        });

        // Parse HTML with cheerio to find __NEXT_DATA__ script tag
        const $ = cheerio.load(response.data);
        const nextDataScript = $("#__NEXT_DATA__").html();

        if (!nextDataScript) {
          throw new Error("__NEXT_DATA__ script tag not found");
        }

        // Parse the JSON data
        let nextData: { props: { pageProps: { stocks: any[] } } } | null = null;

        try {
          nextData = JSON.parse(nextDataScript);
        } catch (error) {
          fastify.log.error("Error parsing JSON: %s", JSON.stringify(error));

          if (tryCount < MAX_LIST_FETCH_RETRIES) {
            continue;
          }

          break;
        }

        const stocks = nextData?.props?.pageProps?.stocks ?? [];
        if (stocks.length === 0) {
          if (tryCount < MAX_LIST_FETCH_RETRIES) {
            continue;
          }

          break;
        }

        return sendResponse<z.infer<typeof v1_developer_lists_schemas.getLists.response>>(reply, {
          statusCode: 200,
          message: "Lists fetched successfully",
          data: stocks
            .map((stock: any) => ({
              name: stock.companyName || stock.companyShortName || "",
              price: stock.ltp || 0,
              nseSymbol: stock.nseScriptCode || "",
            }))
            .filter(
              (shortlistItem: { name?: string; nseSymbol?: string; price?: number }) =>
                !isEmpty(shortlistItem.name) && !isEmpty(shortlistItem.nseSymbol)
            ),
        });
      } catch (error) {
        fastify.log.error("Error fetching lists: %s", JSON.stringify(error));

        if (tryCount < MAX_LIST_FETCH_RETRIES) {
          continue;
        }

        break;
      }
    }

    return sendResponse<z.infer<typeof v1_developer_lists_schemas.getLists.response>>(reply, {
      statusCode: 200,
      message: "Lists unable to be fetched. Please check server logs for more details.",
      data: [],
    });
  });
};

export default collectorRoutes;
