import { getGrowwQuote } from "@ganaka/groww";

export interface NiftyTrend {
  isBullish: boolean;
  dayChangePerc: number;
  currentPrice: number;
}

const NIFTYBANK_SYMBOL = "NIFTYBANK";
const BULLISH_THRESHOLD = 0.5; // 0.5%

export const getNiftyTrend = async (): Promise<NiftyTrend> => {
  const quote = await getGrowwQuote(NIFTYBANK_SYMBOL);

  if (quote.status === "FAILURE") {
    throw new Error("Failed to fetch NIFTYBANK quote");
  }

  const dayChangePerc = quote.payload.day_change_perc;
  const isBullish = dayChangePerc > BULLISH_THRESHOLD;

  return {
    isBullish,
    dayChangePerc,
    currentPrice: quote.payload.last_price,
  };
};
