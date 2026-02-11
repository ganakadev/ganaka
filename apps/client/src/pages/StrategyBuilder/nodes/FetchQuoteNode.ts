import { ClassicPreset } from "rete";
import { BaseNode, Sockets } from "../types";

export class FetchQuoteNode extends BaseNode {
  category = "dataSource" as const;

  symbol = "";

  constructor() {
    super("Fetch Quote");
    this.width = 240;
    this.height = 200;

    this.addInput("exec", new ClassicPreset.Input(Sockets.exec, "Exec", false));
    this.addInput("symbol", new ClassicPreset.Input(Sockets.string, "Symbol"));

    this.addOutput("exec", new ClassicPreset.Output(Sockets.exec, "Next"));
    this.addOutput(
      "quote",
      new ClassicPreset.Output(Sockets.quoteData, "Quote")
    );
  }
}
