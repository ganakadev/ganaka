import { ShortlistSnapshot } from "@ganaka/db";
import { ShortlistScope, ShortlistType } from "@ganaka/db/prisma";
import {
  growwQuoteSchema,
  shortlistEntrySchema,
  v1_dashboard_schemas,
  v1_developer_collector_schemas,
  v1_developer_lists_persistence_schemas,
  v1_developer_lists_schemas,
} from "@ganaka/schemas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
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
import axios, { AxiosResponse } from "axios";
import { shuffle, isEmpty } from "lodash";
import * as cheerio from "cheerio";

dayjs.extend(utc);
dayjs.extend(timezone);

const MAX_LIST_FETCH_RETRIES = 3;

/**
 * Calculate trade metrics for a shortlist entry based on historical candle data after shortlist capture.
 * Determines if the instrument would have achieved the specified take profit and stop loss targets
 * when run as a trading strategy from the shortlist datetime onwards.
 */
async function calculateTradeMetrics({
  nseSymbol,
  entryPrice,
  shortlistTimestamp,
  takeProfitPercentage,
  stopLossPercentage,
  growwAPIRequest,
}: {
  nseSymbol: string;
  entryPrice: number;
  shortlistTimestamp: Date;
  takeProfitPercentage: number;
  stopLossPercentage: number;
  growwAPIRequest: <T>({
    method,
    url,
    params,
  }: {
    url: string;
    method: string;
    params?: Record<string, any>;
  }) => Promise<T>;
}): Promise<{
  targetPrice?: number;
  stopLossPrice?: number;
  targetAchieved?: boolean;
  stopLossHit?: boolean;
  timeToTargetMinutes?: number;
  timeToStopLossMinutes?: number;
  targetTimestamp?: string;
  stopLossTimestamp?: string;
}> {
  try {
    // Get the date in IST timezone and set market hours (9:15 AM - 3:30 PM IST)
    const dateStr = dayjs.utc(shortlistTimestamp).tz("Asia/Kolkata").format("YYYY-MM-DD");
    const marketStart = dayjs.tz(`${dateStr} 09:15:00`, "Asia/Kolkata");
    const marketEnd = dayjs.tz(`${dateStr} 15:30:00`, "Asia/Kolkata");

    // Convert to format expected by Groww API: YYYY-MM-DDTHH:mm:ss (no milliseconds, no Z)
    // The API expects times in IST format without timezone suffix
    const start_time = marketStart.format("YYYY-MM-DDTHH:mm:ss");
    const end_time = marketEnd.format("YYYY-MM-DDTHH:mm:ss");

    // Fetch historical candles from Groww API
    const response = await growwAPIRequest<{
      status: "SUCCESS" | "FAILURE";
      payload: {
        candles: Array<[string, number, number, number, number, number, number | null]>;
        closing_price: number | null;
        start_time: string;
        end_time: string;
        interval_in_minutes: number;
      };
    }>({
      method: "get",
      url: `https://api.groww.in/v1/historical/candles`,
      params: {
        candle_interval: "1minute",
        start_time,
        end_time,
        exchange: "NSE",
        segment: "CASH",
        groww_symbol: `NSE-${nseSymbol}`,
      },
    });

    if (
      response.status !== "SUCCESS" ||
      !response.payload?.candles ||
      response.payload.candles.length === 0
    ) {
      return {};
    }

    // Parse candles: [timestamp, open, high, low, close, volume, turnover]
    const candles = response.payload.candles.map((candle) => {
      const [timestamp, open, high, low, close] = candle;
      return {
        // convert to UTC since shortlistTimestamp is in UTC
        timestamp: dayjs.tz(timestamp, "Asia/Kolkata").utc().toDate(),
        open,
        high,
        low,
        close,
      };
    });

    // Use the entry price from shortlist (no need to find it like in orders)
    const entryPriceAtPlacement = entryPrice;

    // Avoid division by zero
    if (!entryPriceAtPlacement || entryPriceAtPlacement === 0) {
      return {};
    }

    const result: {
      targetPrice?: number;
      stopLossPrice?: number;
      targetAchieved?: boolean;
      stopLossHit?: boolean;
      timeToTargetMinutes?: number;
      timeToStopLossMinutes?: number;
      targetTimestamp?: string;
      stopLossTimestamp?: string;
    } = {};

    /**
     * Calculate target and stop loss prices based on entry price
     * Take profit price: entry_price × (1 + take_profit_percentage / 100)
     * Stop loss price: entry_price × (1 - stop_loss_percentage / 100)
     */
    const targetPrice = entryPriceAtPlacement * (1 + takeProfitPercentage / 100);
    const stopLossPrice = entryPriceAtPlacement * (1 - stopLossPercentage / 100);
    result.targetPrice = targetPrice;
    result.stopLossPrice = stopLossPrice;

    let targetTimestamp: Date | null = null;
    let stopLossTimestamp: Date | null = null;
    let bestPrice = entryPriceAtPlacement;

    // Check all candles after shortlist timestamp to see if target or stop loss was reached
    for (const candle of candles) {
      // Only consider candles strictly after shortlist capture (not equal to)
      if (!dayjs.utc(candle.timestamp).isAfter(dayjs.utc(shortlistTimestamp), "minute")) {
        continue;
      }

      // Check for stop loss hit (using candle low price)
      if (candle.low && typeof candle.low === "number" && stopLossTimestamp === null) {
        if (candle.low <= stopLossPrice) {
          stopLossTimestamp = candle.timestamp;
        }
      }

      // Check for take profit hit (using candle high price)
      if (candle.high && typeof candle.high === "number") {
        const highPrice = candle.high;

        // Track best price for calculating actual gain if target not achieved
        if (highPrice > bestPrice) {
          bestPrice = highPrice;
        }

        // Check if target price was reached (only record first occurrence)
        if (targetTimestamp === null && highPrice >= targetPrice) {
          targetTimestamp = candle.timestamp;
        }
      }
    }

    // Determine which happened first: stop loss or take profit
    // If stop loss was hit, we exit immediately, so target cannot be achieved
    // If take profit was hit first, we exit at take profit, so target is achieved
    let stopLossHit = false;
    let stopLossTimeDiffSeconds = Infinity;
    let targetTimeDiffSeconds = Infinity;

    if (stopLossTimestamp !== null) {
      const stopLossTimestampUTC = dayjs.utc(stopLossTimestamp).format("YYYY-MM-DD HH:mm:ss");
      stopLossTimeDiffSeconds = dayjs
        .utc(stopLossTimestampUTC)
        .diff(dayjs.utc(shortlistTimestamp), "second", true);

      // Ensure the timestamp is truly after the shortlist capture (at least 1 second difference)
      if (stopLossTimeDiffSeconds >= 1) {
        stopLossHit = true;
      }
    }

    if (targetTimestamp !== null) {
      const targetTimestampUTC = dayjs.utc(targetTimestamp).format("YYYY-MM-DD HH:mm:ss");
      targetTimeDiffSeconds = dayjs
        .utc(targetTimestampUTC)
        .diff(dayjs.utc(shortlistTimestamp), "second", true);
    }

    // Determine which happened first: stop loss or take profit
    // If stop loss was hit, mark it
    if (stopLossHit) {
      // If stop loss was hit first, we exited, so target is not achieved
      if (targetTimestamp !== null && stopLossTimeDiffSeconds < targetTimeDiffSeconds) {
        result.stopLossHit = true;
        result.timeToStopLossMinutes =
          stopLossTimeDiffSeconds < 30 ? 0 : Math.round(stopLossTimeDiffSeconds / 60);
        result.stopLossTimestamp = formatDateTime(stopLossTimestamp!);
        result.targetAchieved = false;
      } else if (targetTimestamp !== null && targetTimeDiffSeconds < stopLossTimeDiffSeconds) {
        // Take profit was hit first, so we exited at take profit (target achieved)
        // Stop loss was never triggered because we exited at target
        result.stopLossHit = false;
        result.targetAchieved = true;
        result.timeToTargetMinutes =
          targetTimeDiffSeconds < 30 ? 0 : Math.round(targetTimeDiffSeconds / 60);
        result.targetTimestamp = formatDateTime(targetTimestamp);
      } else {
        // Stop loss hit, but target was never reached
        result.stopLossHit = true;
        result.timeToStopLossMinutes =
          stopLossTimeDiffSeconds < 30 ? 0 : Math.round(stopLossTimeDiffSeconds / 60);
        result.stopLossTimestamp = formatDateTime(stopLossTimestamp!);
        result.targetAchieved = false;
      }
    } else {
      // Stop loss was not hit
      result.stopLossHit = false;

      // Handle target achievement if stop loss was not hit
      if (targetTimestamp !== null && targetTimeDiffSeconds >= 1) {
        result.targetAchieved = true;
        result.timeToTargetMinutes =
          targetTimeDiffSeconds < 30 ? 0 : Math.round(targetTimeDiffSeconds / 60);
        result.targetTimestamp = formatDateTime(targetTimestamp);
      } else {
        // Target was not achieved
        result.targetAchieved = false;
      }
    }

    return result;
  } catch (error) {
    // Return empty metrics on error
    return {};
  }
}

