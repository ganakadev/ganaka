import { BaseNode } from "../types";
import { StrategyConfigNode } from "./StrategyConfigNode";
import { FetchShortlistNode } from "./FetchShortlistNode";
import { FetchShortlistPersistenceNode } from "./FetchShortlistPersistenceNode";
import { FetchCandlesNode } from "./FetchCandlesNode";
import { FetchQuoteNode } from "./FetchQuoteNode";
import { FetchDatesNode } from "./FetchDatesNode";
import { FetchHolidaysNode } from "./FetchHolidaysNode";
import { PlaceOrderNode } from "./PlaceOrderNode";
import { ForEachNode } from "./ForEachNode";
import { ConditionalNode } from "./ConditionalNode";

export {
  StrategyConfigNode,
  FetchShortlistNode,
  FetchShortlistPersistenceNode,
  FetchCandlesNode,
  FetchQuoteNode,
  FetchDatesNode,
  FetchHolidaysNode,
  PlaceOrderNode,
  ForEachNode,
  ConditionalNode,
};

export interface NodeRegistryEntry {
  label: string;
  category: "config" | "dataSource" | "logic" | "action";
  description: string;
  create: () => BaseNode;
}

export const NODE_REGISTRY: Record<string, NodeRegistryEntry> = {
  StrategyConfig: {
    label: "Strategy Config",
    category: "config",
    description: "Define start time, end time, and interval",
    create: () => new StrategyConfigNode(),
  },
  FetchShortlist: {
    label: "Fetch Shortlist",
    category: "dataSource",
    description: "Get top gainers or volume shockers",
    create: () => new FetchShortlistNode(),
  },
  FetchShortlistPersistence: {
    label: "Fetch Shortlist Persistence",
    category: "dataSource",
    description: "Get stocks appearing frequently in shortlists",
    create: () => new FetchShortlistPersistenceNode(),
  },
  FetchCandles: {
    label: "Fetch Candles",
    category: "dataSource",
    description: "Get OHLC candle data for a symbol",
    create: () => new FetchCandlesNode(),
  },
  FetchQuote: {
    label: "Fetch Quote",
    category: "dataSource",
    description: "Get live quote for a symbol",
    create: () => new FetchQuoteNode(),
  },
  FetchDates: {
    label: "Fetch Dates",
    category: "dataSource",
    description: "Get dates with available data",
    create: () => new FetchDatesNode(),
  },
  FetchHolidays: {
    label: "Fetch Holidays",
    category: "dataSource",
    description: "Get market holidays",
    create: () => new FetchHolidaysNode(),
  },
  PlaceOrder: {
    label: "Place Order",
    category: "action",
    description: "Place a trading order",
    create: () => new PlaceOrderNode(),
  },
  ForEach: {
    label: "For Each",
    category: "logic",
    description: "Loop over array data",
    create: () => new ForEachNode(),
  },
  Conditional: {
    label: "Conditional",
    category: "logic",
    description: "Branch based on a condition",
    create: () => new ConditionalNode(),
  },
};
