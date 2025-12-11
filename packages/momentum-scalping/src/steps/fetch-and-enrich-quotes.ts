import { chunk } from "lodash";
import { ScoredQuote, Candle } from "../types";
import { TOP_STOCKS_LIMIT, RSI_CANDLE_INTERVAL, RSI_PERIOD } from "../config";
import { getMarketOpenTime } from "../utils/time";
import {
  calculateRSI,
  calculateVolumeTrend,
  detectVWAPCrossover,
} from "../utils/indicators";
import { calculateVWAP } from "../utils/vwap";

export async function fetchAndEnrichQuotes(
  getGrowwShortlist: (
    type: "volume-shockers" | "top-gainers"
  ) => Promise<Array<{ nseSymbol: string; name: string }>>,
  getGrowwQuote: (symbol: string) => Promise<{
    status: "SUCCESS" | "FAILURE";
    payload: ScoredQuote["payload"];
  }>,
  getGrowwCandles: (params: {
    symbol: string;
    interval: "5minute" | "15minute" | "30minute" | "1hour" | "4hour";
    start_time: string;
    end_time: string;
  }) => Promise<{
    status: "SUCCESS" | "FAILURE";
    payload: { candles?: Candle[] };
  }>
): Promise<
  Omit<ScoredQuote, "score" | "scoreBreakdown" | "rejectionReason">[]
> {
  // GET TOP GAINERS (limit to top 10)
  const shortlist = await getGrowwShortlist("top-gainers");
  const topStocks = shortlist.slice(0, TOP_STOCKS_LIMIT);
  console.log(
    `\n📊 Processing top ${TOP_STOCKS_LIMIT} stocks from shortlist (${shortlist.length} total)`
  );
  const shortlistChunk = chunk(topStocks, 5);

  // GET QUOTES FOR EACH TOP GAINER
  const quotesData: Omit<
    ScoredQuote,
    "score" | "scoreBreakdown" | "rejectionReason"
  >[] = [];
  for await (const chunk of shortlistChunk) {
    const quotes: typeof quotesData = [];
    for await (const shortlistItem of chunk) {
      const quote = await getGrowwQuote(shortlistItem.nseSymbol);
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

      // Fetch historical candles for RSI and VWAP calculation
      let rsi: number | null = null;
      let vwap: number | null = null;
      let vwapCrossover:
        | { crossedAbove: boolean; candlesSinceCross: number }
        | undefined = undefined;
      let volumeTrend: import("../types").VolumeTrend | null = null;

      try {
        const endTime = new Date();
        const marketOpenTime = getMarketOpenTime();

        // Use market open time for intraday VWAP calculation
        const candlesResponse = await getGrowwCandles({
          symbol: shortlistItem.nseSymbol,
          interval: RSI_CANDLE_INTERVAL,
          start_time: marketOpenTime.toISOString(),
          end_time: endTime.toISOString(),
        });

        if (
          candlesResponse.status === "SUCCESS" &&
          candlesResponse.payload.candles
        ) {
          const candles = candlesResponse.payload.candles as Candle[];

          // Calculate VWAP (using all candles from market open)
          vwap = calculateVWAP(candles);

          // Calculate RSI
          if (candles.length >= RSI_PERIOD + 1) {
            const closePrices = candles.map((candle) => candle[4]); // Extract close prices
            rsi = calculateRSI(closePrices, RSI_PERIOD);
          }

          // Detect VWAP crossover
          if (vwap !== null) {
            vwapCrossover = detectVWAPCrossover(
              quote.payload.last_price,
              candles,
              vwap
            );
          }

          // Calculate volume trend
          volumeTrend = calculateVolumeTrend(candles);
        }
      } catch (error) {
        console.warn(
          `Failed to fetch candles for ${shortlistItem.nseSymbol}: ${error}`
        );
        // Continue with rsi/vwap as null (will get 0 points)
      }

      quotes.push({
        ...quote,
        buyerControlOfStockPercentage,
        instrument: shortlistItem.name,
        nseSymbol: shortlistItem.nseSymbol,
        rsi: rsi ?? undefined,
        vwap: vwap ?? undefined,
        vwapCrossover,
        volumeTrend: volumeTrend ?? undefined,
      });
    }
    quotesData.push(...quotes);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return quotesData;
}
