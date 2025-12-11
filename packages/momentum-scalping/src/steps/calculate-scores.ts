import { ScoredQuote } from "../types";
import { calculateScore } from "../scoring/calculate-score";

export function calculateScores(
  quotesData: Omit<
    ScoredQuote,
    "score" | "scoreBreakdown" | "rejectionReason"
  >[]
): ScoredQuote[] {
  const scoredQuotes: ScoredQuote[] = [];
  for (const quote of quotesData) {
    const entryPrice = quote.payload.last_price;
    const takeProfitPrice = entryPrice * 1.02; // 2% gain target

    const { score, breakdown, rejectionReason } = calculateScore(
      quote,
      quote.buyerControlOfStockPercentage,
      takeProfitPrice,
      quote.rsi,
      quote.vwap,
      quote.vwapCrossover,
      quote.volumeTrend
    );

    const scoredQuote: ScoredQuote = {
      ...quote,
      score,
      scoreBreakdown: breakdown,
      rsi: quote.rsi,
      vwap: quote.vwap,
      vwapCrossover: quote.vwapCrossover,
      volumeTrend: quote.volumeTrend,
      ...(rejectionReason && { rejectionReason }),
    };
    scoredQuotes.push(scoredQuote);
  }

  return scoredQuotes;
}
