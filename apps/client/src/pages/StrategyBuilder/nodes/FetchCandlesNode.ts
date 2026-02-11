import { ClassicPreset } from "rete";
import { BaseNode, Sockets } from "../types";

export class FetchCandlesNode extends BaseNode {
  category = "dataSource" as const;

  symbol = "";
  interval:
    | "1minute"
    | "2minute"
    | "3minute"
    | "5minute"
    | "10minute"
    | "15minute"
    | "30minute"
    | "1hour"
    | "4hour"
    | "1day"
    | "1week"
    | "1month" = "1minute";
  startDatetime = "";
  endDatetime = "";
  useCurrentTimestampAsEnd = true;

  constructor() {
    super("Fetch Candles");
    this.width = 260;
    this.height = 300;

    this.addInput("exec", new ClassicPreset.Input(Sockets.exec, "Exec", false));
    this.addInput("symbol", new ClassicPreset.Input(Sockets.string, "Symbol"));

    this.addOutput("exec", new ClassicPreset.Output(Sockets.exec, "Next"));
    this.addOutput(
      "candles",
      new ClassicPreset.Output(Sockets.candleData, "Candles")
    );
  }
}
