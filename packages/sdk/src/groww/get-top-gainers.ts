import axios from "axios";
import * as cheerio from "cheerio";
import { logger } from "../utils/logger";

export interface GrowwTopGainer {
  name: string;
  price: number;
  nseSymbol: string;
}

export const getGrowwTopGainers = async (): Promise<GrowwTopGainer[]> => {
  try {
    logger.debug(`Fetching top gainers for index: GIDXNIFTYTOTALMCAP`);
    const url = `https://groww.in/markets/top-gainers?index=GIDXNIFTYTOTALMCAP`;

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
    const stocks = nextData?.props?.pageProps?.stocks;

    if (!Array.isArray(stocks)) {
      throw new Error("Stocks array not found in __NEXT_DATA__");
    }

    // Map stocks to GrowwTopGainer format
    const gainers: GrowwTopGainer[] = stocks
      .map((stock: any) => ({
        name: stock.companyName || stock.companyShortName || "",
        price: stock.ltp || 0,
        nseSymbol: stock.nseScriptCode || "",
      }))
      .filter((gainer: GrowwTopGainer) => gainer.name && gainer.nseSymbol);

    logger.debug(`Found ${gainers.length} top gainers`);
    return gainers;
  } catch (error) {
    logger.error(`Failed to fetch top gainers: ${error}`);
    throw error;
  }
};
