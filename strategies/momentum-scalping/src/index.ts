import { ganaka } from "@ganaka/sdk";
import { validateTradingWindow } from "./steps/validate-trading-window";
import { validateNiftyTrend } from "./steps/validate-nifty-trend";
import { fetchAndEnrichQuotes } from "./steps/fetch-and-enrich-quotes";
import { calculateScores } from "./steps/calculate-scores";
import { logAnalysis } from "./steps/log-analysis";
import { placeOrders } from "./steps/place-orders";
import { getNiftyTrend } from "./utils/niftyTrend";

async function main() {
  await ganaka({
    fn: async ({
      fetchShortlist,
      fetchQuote,
      fetchCandles,
      placeOrder,
    }) => {
      // Check time-of-day filter
      if (!validateTradingWindow()) {
        return;
      }

      // Check Nifty trend
      const getNiftyTrendWrapper = () => getNiftyTrend(fetchQuote);
      if (!(await validateNiftyTrend(getNiftyTrendWrapper))) {
        return;
      }

      // Fetch and enrich quotes with indicators
      const quotesData = await fetchAndEnrichQuotes(
        fetchShortlist,
        fetchQuote,
        fetchCandles
      );

      // Calculate scores for all quotes
      const scoredQuotes = calculateScores(quotesData);

      // Log analysis for all stocks
      logAnalysis(scoredQuotes);

      // Place orders for qualified stocks
      placeOrders(scoredQuotes, placeOrder);
    },
  });
}

main();
