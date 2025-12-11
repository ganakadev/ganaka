import { ganaka } from "@ganaka-algos/sdk";
import dotenv from "dotenv";
import { chunk } from "lodash";
dotenv.config();

const GROWW_API_KEY = process.env.GROWW_API_KEY;
const GROWW_API_SECRET = process.env.GROWW_API_SECRET;

if (!GROWW_API_KEY || !GROWW_API_SECRET) {
  throw new Error("GROWW_API_KEY and GROWW_API_SECRET are required");
}

async function main() {
  await ganaka({
    fn: async ({ getGrowwTopGainers, getGrowwQuote, placeOrder }) => {
      // GET TOP GAINERS
      const topGainers = await getGrowwTopGainers();
      const topGainersChunk = chunk(topGainers, 5);

      // GET QUOTES FOR EACH TOP GAINER
      const quotesData: (Awaited<ReturnType<typeof getGrowwQuote>> & {
        buyerControlOfStockPercentage: number;
        instrument: string;
        nseSymbol: string;
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
            instrument: gainer.name,
            nseSymbol: gainer.nseSymbol,
          });
        }
        quotesData.push(...quotes);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // FILTER STOCKS WITH BUYER CONTROL > 70%
      const highBuyerControlStocks = quotesData.filter(
        (quote) => quote.buyerControlOfStockPercentage > 80
      );

      // PROCESS EACH QUALIFYING STOCK AND PLACE ORDERS
      for (const quote of highBuyerControlStocks) {
        const entryPrice = quote.payload.last_price;
        const takeProfitTarget = entryPrice * 1.02; // 2% gain
        const stopLossPrice = quote.payload.ohlc.low; // Support level (day's low)
        const takeProfitPrice = takeProfitTarget; // Same as target

        // CALL placeOrder WITH MarketDepthData STRUCTURE
        placeOrder({
          nseSymbol: quote.nseSymbol,
          instrument: quote.instrument,
          buyDepth: quote.payload.depth.buy,
          sellDepth: quote.payload.depth.sell,
          entryPrice,
          currentPrice: quote.payload.last_price,
          stopLossPrice,
          takeProfitPrice,
          timestamp: new Date(),
          buyerControlOfStockPercentage: quote.buyerControlOfStockPercentage,
        });
      }

      // LOG RESULT
      if (highBuyerControlStocks.length === 0) {
        console.log("No stocks found with buyer control > 70%");
      } else {
        console.log(
          `Found ${highBuyerControlStocks.length} stock(s) with buyer control > 70%`
        );
      }
    },
  });
}

main();
