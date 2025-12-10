import { ganaka } from "@ganaka-algos/sdk";
import dotenv from "dotenv";
dotenv.config();

const GROWW_API_KEY = process.env.GROWW_API_KEY;
const GROWW_API_SECRET = process.env.GROWW_API_SECRET;

if (!GROWW_API_KEY || !GROWW_API_SECRET) {
  throw new Error("GROWW_API_KEY and GROWW_API_SECRET are required");
}

interface GainerWithDepth {
  name: string;
  price: number;
  groww_symbol: string;
  buyDepth: number;
  sellDepth: number;
  depthDifference: number;
}

async function main() {
  await ganaka({
    fn: async ({ getGrowwTopGainers, getGrowwQuote }) => {
      const topGainers = await getGrowwTopGainers();

      // Filter gainers that have groww_symbol
      const gainersWithSymbol = topGainers.filter(
        (gainer) => gainer.groww_symbol
      );

      console.log(
        `Processing ${gainersWithSymbol.length} out of ${topGainers.length} gainers with groww_symbol`
      );

      // Fetch quotes and calculate market depth for each gainer
      const gainersWithDepth: GainerWithDepth[] = [];

      for (const gainer of gainersWithSymbol) {
        try {
          const quote = await getGrowwQuote(gainer.groww_symbol!);

          if (quote.status === "SUCCESS" && quote.payload?.ohlc?.depth) {
            // Sum all buy quantities from depth array
            const buyDepth =
              quote.payload.ohlc.depth.buy?.reduce(
                (sum, order) => sum + (order.quantity || 0),
                0
              ) || 0;

            // Sum all sell quantities from depth array
            const sellDepth =
              quote.payload.ohlc.depth.sell?.reduce(
                (sum, order) => sum + (order.quantity || 0),
                0
              ) || 0;

            const depthDifference = buyDepth - sellDepth;

            gainersWithDepth.push({
              name: gainer.name,
              price: gainer.price,
              groww_symbol: gainer.groww_symbol!,
              buyDepth,
              sellDepth,
              depthDifference,
            });
          }
        } catch (error) {
          console.error(
            `Failed to fetch quote for ${gainer.name} (${gainer.groww_symbol}): ${error}`
          );
          // Continue processing other gainers
        }
      }

      // Sort by market depth difference (descending - highest buy depth advantage first)
      gainersWithDepth.sort((a, b) => b.depthDifference - a.depthDifference);

      // Print sorted results
      console.log("\n=== Top Gainers Sorted by Market Depth ===");
      console.log(
        "Name".padEnd(30) +
          "Price".padEnd(12) +
          "Buy Depth".padEnd(15) +
          "Sell Depth".padEnd(15) +
          "Difference"
      );
      console.log("-".repeat(87));

      for (const gainer of gainersWithDepth) {
        console.log(
          gainer.name.padEnd(30) +
            gainer.price.toFixed(2).padEnd(12) +
            gainer.buyDepth.toLocaleString().padEnd(15) +
            gainer.sellDepth.toLocaleString().padEnd(15) +
            gainer.depthDifference.toLocaleString()
        );
      }

      return `Processed ${gainersWithDepth.length} gainers`;
    },
    settings: {
      loopIntervalSeconds: 5,
    },
  });
}

main();
