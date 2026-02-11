import { ClassicPreset } from "rete";
import { BaseNode, Sockets } from "../types";

export class FetchDatesNode extends BaseNode {
  category = "dataSource" as const;

  constructor() {
    super("Fetch Dates");
    this.width = 200;
    this.height = 140;

    this.addInput("exec", new ClassicPreset.Input(Sockets.exec, "Exec", false));

    this.addOutput("exec", new ClassicPreset.Output(Sockets.exec, "Next"));
    this.addOutput(
      "dates",
      new ClassicPreset.Output(Sockets.datesArray, "Dates")
    );
  }
}
