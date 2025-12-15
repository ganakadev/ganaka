import { ScoredQuote } from "../types";
import { MIN_SCORE_THRESHOLD } from "../config";

export function logAnalysis(scoredQuotes: ScoredQuote[]): void {
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
        }) - Score: ${quote.score.toFixed(1)}/135`
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
      console.log(
        `   RSI: ${quote.scoreBreakdown.rsiScore.toFixed(1)}/15${
          quote.rsi !== undefined
            ? ` (RSI value: ${quote.rsi.toFixed(2)})`
            : " (N/A)"
        }`
      );
      const vwapInfo =
        quote.vwap !== undefined
          ? ` (Price: ₹${quote.payload.last_price.toFixed(
              2
            )}, VWAP: ₹${quote.vwap.toFixed(2)}, Crossover: ${
              quote.vwapCrossover?.crossedAbove ? "Yes" : "No"
            })`
          : " (N/A)";
      console.log(
        `   VWAP: ${quote.scoreBreakdown.vwapScore.toFixed(1)}/20${vwapInfo}`
      );
    }
  }
}
