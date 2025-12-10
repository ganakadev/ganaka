import { ganaka } from "@ganaka-algos/sdk";
import dotenv from "dotenv";
import { chunk } from "lodash";
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

      const topGainersChunk = chunk(topGainers, 5);

      const quotesData: (Awaited<ReturnType<typeof getGrowwQuote>> & {
        buyerControlOfStockPercentage: number;
      })[] = [];

      for await (const chunk of topGainersChunk) {
        const quotes: typeof quotesData = [];
        for await (const gainer of chunk) {
          const quote = await getGrowwQuote(gainer.nseSymbol);
          const totalDepthBuy = quote.payload.depth.buy.reduce(
            (acc, curr) => acc + curr.quantity,
            0
          );
          const totalDepthSell = quote.payload.depth.sell.reduce(
            (acc, curr) => acc + curr.quantity,
            0
          );
          const buyerControlOfStockPercentage =
            totalDepthBuy + totalDepthSell === 0
              ? 0
              : (totalDepthBuy / (totalDepthBuy + totalDepthSell)) * 100;
          quotes.push({
            ...quote,
            buyerControlOfStockPercentage,
          });
        }
        quotesData.push(...quotes);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const sortedQuotes = quotesData.sort(
        (a, b) =>
          b.buyerControlOfStockPercentage - a.buyerControlOfStockPercentage
      );

      console.log(sortedQuotes);
    },
    settings: {
      loopIntervalSeconds: 5,
    },
  });
}

main();
