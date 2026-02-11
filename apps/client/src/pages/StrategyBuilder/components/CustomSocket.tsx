import { ClassicPreset } from "rete";
import { SOCKET_COLORS } from "../types";

export function CustomSocket(props: { data: ClassicPreset.Socket }) {
  const color = SOCKET_COLORS[props.data.name] || "#94a3b8";
  const isExec = props.data.name === "exec";

  return (
    <div
      style={{
        display: "inline-block",
        width: isExec ? 14 : 16,
        height: isExec ? 14 : 16,
        background: color,
        borderRadius: isExec ? 2 : "50%",
        border: "2px solid #1e293b",
        transform: isExec ? "rotate(45deg)" : "none",
        cursor: "pointer",
      }}
      title={props.data.name}
    />
  );
}
