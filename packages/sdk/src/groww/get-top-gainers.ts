import axios from "axios";
import * as cheerio from "cheerio";
import { logger } from "../utils/logger";

export interface GrowwTopGainer {
  name: string;
  price: number;
  href: string;
}

export const getGrowwTopGainers = async (
  index: string = "GIDXNIFTYTOTALMCAP"
): Promise<GrowwTopGainer[]> => {
  try {
    logger.debug(`Fetching top gainers for index: ${index}`);
    const url = `https://groww.in/markets/top-gainers?index=${index}`;

    // Fetch the HTML page
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    // Parse HTML with cheerio
    const $ = cheerio.load(response.data);

    const gainers: GrowwTopGainer[] = [];

    // Find the table with top gainers
    // Based on the page structure, we need to find the table rows
    $("table tbody tr").each((_, element) => {
      const $row = $(element);
      const cells = $row.find("td");

      if (cells.length >= 2) {
        // Extract company name (first column)
        const firstCell = $row.find("td").first();
        const name = firstCell.text().trim();

        // Extract href from anchor tag in the first cell
        const href = firstCell.find("a").attr("href") || "";

        // Extract market price (second column, remove ₹ symbol and commas)
        const priceText = cells.eq(1).text().trim().replace(/₹|,/g, "");
        const price = parseFloat(priceText);

        if (name && !isNaN(price)) {
          gainers.push({
            name,
            price,
            href,
          });
        }
      }
    });

    logger.debug(`Found ${gainers.length} top gainers`);
    return gainers;
  } catch (error) {
    logger.error(`Failed to fetch top gainers: ${error}`);
    throw error;
  }
};
