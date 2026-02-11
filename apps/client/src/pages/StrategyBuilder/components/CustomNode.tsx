import { useCallback } from "react";
import { ClassicPreset } from "rete";
import { Presets } from "rete-react-plugin";
import {
  Text,
  TextInput,
  NumberInput,
  Select,
  Switch,
  Stack,
  MantineProvider,
  createTheme,
} from "@mantine/core";
import type { Schemes, BaseNode } from "../types";
import { NODE_CATEGORY_COLORS } from "../types";
import { StrategyConfigNode } from "../nodes/StrategyConfigNode";
import { FetchShortlistNode } from "../nodes/FetchShortlistNode";
import { FetchShortlistPersistenceNode } from "../nodes/FetchShortlistPersistenceNode";
import { FetchCandlesNode } from "../nodes/FetchCandlesNode";
import { FetchQuoteNode } from "../nodes/FetchQuoteNode";
import { PlaceOrderNode } from "../nodes/PlaceOrderNode";
import { ForEachNode } from "../nodes/ForEachNode";
import { ConditionalNode } from "../nodes/ConditionalNode";

const { RefSocket } = Presets.classic;

type NodeProps = {
  data: Schemes["Node"] & { width?: number; height?: number; selected?: boolean };
  emit: (props: any) => void;
};

// Prevent pointer events from propagating to the area plugin
const stop = (e: React.PointerEvent) => e.stopPropagation();

function sortByIndex(entries: [string, any][]) {
  entries.sort((a, b) => {
    const ai = a[1]?.index ?? 0;
    const bi = b[1]?.index ?? 0;
    return ai - bi;
  });
}

function SocketRow({
  side,
  socketKey,
  socket,
  label,
  nodeId,
  emit,
}: {
  side: "input" | "output";
  socketKey: string;
  socket: ClassicPreset.Socket;
  label?: string;
  nodeId: string;
  emit: (props: any) => void;
}) {
  const isInput = side === "input";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: isInput ? "flex-start" : "flex-end",
        position: "relative",
        padding: "4px 0",
      }}
    >
      <div
        style={{
          position: "absolute",
          [isInput ? "left" : "right"]: -20,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <RefSocket
          name={`${side}-socket`}
          side={side}
          socketKey={socketKey}
          nodeId={nodeId}
          emit={emit}
          payload={socket}
        />
      </div>
      {label && (
        <Text
          size="xs"
          c="dimmed"
          style={{
            [isInput ? "marginLeft" : "marginRight"]: 4,
            textAlign: isInput ? "left" : "right",
            flex: 1,
          }}
        >
          {label}
        </Text>
      )}
    </div>
  );
}

function NodeShell({
  data,
  emit,
  children,
}: {
  data: NodeProps["data"];
  emit: NodeProps["emit"];
  children: React.ReactNode;
}) {
  const inputs = Object.entries(data.inputs || {});
  const outputs = Object.entries(data.outputs || {});
  sortByIndex(inputs);
  sortByIndex(outputs);

  const node = data as BaseNode;
  const categoryColor = NODE_CATEGORY_COLORS[node.category] || "#475569";

  return (
    <div
      style={{
        background: "#1e293b",
        border: data.selected ? "2px solid #3b82f6" : "2px solid #334155",
        borderRadius: 8,
        minWidth: data.width || 220,
        fontFamily: "inherit",
        overflow: "visible",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: categoryColor,
          padding: "6px 12px",
          borderRadius: "6px 6px 0 0",
        }}
      >
        <Text size="sm" fw={600} c="white">
          {data.label}
        </Text>
      </div>

      {/* Outputs */}
      <div style={{ padding: "4px 16px 0" }}>
        {outputs.map(([key, output]) =>
          output ? (
            <SocketRow
              key={key}
              side="output"
              socketKey={key}
              socket={output.socket}
              label={output.label}
              nodeId={data.id}
              emit={emit}
            />
          ) : null
        )}
      </div>

      {/* Controls (inline Mantine forms) */}
      <div style={{ padding: "4px 12px" }}>{children}</div>

      {/* Inputs */}
      <div style={{ padding: "0 16px 8px" }}>
        {inputs.map(([key, input]) =>
          input ? (
            <SocketRow
              key={key}
              side="input"
              socketKey={key}
              socket={input.socket}
              label={input.label}
              nodeId={data.id}
              emit={emit}
            />
          ) : null
        )}
      </div>
    </div>
  );
}

