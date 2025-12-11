import { ganaka } from "@ganaka-algos/sdk";
import dotenv from "dotenv";
import { chunk } from "lodash";
dotenv.config();

const GROWW_API_KEY = process.env.GROWW_API_KEY;
const GROWW_API_SECRET = process.env.GROWW_API_SECRET;

if (!GROWW_API_KEY || !GROWW_API_SECRET) {
  throw new Error("GROWW_API_KEY and GROWW_API_SECRET are required");
}

// Configuration thresholds
const MIN_SCORE_THRESHOLD = 70;
const MIN_VOLUME = 100000;
const STOP_LOSS_PERCENTAGE = 0.02; // 2%
const CIRCUIT_BUFFER_PERCENTAGE = 0.02; // 2% buffer

interface ScoredQuote {
  status: "SUCCESS" | "FAILURE";
  payload: {
    average_price: number | null;
    bid_quantity: number | null;
    bid_price: number | null;
    day_change: number;
    day_change_perc: number;
    upper_circuit_limit: number;
    lower_circuit_limit: number;
    ohlc: {
      open: number;
      high: number;
      low: number;
      close: number;
    };
    depth: {
      buy: { price: number; quantity: number }[];
      sell: { price: number; quantity: number }[];
    };
    last_trade_quantity: number;
    last_trade_time: number;
    last_price: number;
    total_buy_quantity: number;
    total_sell_quantity: number;
    volume: number;
    week_52_high: number;
    week_52_low: number;
  };
  buyerControlOfStockPercentage: number;
  instrument: string;
  nseSymbol: string;
  score: number;
  scoreBreakdown: {
    volumeScore: number;
    pricePositionScore: number;
    orderBookImbalanceScore: number;
    buyerControlScore: number;
    circuitLimitScore: number;
  };
  rejectionReason?: string;
}

interface ScoreBreakdown {
  volumeScore: number;
  pricePositionScore: number;
  orderBookImbalanceScore: number;
  buyerControlScore: number;
  circuitLimitScore: number;
}

function calculateScore(
  quote: Omit<ScoredQuote, "score" | "scoreBreakdown" | "rejectionReason">,
  buyerControlOfStockPercentage: number,
  takeProfitPrice: number
): { score: number; breakdown: ScoreBreakdown; rejectionReason?: string } {
  const payload = quote.payload;
  const breakdown: ScoreBreakdown = {
    volumeScore: 0,
    pricePositionScore: 0,
    orderBookImbalanceScore: 0,
    buyerControlScore: 0,
    circuitLimitScore: 0,
  };

  // Volume Score (0-25 points)
  if (payload.volume < MIN_VOLUME) {
    return {
      score: 0,
      breakdown,
      rejectionReason: `Low volume: ${payload.volume} < ${MIN_VOLUME}`,
    };
  }
  // Scale volume score: 100k = 10 points, 500k = 20 points, 1M+ = 25 points
  breakdown.volumeScore = Math.min(
    25,
    Math.max(10, (payload.volume / 40000) * 1)
  );

  // Price Position Score (0-20 points)
  // Calculate: (last_price - ohlc.low) / (ohlc.high - ohlc.low) * 100
  const priceRange = payload.ohlc.high - payload.ohlc.low;
  if (priceRange > 0) {
    const pricePositionPercent =
      ((payload.last_price - payload.ohlc.low) / priceRange) * 100;
    // Stocks near day's high (>80% of range) score higher
    if (pricePositionPercent >= 80) {
      breakdown.pricePositionScore = 20;
    } else if (pricePositionPercent >= 60) {
      breakdown.pricePositionScore = 15;
    } else if (pricePositionPercent >= 40) {
      breakdown.pricePositionScore = 10;
    } else {
      breakdown.pricePositionScore = 5;
    }
  } else {
    breakdown.pricePositionScore = 10; // Neutral if no range
  }

  // Order Book Imbalance Score (0-25 points)
  // Use total_buy_quantity vs total_sell_quantity (more reliable than depth)
  const totalQuantity =
    payload.total_buy_quantity + payload.total_sell_quantity;
  if (totalQuantity > 0) {
    const buyImbalancePercent =
      (payload.total_buy_quantity / totalQuantity) * 100;
    // Scale: 50% = 12.5 points, 60% = 15 points, 70% = 17.5 points, 80%+ = 25 points
    breakdown.orderBookImbalanceScore = Math.min(
      25,
      Math.max(0, (buyImbalancePercent - 50) * 0.5 + 12.5)
    );
  }

  // Buyer Control Score (0-20 points)
  // Scale from 0-20 based on percentage
  breakdown.buyerControlScore = Math.min(
    20,
    buyerControlOfStockPercentage * 0.2
  );

  // Circuit Limit Check (0-10 points)
  // Ensure takeProfitPrice < upper_circuit_limit * (1 - buffer)
  const maxAllowedPrice =
    payload.upper_circuit_limit * (1 - CIRCUIT_BUFFER_PERCENTAGE);
  if (takeProfitPrice >= maxAllowedPrice) {
    return {
      score: 0,
      breakdown,
      rejectionReason: `No room for 2% gain: takeProfit ${takeProfitPrice.toFixed(
        2
      )} >= circuit limit ${maxAllowedPrice.toFixed(2)}`,
    };
  }
  breakdown.circuitLimitScore = 10;

  const totalScore =
    breakdown.volumeScore +
    breakdown.pricePositionScore +
    breakdown.orderBookImbalanceScore +
    breakdown.buyerControlScore +
    breakdown.circuitLimitScore;

  return { score: totalScore, breakdown };
}

