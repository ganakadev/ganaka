import { ClassicPreset } from "rete";
import type { ClassicScheme, ReactArea2D } from "rete-react-plugin";

// ── Socket definitions ───────────────────────────────────────────────

export const Sockets = {
  exec: new ClassicPreset.Socket("exec"),
  shortlistArray: new ClassicPreset.Socket("shortlistArray"),
  shortlistItem: new ClassicPreset.Socket("shortlistItem"),
  candleData: new ClassicPreset.Socket("candleData"),
  quoteData: new ClassicPreset.Socket("quoteData"),
  string: new ClassicPreset.Socket("string"),
  number: new ClassicPreset.Socket("number"),
  datesArray: new ClassicPreset.Socket("datesArray"),
  holidaysArray: new ClassicPreset.Socket("holidaysArray"),
} as const;

// ── Socket colors (used by CustomSocket) ────────────────────────────

export const SOCKET_COLORS: Record<string, string> = {
  exec: "#94a3b8",
  shortlistArray: "#22c55e",
  shortlistItem: "#86efac",
  candleData: "#f97316",
  quoteData: "#3b82f6",
  string: "#a855f7",
  number: "#eab308",
  datesArray: "#14b8a6",
  holidaysArray: "#14b8a6",
};

// ── Node header colors by category ──────────────────────────────────

export const NODE_CATEGORY_COLORS: Record<string, string> = {
  config: "#475569",
  dataSource: "#1d4ed8",
  logic: "#15803d",
  action: "#b91c1c",
};

// ── Rete type scheme ────────────────────────────────────────────────

export class BaseNode extends ClassicPreset.Node {
  width = 240;
  height = 220;
  category: "config" | "dataSource" | "logic" | "action" = "dataSource";
}

// Rete's type system requires precise scheme alignment across plugins.
// ClassicScheme works for connection/render plugins but auto-arrange
// needs width/height on nodes. We use ClassicScheme as the base and
// cast where needed for auto-arrange compatibility.
export type Schemes = ClassicScheme;
export type AreaExtra = ReactArea2D<Schemes>;

// ── Connection compatibility ────────────────────────────────────────

const COMPATIBLE_SOCKETS: Record<string, string[]> = {
  exec: ["exec"],
  shortlistArray: ["shortlistArray"],
  shortlistItem: ["shortlistItem", "string"],
  candleData: ["candleData"],
  quoteData: ["quoteData"],
  string: ["string", "shortlistItem"],
  number: ["number"],
  datesArray: ["datesArray"],
  holidaysArray: ["holidaysArray"],
};

export function canConnect(
  sourceSocket: ClassicPreset.Socket,
  targetSocket: ClassicPreset.Socket
): boolean {
  const sourceType = sourceSocket.name;
  const targetType = targetSocket.name;
  if (sourceType === targetType) return true;
  return COMPATIBLE_SOCKETS[sourceType]?.includes(targetType) ?? false;
}
