import { ganaka } from "@ganaka-algos/sdk";
import { validateTradingWindow } from "./steps/validate-trading-window";
import { validateNiftyTrend } from "./steps/validate-nifty-trend";
import { fetchAndEnrichQuotes } from "./steps/fetch-and-enrich-quotes";
import { calculateScores } from "./steps/calculate-scores";
import { logAnalysis } from "./steps/log-analysis";
import { placeOrders } from "./steps/place-orders";

async function main() {
  await ganaka({
    fn: async ({
      getGrowwShortlist,
      getGrowwQuote,
      getGrowwCandles,
      getNiftyTrend,
      placeOrder,
    }) => {
      // Check time-of-day filter
      if (!validateTradingWindow()) {
        return;
      }

      // Check Nifty trend
      if (!(await validateNiftyTrend(getNiftyTrend))) {
        return;
      }

      // Fetch and enrich quotes with indicators
      const quotesData = await fetchAndEnrichQuotes(
        getGrowwShortlist,
        getGrowwQuote,
        getGrowwCandles
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
