import { type v1_dashboard_schemas } from "@ganaka/schemas";
import { z } from "zod";

export const App = () => {
  const a: z.infer<
    typeof v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.query
  > = {
    date: "2025-01-01",
    symbol: "NSE:NIFTY",
    interval: "5minute",
  };

  console.log(a);

  // DRAW
  return <p>Hello World</p>;
};
