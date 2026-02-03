import { v1_quote_schemas, v1_lists_schemas, v1_nifty_schemas } from "@ganaka/schemas";
import axios from "axios";
import dayjs from "dayjs";
import z from "zod";
import { ShortlistType, ShortlistScope } from "@ganaka/db";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const API_DOMAIN = process.env.API_DOMAIN ?? "https://api.ganaka.live";

const NIFTY_SYMBOL = "NIFTY";
const TOP_STOCKS_LIMIT = 5;

export const getLists =
  (developerKey: string) => async (type: "top-gainers" | "volume-shockers") => {
    const params: z.infer<typeof v1_lists_schemas.getListsScrap.query> = {
      type,
    };

    return axios.get<z.infer<typeof v1_lists_schemas.getListsScrap.response>>(
      `${API_DOMAIN}/v1/lists/scrap`,
      {
        params,
        headers: {
          Authorization: `Bearer ${developerKey}`,
        },
      }
    );
  };

export const getGrowwQuote = (developerKey: string) => async (symbol: string) => {
  const params: z.infer<typeof v1_quote_schemas.getGrowwQuote.query> = {
    symbol: symbol,
  };

  return axios.get<z.infer<typeof v1_quote_schemas.getGrowwQuote.response>>(
    `${API_DOMAIN}/v1/quote`,
    {
      params,
      headers: {
        Authorization: `Bearer ${developerKey}`,
      },
    }
  );
};

// ==================== Collector Data Insertion APIs ====================

export const createShortlistSnapshot =
  (developerKey: string) =>
  async (
    timestamp: Date,
    shortlistType: ShortlistType,
    entries: z.infer<typeof v1_lists_schemas.createShortlistSnapshot.body>["data"]["entries"],
    scope?: ShortlistScope
  ) => {
    const body: z.infer<typeof v1_lists_schemas.createShortlistSnapshot.body> = {
      data: {
        timestamp: dayjs(timestamp).format("YYYY-MM-DDTHH:mm:ss"),
        timezone: "Etc/UTC",
        shortlistType,
        entries,
        scope,
      },
    };

    return axios.post<z.infer<typeof v1_lists_schemas.createShortlistSnapshot.response>>(
      `${API_DOMAIN}/v1/lists`,
      body,
      {
        headers: {
          Authorization: `Bearer ${developerKey}`,
          "Content-Type": "application/json",
        },
      }
    );
  };

export const createNiftyQuote =
  (developerKey: string) =>
  async (
    timestamp: Date,
    quoteData: z.infer<typeof v1_nifty_schemas.createNiftyQuote.body>["data"]["quoteData"],
    dayChangePerc: number
  ) => {
    const body: z.infer<typeof v1_nifty_schemas.createNiftyQuote.body> = {
      data: {
        timestamp: dayjs(timestamp).format("YYYY-MM-DDTHH:mm:ss"),
        timezone: "Etc/UTC",
        quoteData,
        dayChangePerc,
      },
    };

    return axios.post<z.infer<typeof v1_nifty_schemas.createNiftyQuote.response>>(
      `${API_DOMAIN}/v1/nifty`,
      body,
      {
        headers: {
          Authorization: `Bearer ${developerKey}`,
          "Content-Type": "application/json",
        },
      }
    );
  };

/**
 * Collect market data: fetch shortlists and NIFTY quote, then store them
 */
