import { NodeEditor } from "rete";
import type { Schemes } from "./types";
import { StrategyConfigNode } from "./nodes/StrategyConfigNode";
import { FetchShortlistNode } from "./nodes/FetchShortlistNode";
import { FetchShortlistPersistenceNode } from "./nodes/FetchShortlistPersistenceNode";
import { FetchCandlesNode } from "./nodes/FetchCandlesNode";
import { FetchQuoteNode } from "./nodes/FetchQuoteNode";
import { FetchDatesNode } from "./nodes/FetchDatesNode";
import { FetchHolidaysNode } from "./nodes/FetchHolidaysNode";
import { PlaceOrderNode } from "./nodes/PlaceOrderNode";
import { ForEachNode } from "./nodes/ForEachNode";
import { ConditionalNode } from "./nodes/ConditionalNode";

// ── Code generation context ─────────────────────────────────────────

class CodegenContext {
  private varCounters: Record<string, number> = {};
  // Maps nodeId -> { outputKey -> variable expression }
  private outputVars: Map<string, Record<string, string>> = new Map();
  private usedCallbacks: Set<string> = new Set();

  nextVar(prefix: string): string {
    const count = (this.varCounters[prefix] ?? 0) + 1;
    this.varCounters[prefix] = count;
    return count === 1 ? prefix : `${prefix}${count}`;
  }

  setOutputVar(nodeId: string, outputKey: string, varName: string) {
    const existing = this.outputVars.get(nodeId) ?? {};
    existing[outputKey] = varName;
    this.outputVars.set(nodeId, existing);
  }

  getOutputVar(nodeId: string, outputKey: string): string | undefined {
    return this.outputVars.get(nodeId)?.[outputKey];
  }

  useCallback(name: string) {
    this.usedCallbacks.add(name);
  }

  getUsedCallbacks(): string[] {
    const order = [
      "fetchShortlist",
      "fetchShortlistPersistence",
      "fetchCandles",
      "fetchQuote",
      "fetchDates",
      "fetchHolidays",
      "placeOrder",
      "currentTimestamp",
    ];
    return order.filter((cb) => this.usedCallbacks.has(cb));
  }
}

// ── Helpers ──────────────────────────────────────────────────────────

function indent(code: string, spaces = 2): string {
  const pad = " ".repeat(spaces);
  return code
    .split("\n")
    .map((line) => (line.trim() ? pad + line : line))
    .join("\n");
}

/**
 * Given a node and an input key, find the connected output's variable expression.
 * Returns undefined if the input is not connected.
 */
function resolveInputVar(
  editor: NodeEditor<Schemes>,
  nodeId: string,
  inputKey: string,
  ctx: CodegenContext
): string | undefined {
  const connections = editor.getConnections();
  const conn = connections.find(
    (c) => c.target === nodeId && c.targetInput === inputKey
  );
  if (!conn) return undefined;
  return ctx.getOutputVar(conn.source, conn.sourceOutput);
}

/**
 * Follow exec connections from a node's exec output to find the next node.
 */
function getNextExecNode(
  editor: NodeEditor<Schemes>,
  nodeId: string,
  outputKey: string
): Schemes["Node"] | undefined {
  const connections = editor.getConnections();
  const conn = connections.find(
    (c) => c.source === nodeId && c.sourceOutput === outputKey
  );
  if (!conn) return undefined;
  return editor.getNode(conn.target);
}

/**
 * Walk the exec chain starting from a node's exec output,
 * generating code for each node encountered.
 */
function emitExecChain(
  editor: NodeEditor<Schemes>,
  startNodeId: string,
  execOutputKey: string,
  ctx: CodegenContext
): string {
  const lines: string[] = [];
  let currentNode = getNextExecNode(editor, startNodeId, execOutputKey);

  while (currentNode) {
    const code = emitNode(editor, currentNode, ctx);
    if (code) lines.push(code);

    // Follow the exec output to the next node
    // For ForEach, we follow "done"; for Conditional, we stop
    // (branches are handled within emitNode)
    if (currentNode instanceof ForEachNode) {
      currentNode = getNextExecNode(editor, currentNode.id, "done");
    } else if (currentNode instanceof ConditionalNode) {
      // Conditional branches are emitted inside emitNode, stop here
      break;
    } else {
      currentNode = getNextExecNode(editor, currentNode.id, "exec");
    }
  }

  return lines.join("\n\n");
}

// ── Per-node code emitters ──────────────────────────────────────────

function emitNode(
  editor: NodeEditor<Schemes>,
  node: Schemes["Node"],
  ctx: CodegenContext
): string {
  if (node instanceof FetchShortlistNode)
    return emitFetchShortlist(editor, node, ctx);
  if (node instanceof FetchShortlistPersistenceNode)
    return emitFetchShortlistPersistence(editor, node, ctx);
  if (node instanceof FetchCandlesNode)
    return emitFetchCandles(editor, node, ctx);
  if (node instanceof FetchQuoteNode) return emitFetchQuote(editor, node, ctx);
  if (node instanceof FetchDatesNode) return emitFetchDates(editor, node, ctx);
  if (node instanceof FetchHolidaysNode)
    return emitFetchHolidays(editor, node, ctx);
  if (node instanceof PlaceOrderNode) return emitPlaceOrder(editor, node, ctx);
  if (node instanceof ForEachNode) return emitForEach(editor, node, ctx);
  if (node instanceof ConditionalNode)
    return emitConditional(editor, node, ctx);
  return "";
}