// ── Per-node-type control forms ─────────────────────────────────────

function StrategyConfigControls({
  data,
  emit,
}: {
  data: StrategyConfigNode;
  emit: NodeProps["emit"];
}) {
  const update = useCallback(
    (fn: () => void) => {
      fn();
      emit({ type: "render", data: { type: "node", payload: data } });
    },
    [data, emit]
  );

  return (
    <Stack gap={4} onPointerDown={stop}>
      <TextInput
        size="xs"
        label="Start Time"
        value={data.startTime}
        onChange={(e) => update(() => (data.startTime = e.currentTarget.value))}
      />
      <TextInput
        size="xs"
        label="End Time"
        value={data.endTime}
        onChange={(e) => update(() => (data.endTime = e.currentTarget.value))}
      />
      <NumberInput
        size="xs"
        label="Interval (min)"
        value={data.intervalMinutes}
        onChange={(v) =>
          update(() => (data.intervalMinutes = typeof v === "number" ? v : 1))
        }
        min={1}
      />
      <TextInput
        size="xs"
        label="Name"
        placeholder="Optional"
        value={data.strategyName}
        onChange={(e) =>
          update(() => (data.strategyName = e.currentTarget.value))
        }
      />
    </Stack>
  );
}

function FetchShortlistControls({
  data,
  emit,
}: {
  data: FetchShortlistNode;
  emit: NodeProps["emit"];
}) {
  const update = useCallback(
    (fn: () => void) => {
      fn();
      emit({ type: "render", data: { type: "node", payload: data } });
    },
    [data, emit]
  );

  return (
    <Stack gap={4} onPointerDown={stop}>
      <Select
        size="xs"
        label="Type"
        data={["TOP_GAINERS", "VOLUME_SHOCKERS"]}
        value={data.shortlistType}
        onChange={(v) =>
          update(
            () =>
              (data.shortlistType = (v as "TOP_GAINERS" | "VOLUME_SHOCKERS") ?? "TOP_GAINERS")
          )
        }
        allowDeselect={false}
      />
      <Switch
        size="xs"
        label="Use currentTimestamp"
        checked={data.useCurrentTimestamp}
        onChange={(e) =>
          update(() => (data.useCurrentTimestamp = e.currentTarget.checked))
        }
      />
    </Stack>
  );
}

function FetchShortlistPersistenceControls({
  data,
  emit,
}: {
  data: FetchShortlistPersistenceNode;
  emit: NodeProps["emit"];
}) {
  const update = useCallback(
    (fn: () => void) => {
      fn();
      emit({ type: "render", data: { type: "node", payload: data } });
    },
    [data, emit]
  );

  return (
    <Stack gap={4} onPointerDown={stop}>
      <Select
        size="xs"
        label="Type"
        data={["TOP_GAINERS", "VOLUME_SHOCKERS"]}
        value={data.shortlistType}
        onChange={(v) =>
          update(
            () =>
              (data.shortlistType = (v as "TOP_GAINERS" | "VOLUME_SHOCKERS") ?? "TOP_GAINERS")
          )
        }
        allowDeselect={false}
      />
      <TextInput
        size="xs"
        label="Start Datetime"
        value={data.startDatetime}
        onChange={(e) =>
          update(() => (data.startDatetime = e.currentTarget.value))
        }
        placeholder="YYYY-MM-DDTHH:mm:ss"
      />
      <TextInput
        size="xs"
        label="End Datetime"
        value={data.endDatetime}
        onChange={(e) =>
          update(() => (data.endDatetime = e.currentTarget.value))
        }
        placeholder="YYYY-MM-DDTHH:mm:ss"
      />
    </Stack>
  );
}