/**
 * Maps API type format to database enum format
 */
function mapTypeToShortlistType(
  type: z.infer<typeof v1_developer_lists_persistence_schemas.getShortlistPersistence.query>["type"]
): ShortlistType {
  switch (type) {
    case "top-gainers":
      return ShortlistType.TOP_GAINERS;
    case "volume-shockers":
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
    const entries = snapshot.entries as z.infer<typeof shortlistEntrySchema>[] | null;
    return entries && entries.length > 0;
  });

  // Track which symbols appear in each snapshot
  const symbolAppearances = new Map<string, number>();
  const symbolToNameMap = new Map<string, string>();

  for (let i = 0; i < nonEmptySnapshots.length; i++) {
    const snapshot = nonEmptySnapshots[i];
    const entries = snapshot.entries as z.infer<typeof shortlistEntrySchema>[] | null;

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

  // ==================== GET /v1/lists ====================
  fastify.get("/", async (request, reply) => {
    try {
      // Check if trade metrics parameters were explicitly provided in the query
      const rawQuery = request.query as Record<string, unknown>;
      const shouldCalculateMetrics =
        rawQuery.takeProfitPercentage !== undefined && rawQuery.stopLossPercentage !== undefined;

      const validationResult = validateRequest(
        request.query,
        reply,
        v1_dashboard_schemas.v1_dashboard_lists_schemas.getShortlists.query,
        "query"
      );
      if (!validationResult) {
        return;
      }

      const {
        datetime: dateTimeParam,
        timezone: timezoneParam,
        type: typeParam,
        takeProfitPercentage,
        stopLossPercentage,
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
      const quoteSnapshots = await prisma.quoteSnapshot.findMany({
        where: {
          timestamp: {
            gte: selectedDateTimeUTC,
            lte: dayjs.utc(selectedDateTimeUTC).add(1, "minute").toDate(), // Add 1 minute
          },
        },
      });

      if (shortlists.length === 0) {
        return sendResponse<
          z.infer<typeof v1_dashboard_schemas.v1_dashboard_lists_schemas.getShortlists.response>
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
        // Process entries with trade metrics in parallel
        const entriesWithMetrics = await Promise.all(
          shortlistEntries.flatMap(async (entry) => {
            const quoteSnapshot = quoteSnapshots.find(
              (quoteSnapshot) => quoteSnapshot.nseSymbol === entry.nseSymbol
            );
            const quoteData = quoteSnapshot?.quoteData;

            if (quoteData) {
              // Only calculate trade metrics if both parameters were explicitly provided
              const tradeMetrics = shouldCalculateMetrics
                ? await calculateTradeMetrics({
                    nseSymbol: entry.nseSymbol,
                    entryPrice: entry.price,
                    shortlistTimestamp: selectedDateTimeUTC,
                    takeProfitPercentage,
                    stopLossPercentage,
                    growwAPIRequest,
                  })
                : {};

              const data: NonNullable<
                z.infer<
                  typeof v1_dashboard_schemas.v1_dashboard_lists_schemas.getShortlists.response
                >["data"]["shortlist"]
              >["entries"][number] = {
                nseSymbol: entry.nseSymbol,
                name: entry.name,
                price: entry.price,
                quoteData: quoteData as unknown as z.infer<typeof growwQuoteSchema>,
                stopLossHit: tradeMetrics.stopLossHit,
                timeToStopLossMinutes: tradeMetrics.timeToStopLossMinutes,
                stopLossTimestamp: tradeMetrics.stopLossTimestamp,
                targetAchieved: tradeMetrics.targetAchieved,
                timeToTargetMinutes: tradeMetrics.timeToTargetMinutes,
                targetTimestamp: tradeMetrics.targetTimestamp,
                stopLossPrice: tradeMetrics.stopLossPrice,
                targetPrice: tradeMetrics.targetPrice,
              };

              return data;
            }

            return [];
          })
        );

        entries = entriesWithMetrics.flat();
      }

      return sendResponse<
        z.infer<typeof v1_dashboard_schemas.v1_dashboard_lists_schemas.getShortlists.response>
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
  // ==================== POST /v1/lists ====================
  fastify.post("/", async (request, reply) => {
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
  // ==================== GET /v1/lists/scrap ====================
  fastify.get("/scrap", async (request, reply) => {
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
  // ==================== GET /v1/lists/persistence ====================
  fastify.get("/persistence", async (request, reply) => {
    const validationResult = validateRequest(
      request.query,
      reply,
      v1_developer_lists_persistence_schemas.getShortlistPersistence.query,
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
        const entries = snapshot.entries as z.infer<typeof shortlistEntrySchema>[] | null;
        return entries && entries.length > 0;
      });
      const totalNonEmptySnapshots = nonEmptySnapshots.length;

      // Find all instruments that appeared in any snapshot, ordered by appearance count
      const instruments = findPersistentInstruments(snapshots, totalNonEmptySnapshots);

      return sendResponse<
        z.infer<typeof v1_developer_lists_persistence_schemas.getShortlistPersistence.response>
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