function emitFetchShortlist(
  editor: NodeEditor<Schemes>,
  node: FetchShortlistNode,
  ctx: CodegenContext
): string {
  ctx.useCallback("fetchShortlist");
  const varName = ctx.nextVar("shortlist");
  ctx.setOutputVar(node.id, "results", varName);

  let datetimeExpr: string;
  const connectedDatetime = resolveInputVar(editor, node.id, "datetime", ctx);
  if (connectedDatetime) {
    datetimeExpr = connectedDatetime;
  } else if (node.useCurrentTimestamp) {
    ctx.useCallback("currentTimestamp");
    datetimeExpr = "currentTimestamp";
  } else {
    datetimeExpr = `"${node.label}"`;
  }

  return `const ${varName} = await fetchShortlist({\n  type: "${node.shortlistType}",\n  datetime: ${datetimeExpr},\n});`;
}

function emitFetchShortlistPersistence(
  _editor: NodeEditor<Schemes>,
  node: FetchShortlistPersistenceNode,
  ctx: CodegenContext
): string {
  ctx.useCallback("fetchShortlistPersistence");
  const varName = ctx.nextVar("persistence");
  ctx.setOutputVar(node.id, "results", `${varName}?.instruments ?? []`);

  return `const ${varName} = await fetchShortlistPersistence({\n  type: "${node.shortlistType}",\n  start_datetime: "${node.startDatetime}",\n  end_datetime: "${node.endDatetime}",\n});`;
}

function emitFetchCandles(
  editor: NodeEditor<Schemes>,
  node: FetchCandlesNode,
  ctx: CodegenContext
): string {
  ctx.useCallback("fetchCandles");
  const varName = ctx.nextVar("candles");
  ctx.setOutputVar(node.id, "candles", varName);

  const symbolExpr =
    resolveInputVar(editor, node.id, "symbol", ctx) ??
    `"${node.symbol}"`;

  let endExpr: string;
  if (node.useCurrentTimestampAsEnd) {
    ctx.useCallback("currentTimestamp");
    endExpr = "currentTimestamp";
  } else {
    endExpr = `"${node.endDatetime}"`;
  }

  return `const ${varName} = await fetchCandles({\n  symbol: ${symbolExpr},\n  interval: "${node.interval}",\n  start_datetime: "${node.startDatetime}",\n  end_datetime: ${endExpr},\n});`;
}

function emitFetchQuote(
  editor: NodeEditor<Schemes>,
  node: FetchQuoteNode,
  ctx: CodegenContext
): string {
  ctx.useCallback("fetchQuote");
  const varName = ctx.nextVar("quote");
  ctx.setOutputVar(node.id, "quote", varName);

  const symbolExpr =
    resolveInputVar(editor, node.id, "symbol", ctx) ??
    `"${node.symbol}"`;

  return `const ${varName} = await fetchQuote({\n  symbol: ${symbolExpr},\n});`;
}

function emitFetchDates(
  _editor: NodeEditor<Schemes>,
  node: FetchDatesNode,
  ctx: CodegenContext
): string {
  ctx.useCallback("fetchDates");
  const varName = ctx.nextVar("dates");
  ctx.setOutputVar(node.id, "dates", varName);

  return `const ${varName} = await fetchDates();`;
}

function emitFetchHolidays(
  _editor: NodeEditor<Schemes>,
  node: FetchHolidaysNode,
  ctx: CodegenContext
): string {
  ctx.useCallback("fetchHolidays");
  const varName = ctx.nextVar("holidays");
  ctx.setOutputVar(node.id, "holidays", varName);

  return `const ${varName} = await fetchHolidays();`;
}

