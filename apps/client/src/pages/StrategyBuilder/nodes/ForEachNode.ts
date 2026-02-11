import { ClassicPreset } from "rete";
import { BaseNode, Sockets } from "../types";

export class ForEachNode extends BaseNode {
  category = "logic" as const;

  constructor() {
    super("For Each");
    this.width = 220;
    this.height = 180;

    this.addInput("exec", new ClassicPreset.Input(Sockets.exec, "Exec", false));
    this.addInput(
      "array",
      new ClassicPreset.Input(Sockets.shortlistArray, "Array")
    );

    this.addOutput("loopBody", new ClassicPreset.Output(Sockets.exec, "Loop Body"));
    this.addOutput(
      "item",
      new ClassicPreset.Output(Sockets.shortlistItem, "Current Item")
    );
    this.addOutput("done", new ClassicPreset.Output(Sockets.exec, "Done"));
  }
}
