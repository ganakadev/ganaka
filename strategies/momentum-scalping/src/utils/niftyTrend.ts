export async function getNiftyTrend(
  fetchQuote: (symbol: string) => Promise<{
    status: "SUCCESS" | "FAILURE";
    payload: {
      day_change_perc: number;
    };
  }>
): Promise<{
  dayChangePerc: number;
  isBullish: boolean;
}> {
  const quote = await fetchQuote("NIFTYBANK");
  
  if (quote.status !== "SUCCESS") {
    throw new Error("Failed to fetch NIFTYBANK quote");
  }

  const dayChangePerc = quote.payload.day_change_perc;
  const isBullish = dayChangePerc > 0.5;

  return {
    dayChangePerc,
    isBullish,
  };
}