function emitPlaceOrder(
  editor: NodeEditor<Schemes>,
  node: PlaceOrderNode,
  ctx: CodegenContext
): string {
  ctx.useCallback("placeOrder");

  const symbolExpr =
    resolveInputVar(editor, node.id, "nseSymbol", ctx) ??
    `"${node.nseSymbol}"`;

  const entryPriceExpr =
    resolveInputVar(editor, node.id, "entryPrice", ctx);

  let datetimeExpr: string;
  if (node.useCurrentTimestamp) {
    ctx.useCallback("currentTimestamp");
    datetimeExpr = "currentTimestamp";
  } else {
    datetimeExpr = '"YYYY-MM-DDTHH:mm:ss"';
  }

  if (node.priceMode === "percentage" && entryPriceExpr) {
    // Calculate SL/TP from percentages relative to entry price
    return [
      `await placeOrder({`,
      `  nseSymbol: ${symbolExpr},`,
      `  entryPrice: ${entryPriceExpr},`,
      `  stopLossPrice: ${entryPriceExpr} * ${(1 - node.stopLossPercent / 100).toFixed(4)},`,
      `  takeProfitPrice: ${entryPriceExpr} * ${(1 + node.takeProfitPercent / 100).toFixed(4)},`,
      `  datetime: ${datetimeExpr},`,
      `});`,
    ].join("\n");
  }

  if (node.priceMode === "manual") {
    return [
      `await placeOrder({`,
      `  nseSymbol: ${symbolExpr},`,
      `  entryPrice: ${node.entryPrice},`,
      `  stopLossPrice: ${node.stopLossPrice},`,
      `  takeProfitPrice: ${node.takeProfitPrice},`,
      `  datetime: ${datetimeExpr},`,
      `});`,
    ].join("\n");
  }

  // Percentage mode with no connected entry price — use placeholder
  return [
    `// TODO: connect an entry price input to PlaceOrder node`,
    `await placeOrder({`,
    `  nseSymbol: ${symbolExpr},`,
    `  entryPrice: 0, // wire entry price from upstream node`,
    `  stopLossPrice: 0,`,
    `  takeProfitPrice: 0,`,
    `  datetime: ${datetimeExpr},`,
    `});`,
  ].join("\n");
}

function emitForEach(
  editor: NodeEditor<Schemes>,
  node: ForEachNode,
  ctx: CodegenContext
): string {
  const arrayExpr =
    resolveInputVar(editor, node.id, "array", ctx) ?? "[]";
  const itemVar = ctx.nextVar("item");
  ctx.setOutputVar(node.id, "item", `${itemVar}.nseSymbol`);

  // Also provide full item access for nodes that need more than nseSymbol
  const bodyCode = emitExecChain(editor, node.id, "loopBody", ctx);

  return `for (const ${itemVar} of ${arrayExpr} ?? []) {\n${indent(bodyCode)}\n}`;
}

function emitConditional(
  editor: NodeEditor<Schemes>,
  node: ConditionalNode,
  ctx: CodegenContext
): string {
  const valueExpr =
    resolveInputVar(editor, node.id, "value", ctx) ?? "null";

  // Build the condition expression
  // The value could be a quote object, candle data, etc.
  // We access the field and compare
  let fieldAccess: string;
  if (valueExpr.includes("quote") || valueExpr.includes("Quote")) {
    fieldAccess = `${valueExpr}?.payload?.${node.field}`;
  } else if (valueExpr.includes("candle") || valueExpr.includes("Candle")) {
    // For candle data, access the last candle
    const candleIndex =
      node.field === "close"
        ? 4
        : node.field === "open"
          ? 1
          : node.field === "high"
            ? 2
            : node.field === "low"
              ? 3
              : node.field === "volume"
                ? 5
                : 4;
    fieldAccess = `${valueExpr}?.payload?.candles?.slice(-1)?.[0]?.[${candleIndex}]`;
  } else {
    fieldAccess = `${valueExpr}?.${node.field}`;
  }

  const condition = `${fieldAccess} ${node.operator} ${node.compareValue}`;

  const trueCode = emitExecChain(editor, node.id, "true", ctx);
  const falseCode = emitExecChain(editor, node.id, "false", ctx);

  let code = `if (${condition}) {\n${indent(trueCode)}\n}`;
  if (falseCode.trim()) {
    code += ` else {\n${indent(falseCode)}\n}`;
  }

  return code;
}

// ── Main entry point ────────────────────────────────────────────────

export function generateCode(editor: NodeEditor<Schemes>): string {
  const nodes = editor.getNodes();
  const configNode = nodes.find(
    (n) => n instanceof StrategyConfigNode
  ) as StrategyConfigNode | undefined;

  if (!configNode) {
    return "// Error: No Strategy Config node found. Add one to define your strategy.";
  }

  const ctx = new CodegenContext();
  ctx.useCallback("currentTimestamp"); // always available

  // Walk the exec chain from the config node
  const bodyCode = emitExecChain(editor, configNode.id, "exec", ctx);

  if (!bodyCode.trim()) {
    return "// No nodes connected to Strategy Config. Connect nodes to build your strategy.";
  }

  const callbacks = ctx.getUsedCallbacks();
  const destructure = callbacks.join(", ");

  const nameLine = configNode.strategyName
    ? `\n  name: "${configNode.strategyName}",`
    : "";
  const tagsLine =
    configNode.tags.length > 0
      ? `\n  tags: ${JSON.stringify(configNode.tags)},`
      : "";

  return `import { ganaka } from "@ganaka/sdk";

await ganaka({
  fn: async ({ ${destructure} }) => {
${indent(bodyCode, 4)}
  },
  startTime: "${configNode.startTime}",
  endTime: "${configNode.endTime}",
  intervalMinutes: ${configNode.intervalMinutes},${nameLine}${tagsLine}
});
`;
}