async function main() {
  await ganaka({
    fn: async ({ getGrowwShortlist, getGrowwQuote, placeOrder }) => {
      // GET TOP GAINERS
      const shortlist = await getGrowwShortlist("volume-shockers");
      const shortlistChunk = chunk(shortlist, 5);

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
          quotes.push({
            ...quote,
            buyerControlOfStockPercentage,
            instrument: shortlistItem.name,
            nseSymbol: shortlistItem.nseSymbol,
          });
        }
        quotesData.push(...quotes);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // CALCULATE SCORES FOR EACH STOCK
      const scoredQuotes: ScoredQuote[] = [];
      for (const quote of quotesData) {
        const entryPrice = quote.payload.last_price;
        const takeProfitPrice = entryPrice * 1.02; // 2% gain target

        const { score, breakdown, rejectionReason } = calculateScore(
          quote,
          quote.buyerControlOfStockPercentage,
          takeProfitPrice
        );

        const scoredQuote: ScoredQuote = {
          ...quote,
          score,
          scoreBreakdown: breakdown,
          ...(rejectionReason && { rejectionReason }),
        };
        scoredQuotes.push(scoredQuote);
      }

      // FILTER STOCKS BY SCORE THRESHOLD
      const qualifiedStocks = scoredQuotes.filter(
        (quote) => quote.score >= MIN_SCORE_THRESHOLD
      );

      // SORT BY SCORE (highest first)
      qualifiedStocks.sort((a, b) => b.score - a.score);

      // LOG SCORE BREAKDOWN FOR ALL STOCKS
      console.log("\n=== STOCK ANALYSIS ===");
      for (const quote of scoredQuotes) {
        if (quote.rejectionReason) {
          console.log(
            `❌ ${quote.instrument} (${quote.nseSymbol}): REJECTED - ${quote.rejectionReason}`
          );
        } else {
          console.log(
            `\n📊 ${quote.instrument} (${
              quote.nseSymbol
            }) - Score: ${quote.score.toFixed(1)}/100`
          );
          console.log(
            `   Volume: ${quote.scoreBreakdown.volumeScore.toFixed(
              1
            )}/25 (${quote.payload.volume.toLocaleString()})`
          );
          console.log(
            `   Price Position: ${quote.scoreBreakdown.pricePositionScore.toFixed(
              1
            )}/20`
          );
          console.log(
            `   Order Book Imbalance: ${quote.scoreBreakdown.orderBookImbalanceScore.toFixed(
              1
            )}/25`
          );
          console.log(
            `   Buyer Control: ${quote.scoreBreakdown.buyerControlScore.toFixed(
              1
            )}/20 (${quote.buyerControlOfStockPercentage.toFixed(1)}%)`
          );
          console.log(
            `   Circuit Limit: ${quote.scoreBreakdown.circuitLimitScore.toFixed(
              1
            )}/10`
          );
        }
      }

      // PROCESS EACH QUALIFYING STOCK AND PLACE ORDERS
      console.log(
        `\n=== QUALIFIED STOCKS (Score >= ${MIN_SCORE_THRESHOLD}) ===`
      );
      for (const quote of qualifiedStocks) {
        const entryPrice = quote.payload.last_price;
        const takeProfitPrice = entryPrice * 1.02; // 2% gain
        const stopLossPrice = entryPrice * (1 - STOP_LOSS_PERCENTAGE); // 2% below entry

        console.log(
          `✅ Placing order for ${quote.instrument} (${
            quote.nseSymbol
          }) - Score: ${quote.score.toFixed(1)}`
        );
        console.log(
          `   Entry: ₹${entryPrice.toFixed(
            2
          )}, Take Profit: ₹${takeProfitPrice.toFixed(
            2
          )}, Stop Loss: ₹${stopLossPrice.toFixed(2)}`
        );

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
      console.log(`\n=== SUMMARY ===`);
      if (qualifiedStocks.length === 0) {
        console.log(`No stocks found with score >= ${MIN_SCORE_THRESHOLD}`);
      } else {
        console.log(
          `Found ${qualifiedStocks.length} stock(s) with score >= ${MIN_SCORE_THRESHOLD}`
        );
      }
    },
  });
}

main();
