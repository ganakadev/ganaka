import { ClassicPreset } from "rete";
import { BaseNode, Sockets } from "../types";

export class FetchShortlistNode extends BaseNode {
  category = "dataSource" as const;

  shortlistType: "TOP_GAINERS" | "VOLUME_SHOCKERS" = "TOP_GAINERS";
  useCurrentTimestamp = true;

  constructor() {
    super("Fetch Shortlist");
    this.width = 240;
    this.height = 240;

    this.addInput("exec", new ClassicPreset.Input(Sockets.exec, "Exec", false));
    this.addInput("datetime", new ClassicPreset.Input(Sockets.string, "Datetime"));

    this.addOutput("exec", new ClassicPreset.Output(Sockets.exec, "Next"));
    this.addOutput(
      "results",
      new ClassicPreset.Output(Sockets.shortlistArray, "Results")
    );
  }
}
