import { ShortlistSnapshot } from "@ganaka/db";
import { ShortlistScope, ShortlistType } from "@ganaka/db/prisma";
import { growwQuoteSchema, shortlistItemSchema, v1_schemas } from "@ganaka/schemas";
import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { isEmpty, shuffle } from "lodash";
import z from "zod";
import { validateCurrentTimestamp } from "../../../utils/current-timestamp-validator";
import { formatDateTime } from "../../../utils/date-formatter";
import { makeGrowwAPIRequest } from "../../../utils/groww-api-request";
import { prisma } from "../../../utils/prisma";
import { RedisManager } from "../../../utils/redis";
import { sendResponse } from "../../../utils/sendResponse";
import { parseDateTimeInTimezone } from "../../../utils/timezone";
import { TokenManager } from "../../../utils/token-manager";
import { validateRequest } from "../../../utils/validator";

dayjs.extend(utc);
dayjs.extend(timezone);

const MAX_LIST_FETCH_RETRIES = 3;

/**
 * Maps API type format to database enum format
 */
function mapTypeToShortlistType(
  type: z.infer<typeof v1_schemas.v1_shortlists_schemas.getShortlistPersistence.query>["type"]
): ShortlistType {
  switch (type) {
    case "TOP_GAINERS":
      return ShortlistType.TOP_GAINERS;
    case "VOLUME_SHOCKERS":
      return ShortlistType.VOLUME_SHOCKERS;
    default:
      throw new Error(`Unknown shortlist type: ${type}`);
  }
}

/**
 * Finds all instruments that appeared in any snapshot between start and end datetime,
 * ordered by total number of appearances (descending)
 */