function FetchCandlesControls({
  data,
  emit,
}: {
  data: FetchCandlesNode;
  emit: NodeProps["emit"];
}) {
  const update = useCallback(
    (fn: () => void) => {
      fn();
      emit({ type: "render", data: { type: "node", payload: data } });
    },
    [data, emit]
  );

  const intervals = [
    "1minute",
    "2minute",
    "3minute",
    "5minute",
    "10minute",
    "15minute",
    "30minute",
    "1hour",
    "4hour",
    "1day",
    "1week",
    "1month",
  ];

  return (
    <Stack gap={4} onPointerDown={stop}>
      <TextInput
        size="xs"
        label="Symbol"
        value={data.symbol}
        onChange={(e) => update(() => (data.symbol = e.currentTarget.value))}
        placeholder="e.g. RELIANCE"
      />
      <Select
        size="xs"
        label="Interval"
        data={intervals}
        value={data.interval}
        onChange={(v) =>
          update(() => (data.interval = (v ?? "1minute") as typeof data.interval))
        }
        allowDeselect={false}
      />
      <TextInput
        size="xs"
        label="Start Datetime"
        value={data.startDatetime}
        onChange={(e) =>
          update(() => (data.startDatetime = e.currentTarget.value))
        }
        placeholder="YYYY-MM-DDTHH:mm:ss"
      />
      <Switch
        size="xs"
        label="Use currentTimestamp as end"
        checked={data.useCurrentTimestampAsEnd}
        onChange={(e) =>
          update(
            () => (data.useCurrentTimestampAsEnd = e.currentTarget.checked)
          )
        }
      />
      {!data.useCurrentTimestampAsEnd && (
        <TextInput
          size="xs"
          label="End Datetime"
          value={data.endDatetime}
          onChange={(e) =>
            update(() => (data.endDatetime = e.currentTarget.value))
          }
          placeholder="YYYY-MM-DDTHH:mm:ss"
        />
      )}
    </Stack>
  );
}

function FetchQuoteControls({
  data,
  emit,
}: {
  data: FetchQuoteNode;
  emit: NodeProps["emit"];
}) {
  const update = useCallback(
    (fn: () => void) => {
      fn();
      emit({ type: "render", data: { type: "node", payload: data } });
    },
    [data, emit]
  );

  return (
    <Stack gap={4} onPointerDown={stop}>
      <TextInput
        size="xs"
        label="Symbol"
        value={data.symbol}
        onChange={(e) => update(() => (data.symbol = e.currentTarget.value))}
        placeholder="e.g. TARC"
      />
    </Stack>
  );
}

function PlaceOrderControls({
  data,
  emit,
}: {
  data: PlaceOrderNode;
  emit: NodeProps["emit"];
}) {
  const update = useCallback(
    (fn: () => void) => {
      fn();
      emit({ type: "render", data: { type: "node", payload: data } });
    },
    [data, emit]
  );

  return (
    <Stack gap={4} onPointerDown={stop}>
      <TextInput
        size="xs"
        label="Symbol"
        value={data.nseSymbol}
        onChange={(e) => update(() => (data.nseSymbol = e.currentTarget.value))}
        placeholder="From connection or manual"
      />
      <Select
        size="xs"
        label="Price Mode"
        data={[
          { value: "percentage", label: "% from entry" },
          { value: "manual", label: "Manual prices" },
        ]}
        value={data.priceMode}
        onChange={(v) =>
          update(
            () => (data.priceMode = (v as "manual" | "percentage") ?? "percentage")
          )
        }
        allowDeselect={false}
      />
      {data.priceMode === "percentage" ? (
        <>
          <NumberInput
            size="xs"
            label="Stop Loss %"
            value={data.stopLossPercent}
            onChange={(v) =>
              update(
                () => (data.stopLossPercent = typeof v === "number" ? v : 1.5)
              )
            }
            min={0}
            step={0.1}
            decimalScale={2}
          />
          <NumberInput
            size="xs"
            label="Take Profit %"
            value={data.takeProfitPercent}
            onChange={(v) =>
              update(
                () => (data.takeProfitPercent = typeof v === "number" ? v : 2)
              )
            }
            min={0}
            step={0.1}
            decimalScale={2}
          />
        </>
      ) : (
        <>
          <NumberInput
            size="xs"
            label="Entry Price"
            value={data.entryPrice}
            onChange={(v) =>
              update(() => (data.entryPrice = typeof v === "number" ? v : 0))
            }
          />
          <NumberInput
            size="xs"
            label="Stop Loss"
            value={data.stopLossPrice}
            onChange={(v) =>
              update(
                () => (data.stopLossPrice = typeof v === "number" ? v : 0)
              )
            }
          />
          <NumberInput
            size="xs"
            label="Take Profit"
            value={data.takeProfitPrice}
            onChange={(v) =>
              update(
                () => (data.takeProfitPrice = typeof v === "number" ? v : 0)
              )
            }
          />
        </>
      )}
      <Switch
        size="xs"
        label="Use currentTimestamp"
        checked={data.useCurrentTimestamp}
        onChange={(e) =>
          update(() => (data.useCurrentTimestamp = e.currentTarget.checked))
        }
      />
    </Stack>
  );
}

