import { ScoredQuote } from "../types";
import { MIN_SCORE_THRESHOLD, STOP_LOSS_PERCENTAGE } from "../config";

export function placeOrders(
  scoredQuotes: ScoredQuote[],
  placeOrder: (order: {
    nseSymbol: string;
    stopLossPrice: number;
    takeProfitPrice: number;
    entryPrice: number;
  }) => void
): void {
  // FILTER STOCKS BY SCORE THRESHOLD
  const qualifiedStocks = scoredQuotes.filter(
    (quote) => quote.score >= MIN_SCORE_THRESHOLD
  );

  // SORT BY SCORE (highest first)
  qualifiedStocks.sort((a, b) => b.score - a.score);

  // PROCESS EACH QUALIFYING STOCK AND PLACE ORDERS
  console.log(`\n=== QUALIFIED STOCKS (Score >= ${MIN_SCORE_THRESHOLD}) ===`);
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

    // CALL placeOrder WITH simplified structure
    placeOrder({
      nseSymbol: quote.nseSymbol,
      entryPrice,
      stopLossPrice,
      takeProfitPrice,
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
}
