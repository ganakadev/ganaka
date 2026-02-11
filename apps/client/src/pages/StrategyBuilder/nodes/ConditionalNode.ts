import { ClassicPreset } from "rete";
import { BaseNode, Sockets } from "../types";

export class ConditionalNode extends BaseNode {
  category = "logic" as const;

  field = "last_price";
  operator: ">" | "<" | ">=" | "<=" | "==" | "!=" = ">";
  compareValue = 0;

  constructor() {
    super("Conditional");
    this.width = 240;
    this.height = 260;

    this.addInput("exec", new ClassicPreset.Input(Sockets.exec, "Exec", false));
    this.addInput(
      "value",
      new ClassicPreset.Input(Sockets.quoteData, "Value")
    );

    this.addOutput("true", new ClassicPreset.Output(Sockets.exec, "True"));
    this.addOutput("false", new ClassicPreset.Output(Sockets.exec, "False"));
  }
}
