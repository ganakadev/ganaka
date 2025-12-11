export async function validateNiftyTrend(
  getNiftyTrend: () => Promise<{
    dayChangePerc: number;
    isBullish: boolean;
  }>
): Promise<boolean> {
  try {
    const niftyTrend = await getNiftyTrend();
    console.log(
      `\n📈 NIFTYBANK Trend: ${niftyTrend.dayChangePerc.toFixed(2)}%`
    );

    if (!niftyTrend.isBullish) {
      console.log(
        `❌ NIFTYBANK is not bullish (${niftyTrend.dayChangePerc.toFixed(
          2
        )}% <= 0.5%). Skipping trades.`
      );
      return false;
    }
    console.log(`✅ NIFTYBANK is bullish. Proceeding with strategy.`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to fetch NIFTYBANK trend: ${error}`);
    return false;
  }
}