function findPersistentInstruments(
  snapshots: Array<ShortlistSnapshot>,
  totalSnapshots: number
): Array<{
  nseSymbol: string;
  name: string;
  appearanceCount: number;
  totalSnapshots: number;
  percentage: number;
}> {
  if (totalSnapshots === 0) {
    return [];
  }

  // Filter to only non-empty snapshots
  const nonEmptySnapshots = snapshots.filter((snapshot) => {
    const entries = snapshot.entries as z.infer<typeof shortlistItemSchema>[] | null;
    return entries && entries.length > 0;
  });

  // Track which symbols appear in each snapshot
  const symbolAppearances = new Map<string, number>();
  const symbolToNameMap = new Map<string, string>();

  for (let i = 0; i < nonEmptySnapshots.length; i++) {
    const snapshot = nonEmptySnapshots[i];
    const entries = snapshot.entries as z.infer<typeof shortlistItemSchema>[] | null;

    if (!entries || entries.length === 0) {
      continue;
    }

    const seenInThisSnapshot = new Set<string>();
    for (const entry of entries) {
      // Only count each symbol once per snapshot
      if (!seenInThisSnapshot.has(entry.nseSymbol)) {
        symbolAppearances.set(entry.nseSymbol, (symbolAppearances.get(entry.nseSymbol) || 0) + 1);
        seenInThisSnapshot.add(entry.nseSymbol);
      }
      // Store name from first occurrence
      if (!symbolToNameMap.has(entry.nseSymbol)) {
        symbolToNameMap.set(entry.nseSymbol, entry.name);
      }
    }
  }

  // Filter to only symbols that appear in ALL non-empty snapshots
  const persistentInstruments: Array<{
    nseSymbol: string;
    name: string;
    appearanceCount: number;
    totalSnapshots: number;
    percentage: number;
  }> = [];

  for (const [symbol, appearanceCount] of symbolAppearances.entries()) {
    // Only include if present in all snapshots
    const percentage = (appearanceCount / totalSnapshots) * 100;
    persistentInstruments.push({
      nseSymbol: symbol,
      name: symbolToNameMap.get(symbol) || symbol,
      appearanceCount,
      totalSnapshots,
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
    });
  }

  // Sort by appearanceCount descending (most appearances first)
  persistentInstruments.sort((a, b) => b.appearanceCount - a.appearanceCount);

  return persistentInstruments;
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

const shortlistsRoutes: FastifyPluginAsync = async (fastify) => {
  const redisManager = RedisManager.getInstance(fastify);
  const tokenManager = new TokenManager(redisManager.redis, fastify);
  const growwAPIRequest = makeGrowwAPIRequest(fastify, tokenManager);

  // ==================== GET /v1/shortlists ====================
  fastify.get("/", async (request, reply) => {
    try {
      // Check if trade metrics parameters were explicitly provided in the query
      const rawQuery = request.query as Record<string, unknown>;
      const shouldCalculateMetrics =
        rawQuery.takeProfitPercentage !== undefined && rawQuery.stopLossPercentage !== undefined;

      const validationResult = validateRequest(
        request.query,
        reply,
        v1_schemas.v1_shortlists_schemas.getShortlists.query,
        "query"
      );
      if (!validationResult) {
        return;
      }

      const {
        datetime: dateTimeParam,
        timezone: timezoneParam,
        type: typeParam,
        scope: scopeParam,
      } = validationResult;

      // Convert datetime string to UTC Date
      const selectedDateTimeUTC = parseDateTimeInTimezone(dateTimeParam, timezoneParam);
      const scope = (scopeParam ?? "TOP_5") as ShortlistScope;

      const shortlists = await prisma.shortlistSnapshot.findMany({
        where: {
          timestamp: {
            gte: selectedDateTimeUTC,
            lte: dayjs.utc(selectedDateTimeUTC).add(1, "second").toDate(), // Add 1 second
          },
          shortlistType: typeParam as ShortlistType,
          scope: scope,
        },
      });

      if (shortlists.length === 0) {
        return sendResponse<
          z.infer<typeof v1_schemas.v1_shortlists_schemas.getShortlists.response>
        >(reply, {
          statusCode: 200,
          message: "Shortlist snapshot not found",
          data: null,
        });
      }

      const shortlistFromDb = shortlists[0];
      const shortlistEntries = shortlistFromDb.entries as
        | z.infer<typeof shortlistItemSchema>[]
        | null;
      let entries: Array<z.infer<typeof shortlistItemSchema>> = [];

      if (shortlistEntries) {
        // Process entries with trade metrics in parallel
        entries = shortlistEntries.flatMap((entry) => {
          const data: NonNullable<
            z.infer<typeof v1_schemas.v1_shortlists_schemas.getShortlists.response>["data"]
          >[number] = {
            nseSymbol: entry.nseSymbol,
            name: entry.name,
            price: entry.price,
          };

          return data;
        });
      }

      return sendResponse<z.infer<typeof v1_schemas.v1_shortlists_schemas.getShortlists.response>>(
        reply,
        {
          statusCode: 200,
          message: "Shortlist fetched successfully",
          data: entries,
        }
      );
    } catch (error) {
      fastify.log.error("Error fetching shortlists: %s", JSON.stringify(error));
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch shortlists";
      return reply.internalServerError(errorMessage);
    }
  });
  // ==================== POST /v1/shortlists ====================
  fastify.post("/", async (request, reply) => {
    const validationResult = validateRequest(
      request.body,
      reply,
      v1_schemas.v1_shortlists_schemas.createShortlistSnapshot.body,
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
  // ==================== GET /v1/shortlists/scrap ====================
  fastify.get("/scrap", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_schemas.v1_shortlists_schemas.getListsScrap.query,
      "query"
    );
    if (!validationResult) {
      return;
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
      validationResult.type === "VOLUME_SHOCKERS"
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

        return sendResponse<
          z.infer<typeof v1_schemas.v1_shortlists_schemas.getListsScrap.response>
        >(reply, {
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

    return sendResponse<z.infer<typeof v1_schemas.v1_shortlists_schemas.getListsScrap.response>>(
      reply,
      {
        statusCode: 200,
        message: "Lists unable to be fetched. Please check server logs for more details.",
        data: [],
      }
    );
  });
  // ==================== GET /v1/shortlists/persistence ====================
  fastify.get("/persistence", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_schemas.v1_shortlists_schemas.getShortlistPersistence.query,
      "query"
    );
    if (!validationResult) {
      return;
    }

    try {
      const shortlistType = mapTypeToShortlistType(validationResult.type);
      const timezone = validationResult.timezone || "Asia/Kolkata";
      const scope = (validationResult.scope ?? "TOP_5") as ShortlistScope;

      // Parse datetime strings to UTC Date objects
      const startDateTime = parseDateTimeInTimezone(validationResult.start_datetime, timezone);
      const endDateTime = parseDateTimeInTimezone(validationResult.end_datetime, timezone);

      // Validate that start_datetime <= end_datetime
      if (startDateTime > endDateTime) {
        return reply.badRequest("start_datetime must be less than or equal to end_datetime");
      }

      // Validate against currentTimestamp if present
      if (request.currentTimestamp) {
        try {
          validateCurrentTimestamp(request.currentTimestamp, [startDateTime, endDateTime], reply);
        } catch (error) {
          // Error already sent via reply in validator
          return;
        }
      }

      // Fetch all snapshots for the requested list type in the time range
      const snapshots = await prisma.shortlistSnapshot.findMany({
        where: {
          timestamp: {
            gte: startDateTime,
            lte: endDateTime,
          },
          shortlistType: shortlistType,
          scope: scope,
        },
        orderBy: {
          timestamp: "asc",
        },
      });

      // Count non-empty snapshots (empty snapshots don't count towards persistence)
      const nonEmptySnapshots = snapshots.filter((snapshot) => {
        const entries = snapshot.entries as z.infer<typeof shortlistItemSchema>[] | null;
        return entries && entries.length > 0;
      });
      const totalNonEmptySnapshots = nonEmptySnapshots.length;

      // Find all instruments that appeared in any snapshot, ordered by appearance count
      const instruments = findPersistentInstruments(snapshots, totalNonEmptySnapshots);

      return sendResponse<
        z.infer<typeof v1_schemas.v1_shortlists_schemas.getShortlistPersistence.response>
      >(reply, {
        statusCode: 200,
        message: "Shortlist persistence fetched successfully",
        data: {
          start_datetime: formatDateTime(startDateTime),
          end_datetime: formatDateTime(endDateTime),
          type: validationResult.type,
          totalSnapshots: totalNonEmptySnapshots,
          instruments,
        },
      });
    } catch (error) {
      fastify.log.error("Error fetching shortlist persistence: %s", JSON.stringify(error));
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch shortlist persistence";
      return reply.internalServerError(errorMessage);
    }
  });
};

export default shortlistsRoutes;
