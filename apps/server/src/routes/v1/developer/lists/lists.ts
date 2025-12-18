import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { validateRequest } from "../../../../utils/validator";
import { v1_developer_lists_schemas } from "@ganaka/schemas";
import { sendResponse } from "../../../../utils/sendResponse";
import z from "zod";
import * as cheerio from "cheerio";
import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from "axios";
import { shuffle } from "lodash";

const MAX_PROXY_RETRIES = 3;

const getProxyList = async (fastify: FastifyInstance) => {
  try {
    const response = (await axios.get(
      "https://proxy.webshare.io/api/v2/proxy/list",
      {
        params: {
          page: 1,
          page_size: 5,
          mode: "direct",
        },
        headers: {
          Authorization: `Token ${process.env.WEBSHARE_API_KEY}`,
        },
      }
    )) as AxiosResponse<{
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
    fastify.log.error("Error getting proxy list: %s", error);
    return [];
  }
};

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

    const proxyList = await getProxyList(fastify);
    const url =
      validationResult.type === "volume-shockers"
        ? `https://groww.in/markets/volume-shockers`
        : `https://groww.in/markets/top-gainers?index=GIDXNIFTYTOTALMCAP`;

    if (proxyList.length > 0) {
      const shuffledProxyList = shuffle(proxyList);

      for await (const [tryCount, proxy] of shuffledProxyList.entries()) {
        fastify.log.info(
          `Trying proxy: ${proxy ? `${proxy.host}:${proxy.port}` : "None"}`
        );

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
            proxy: {
              host: proxy.host,
              port: proxy.port,
              auth: {
                username: proxy.username,
                password: proxy.password,
              },
              protocol: "http",
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
          if (
            axios.isAxiosError(error) &&
            (error.response?.status === 403 || error.response?.status === 429)
          ) {
            fastify.log.error(error, "Error fetching lists");
            fastify.log.error(proxy, "Proxy blocked");

            if (tryCount < MAX_PROXY_RETRIES) {
              continue;
            }

            return sendResponse<
              z.infer<typeof v1_developer_lists_schemas.getLists.response>
            >({
              statusCode: 200,
              message:
                "List unable to be fetched. Please check server logs for more details.",
              data: [],
            });
          }

          fastify.log.error(error, "Error fetching lists");
          return reply.internalServerError(
            "Failed to fetch lists. Please check server logs for more details."
          );
        }
      }
    }
  });
};

export default listsRoutes;
