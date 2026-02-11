import { ClassicPreset } from "rete";
import { BaseNode, Sockets } from "../types";

export class PlaceOrderNode extends BaseNode {
  category = "action" as const;

  nseSymbol = "";
  entryPrice = 0;
  stopLossPrice = 0;
  takeProfitPrice = 0;
  useCurrentTimestamp = true;

  // Price calculation mode: "manual" for fixed values, "percentage" for relative
  priceMode: "manual" | "percentage" = "percentage";
  stopLossPercent = 1.5;
  takeProfitPercent = 2;

  constructor() {
    super("Place Order");
    this.width = 260;
    this.height = 300;

    this.addInput("exec", new ClassicPreset.Input(Sockets.exec, "Exec", false));
    this.addInput(
      "nseSymbol",
      new ClassicPreset.Input(Sockets.string, "Symbol")
    );
    this.addInput(
      "entryPrice",
      new ClassicPreset.Input(Sockets.number, "Entry Price")
    );

    this.addOutput("exec", new ClassicPreset.Output(Sockets.exec, "Next"));
  }
}
