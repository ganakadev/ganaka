import { ClassicPreset } from "rete";
import { BaseNode, Sockets } from "../types";

export class FetchShortlistPersistenceNode extends BaseNode {
  category = "dataSource" as const;

  shortlistType: "TOP_GAINERS" | "VOLUME_SHOCKERS" = "TOP_GAINERS";
  startDatetime = "";
  endDatetime = "";

  constructor() {
    super("Fetch Shortlist Persistence");
    this.width = 280;
    this.height = 260;

    this.addInput("exec", new ClassicPreset.Input(Sockets.exec, "Exec", false));

    this.addOutput("exec", new ClassicPreset.Output(Sockets.exec, "Next"));
    this.addOutput(
      "results",
      new ClassicPreset.Output(Sockets.shortlistArray, "Instruments")
    );
  }
}
