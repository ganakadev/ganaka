import { ClassicPreset } from "rete";
import { BaseNode, Sockets } from "../types";

export class StrategyConfigNode extends BaseNode {
  category = "config" as const;

  startTime = "2026-01-05T09:15:00";
  endTime = "2026-01-05T15:30:00";
  intervalMinutes = 1;
  strategyName = "";
  tags: string[] = [];

  constructor() {
    super("Strategy Config");
    this.width = 260;
    this.height = 180;

    this.addOutput("exec", new ClassicPreset.Output(Sockets.exec, "Start"));
    this.addOutput(
      "currentTimestamp",
      new ClassicPreset.Output(Sockets.string, "Current Timestamp")
    );
  }
}
