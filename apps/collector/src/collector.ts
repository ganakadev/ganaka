import { v1_lists_schemas } from "@ganaka/schemas";
import axios from "axios";
import dayjs from "dayjs";
import z from "zod";
import { ShortlistType, ShortlistScope } from "@ganaka/db";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const API_DOMAIN = process.env.API_DOMAIN ?? "https://api.ganaka.live";

export const getLists =
  (developerKey: string) => async (type: "TOP_GAINERS" | "VOLUME_SHOCKERS") => {
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

/**
 * Collect market data: fetch shortlists and store them
 */
async function collectMarketData(): Promise<void> {
  const timestamp = dayjs().utc().toDate();
  console.log(`\n[${timestamp.toISOString()}] Starting market data collection...`);

  try {
    // 1. Fetch both shortlists in parallel
    console.log("Fetching shortlists...");
    const [topGainers, volumeShockers] = await Promise.all([
      getLists(process.env.DEVELOPER_KEY!)("TOP_GAINERS").catch((error: unknown) => {
        console.error("Failed to fetch top-gainers:", error);
        return null;
      }),
      getLists(process.env.DEVELOPER_KEY!)("VOLUME_SHOCKERS").catch((error: unknown) => {
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
      // 2. Store shortlists via API
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
    }

    console.log("Data collection completed successfully");
  } catch (error) {
    console.error("Error during market data collection:", error);
    throw error;
  }
}

export { collectMarketData };