function ConditionalControls({
  data,
  emit,
}: {
  data: ConditionalNode;
  emit: NodeProps["emit"];
}) {
  const update = useCallback(
    (fn: () => void) => {
      fn();
      emit({ type: "render", data: { type: "node", payload: data } });
    },
    [data, emit]
  );

  const fields = [
    { value: "last_price", label: "Last Price" },
    { value: "volume", label: "Volume" },
    { value: "day_change_perc", label: "Day Change %" },
    { value: "open", label: "Open" },
    { value: "high", label: "High" },
    { value: "low", label: "Low" },
    { value: "close", label: "Close" },
  ];

  const operators = [">", "<", ">=", "<=", "==", "!="];

  return (
    <Stack gap={4} onPointerDown={stop}>
      <Select
        size="xs"
        label="Field"
        data={fields}
        value={data.field}
        onChange={(v) => update(() => (data.field = v ?? "last_price"))}
        allowDeselect={false}
      />
      <Select
        size="xs"
        label="Operator"
        data={operators}
        value={data.operator}
        onChange={(v) =>
          update(
            () => (data.operator = (v ?? ">") as typeof data.operator)
          )
        }
        allowDeselect={false}
      />
      <NumberInput
        size="xs"
        label="Compare Value"
        value={data.compareValue}
        onChange={(v) =>
          update(() => (data.compareValue = typeof v === "number" ? v : 0))
        }
        decimalScale={2}
      />
    </Stack>
  );
}

// ── Main custom node component ──────────────────────────────────────

function CustomNodeComponent(props: NodeProps) {
  const { data, emit } = props;

  const renderControls = () => {
    if (data instanceof StrategyConfigNode)
      return <StrategyConfigControls data={data} emit={emit} />;
    if (data instanceof FetchShortlistNode)
      return <FetchShortlistControls data={data} emit={emit} />;
    if (data instanceof FetchShortlistPersistenceNode)
      return <FetchShortlistPersistenceControls data={data} emit={emit} />;
    if (data instanceof FetchCandlesNode)
      return <FetchCandlesControls data={data} emit={emit} />;
    if (data instanceof FetchQuoteNode)
      return <FetchQuoteControls data={data} emit={emit} />;
    if (data instanceof PlaceOrderNode)
      return <PlaceOrderControls data={data} emit={emit} />;
    if (data instanceof ConditionalNode)
      return <ConditionalControls data={data} emit={emit} />;
    if (data instanceof ForEachNode) return null;
    // FetchDates and FetchHolidays have no controls
    return null;
  };

  return (
    <NodeShell data={data} emit={emit}>
      {renderControls()}
    </NodeShell>
  );
}

// ── Wrapper with MantineProvider for Rete's isolated React roots ────

const nodeTheme = createTheme({
  cursorType: "pointer",
});

export function CustomNodeComponentWithProvider(props: NodeProps) {
  return (
    <MantineProvider defaultColorScheme="dark" theme={nodeTheme}>
      <CustomNodeComponent data={props.data} emit={props.emit} />
    </MantineProvider>
  );
}