async function collectMarketData(): Promise<void> {
  const timestamp = dayjs().utc().toDate();
  console.log(`\n[${timestamp.toISOString()}] Starting market data collection...`);

  try {
    // 1. Fetch both shortlists in parallel
    console.log("Fetching shortlists...");
    const [topGainers, volumeShockers] = await Promise.all([
      getLists(process.env.DEVELOPER_KEY!)("top-gainers").catch((error: unknown) => {
        console.error("Failed to fetch top-gainers:", error);
        return null;
      }),
      getLists(process.env.DEVELOPER_KEY!)("volume-shockers").catch((error: unknown) => {
        console.error("Failed to fetch volume-shockers:", error);
        return null;
      }),
    ]);

    if (
      topGainers &&
      volumeShockers &&
      (topGainers.data?.data ?? []).length > 0 &&
      (volumeShockers.data?.data ?? []).length > 0
    ) {
      // 2. Limit each to top items
      const topGainersLimited = topGainers.data?.data?.slice(0, TOP_STOCKS_LIMIT) ?? [];
      const volumeShockersLimited = volumeShockers.data?.data?.slice(0, TOP_STOCKS_LIMIT) ?? [];
      console.log(
        `Top gainers: ${topGainersLimited.length}, Volume shockers: ${volumeShockersLimited.length}`
      );

      // 3. Store shortlists via API
      console.log("Storing shortlists via API...");
      const topGainersShortlistType: ShortlistType = "TOP_GAINERS";
      const volumeShockersShortlistType: ShortlistType = "VOLUME_SHOCKERS";
      const topGainersFull = topGainers.data?.data ?? [];
      const volumeShockersFull = volumeShockers.data?.data ?? [];

      // Store FULL shortlist for top-gainers
      if (topGainersFull.length > 0) {
        await createShortlistSnapshot(process.env.DEVELOPER_KEY!)(
          timestamp,
          topGainersShortlistType,
          topGainersFull.map((item) => ({
            nseSymbol: item.nseSymbol,
            name: item.name,
            price: item.price,
          })),
          "FULL"
        );
        console.log(`Stored TOP_GAINERS shortlist (FULL, ${topGainersFull.length} entries)`);
      }

      // Store TOP_5 shortlist for top-gainers
      if (topGainersLimited.length > 0) {
        await createShortlistSnapshot(process.env.DEVELOPER_KEY!)(
          timestamp,
          topGainersShortlistType,
          topGainersLimited.map((item) => ({
            nseSymbol: item.nseSymbol,
            name: item.name,
            price: item.price,
          })),
          "TOP_5"
        );
        console.log(`Stored TOP_GAINERS shortlist (TOP_5, ${topGainersLimited.length} entries)`);
      }

      // Store FULL shortlist for volume-shockers
      if (volumeShockersFull.length > 0) {
        await createShortlistSnapshot(process.env.DEVELOPER_KEY!)(
          timestamp,
          volumeShockersShortlistType,
          volumeShockersFull.map((item) => ({
            nseSymbol: item.nseSymbol,
            name: item.name,
            price: item.price,
          })),
          "FULL"
        );
        console.log(
          `Stored VOLUME_SHOCKERS shortlist (FULL, ${volumeShockersFull.length} entries)`
        );
      }

      // Store TOP_5 shortlist for volume-shockers
      if (volumeShockersLimited.length > 0) {
        await createShortlistSnapshot(process.env.DEVELOPER_KEY!)(
          timestamp,
          volumeShockersShortlistType,
          volumeShockersLimited.map((item) => ({
            nseSymbol: item.nseSymbol,
            name: item.name,
            price: item.price,
          })),
          "TOP_5"
        );
        console.log(
          `Stored VOLUME_SHOCKERS shortlist (TOP_5, ${volumeShockersLimited.length} entries)`
        );
      }
    }

    // 4. Fetch and store NIFTY quote
    console.log("Fetching NIFTY quote...");
    const niftyQuote = await getGrowwQuote(process.env.DEVELOPER_KEY!)(NIFTY_SYMBOL).catch(
      (error: unknown) => {
        console.error("Failed to fetch NIFTY quote:", error);
        return null;
      }
    );

    // Store NIFTY quote via API (if available)
    if (niftyQuote && niftyQuote.data?.data?.status === "SUCCESS") {
      const niftyData = niftyQuote.data.data!;
      await createNiftyQuote(process.env.DEVELOPER_KEY!)(
        timestamp,
        niftyData,
        niftyData.payload.day_change_perc ?? 0
      );
      console.log("Stored NIFTY quote");
    }

    console.log("Data collection completed successfully");
  } catch (error) {
    console.error("Error during market data collection:", error);
    throw error;
  }
}

export { collectMarketData };
