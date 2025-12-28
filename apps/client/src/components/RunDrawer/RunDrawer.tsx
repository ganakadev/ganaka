import { Accordion, Drawer, NumberInput, Table, Text } from "@mantine/core";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import type { Time } from "lightweight-charts";
import { useMemo, useState } from "react";
import { dashboardAPI } from "../../store/api/dashboardApi";
import type { Order, Run } from "../../types";
import { useRTKNotifier } from "../../utils/hooks/useRTKNotifier";
import { CandleChart, type CandleData, type SeriesMarkerConfig } from "../CandleChart";

dayjs.extend(utc);
dayjs.extend(timezone);

const StockChart = ({
  symbol,
  orders,
  runStartTime,
}: {
  symbol: string;
  orders: Order[];
  runStartTime: Date | string | null;
}) => {
  // API
  // Normalize runStartTime to ISO string: handle both Date objects and string values
  const runStartTimeISO =
    runStartTime === null || runStartTime === undefined
      ? ""
      : typeof runStartTime === "string"
      ? runStartTime
      : runStartTime.toISOString();

  const { data: candlesData, error: candleError } = dashboardAPI.useGetCandlesQuery(
    {
      symbol: symbol,
      date: runStartTimeISO,
      interval: "1minute",
    },
    {
      skip: !runStartTime,
    }
  );
  useRTKNotifier({
    requestName: "Get Candles",
    error: candleError,
  });

  // VARIABLES
  const candleData: CandleData[] | null = candlesData?.data.candles
    ? candlesData.data.candles.map((candle) => ({
        time: candle.time as Time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }))
    : null;

  // Transform orders into series markers format
  const seriesMarkers: SeriesMarkerConfig[] = useMemo(() => {
    if (!orders || orders.length === 0 || !candleData || candleData.length === 0) {
      return [];
    }

    // Colors array for cycling through different orders
    const colors = ["#FFA500", "#00FFFF", "#FF00FF", "#FFFF00", "#00FF00"];

    // Create markers for each order
    return orders.map((order, index) => {
      // Convert order timestamp to dayjs and find closest candle
      const orderTime = dayjs(order.timestamp).format("YYYY-MM-DDTHH:mm");
      let closestCandle = candleData[0];
      let minDiff = Infinity;

      for (const candle of candleData) {
        const candleTime = dayjs
          .unix(candle.time as number)
          .utc()
          .format("YYYY-MM-DDTHH:mm");
        const diff = Math.abs(dayjs(orderTime).diff(dayjs(candleTime), "minutes"));

        if (diff < minDiff) {
          minDiff = diff;
          closestCandle = candle;
        }
      }

      // Use different colors for multiple orders
      const color = colors[index % colors.length];

      return {
        time: closestCandle.time,
        position: "belowBar" as const,
        color: color,
        size: 1,
        shape: "circle" as const,
        text: `Order ${index + 1}: ₹${order.entryPrice.toFixed(2)}`,
      };
    });
  }, [orders, candleData]);

  const errorMessage = candleError
    ? "data" in candleError &&
      typeof candleError.data === "object" &&
      candleError.data !== null &&
      "error" in candleError.data
      ? String(candleError.data.error)
      : "Failed to fetch candle data"
    : null;

  if (errorMessage) {
    return (
      <div className="border rounded-md p-4 bg-red-50">
        <p className="text-sm text-red-600">Error loading chart: {errorMessage}</p>
      </div>
    );
  }

  if (!candleData || candleData.length === 0) {
    return (
      <div className="border rounded-md p-4">
        <Text size="sm" c="dimmed">
          Loading chart data...
        </Text>
      </div>
    );
  }

  // DRAW
  // Use a key based on symbol to force chart re-initialization when data becomes available
  return <CandleChart key={symbol} candleData={candleData} seriesMarkers={seriesMarkers} />;
};

const RunOrdersPanel = ({ selectedRun }: { selectedRun: Run | null }) => {
  // STATE
  const [targetGainPercentage, setTargetGainPercentage] = useState<number | undefined>(undefined);
  const [expandedStocks, setExpandedStocks] = useState<Set<string>>(new Set());

  // API
  const runOrdersAPI = dashboardAPI.useGetRunOrdersQuery(
    {
      runId: selectedRun?.id || "",
      ...(targetGainPercentage !== undefined && { targetGainPercentage }),
    },
    {
      skip: !selectedRun,
    }
  );
  useRTKNotifier({
    requestName: "Get Run Orders",
    error: runOrdersAPI.error,
  });

  // VARIABLES
  const orders: Order[] = runOrdersAPI.data?.data || [];
  // Group orders by nseSymbol
  const ordersByStock = orders.reduce((acc, order) => {
    if (!acc[order.nseSymbol]) {
      acc[order.nseSymbol] = [];
    }
    acc[order.nseSymbol].push(order);
    return acc;
  }, {} as Record<string, Order[]>);
  const stockSymbols = Object.keys(ordersByStock);
  // Convert Set to array for Accordion value prop
  const accordionValue = Array.from(expandedStocks);

  // HANDLERS
  // Handle Accordion onChange - convert array back to Set
  const handleAccordionChange = (value: string | string[] | null) => {
    if (value === null) {
      setExpandedStocks(new Set());
    } else {
      const valueArray = Array.isArray(value) ? value : [value];
      setExpandedStocks(new Set(valueArray));
    }
  };

  // DRAW
  if (runOrdersAPI.isLoading) {
    return (
      <div className="p-4">
        <Text size="sm" c="dimmed">
          Loading orders...
        </Text>
      </div>
    );
  }

  if (runOrdersAPI.error) {
    const errorMessage =
      "data" in runOrdersAPI.error &&
      typeof runOrdersAPI.error.data === "object" &&
      runOrdersAPI.error.data !== null &&
      "error" in runOrdersAPI.error.data
        ? String(runOrdersAPI.error.data.error)
        : "Failed to fetch orders";
    return (
      <div className="border rounded-md p-4 bg-red-50">
        <p className="text-sm text-red-600">Error: {errorMessage}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-4">
        <Text size="sm" c="dimmed">
          No orders found for this run
        </Text>
      </div>
    );
  }

  // Helper function to format time
  const formatTime = (minutes?: number): string => {
    if (minutes === undefined || minutes === null) return "N/A";
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
  };

  // DRAW
  return (
    <div className="flex flex-col gap-6">
      {/* Orders Table */}
      <div>
        <h3 className="text-lg font-semibold mb-2">All Orders</h3>
        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          tabularNums
          style={{ tableLayout: "fixed" }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="w-[10%]">Symbol</Table.Th>
              <Table.Th className="w-[12%]">Entry Price</Table.Th>
              <Table.Th className="w-[12%]">Stop Loss</Table.Th>
              <Table.Th className="w-[12%]">Take Profit</Table.Th>
              <Table.Th className="w-[20%]">
                <div className="w-full h-full flex items-center justify-between">
                  <span>Target Status</span>
                  <NumberInput
                    placeholder="x%"
                    value={targetGainPercentage}
                    size="xs"
                    variant="filled"
                    onChange={(value) =>
                      setTargetGainPercentage(typeof value === "number" ? value : undefined)
                    }
                    min={0}
                    max={100}
                    step={0.1}
                    className="w-16"
                    decimalScale={2}
                  />
                </div>
              </Table.Th>
              <Table.Th className="w-[12%]">Timestamp</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {orders.map((order) => (
              <Table.Tr key={order.id}>
                <Table.Td>
                  <span className="font-medium">{order.nseSymbol}</span>
                </Table.Td>
                <Table.Td>
                  <span className="text-sm">
                    ₹
                    {order.entryPrice.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </Table.Td>
                <Table.Td>
                  <span className="text-sm">
                    ₹
                    {order.stopLossPrice.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </Table.Td>
                <Table.Td>
                  <span className="text-sm">
                    ₹
                    {order.takeProfitPrice.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </Table.Td>
                <Table.Td>
                  {targetGainPercentage !== undefined ? (
                    order.targetAchieved !== undefined ? (
                      order.targetAchieved ? (
                        <div className="flex flex-col">
                          <Text size="sm" fw={600} c="green">
                            {`✓ Achieved in ${formatTime(order.timeToTargetMinutes)} @ ${dayjs
                              .tz(order.targetTimestamp, "Asia/Kolkata")
                              .format("HH:mm")}`}
                          </Text>
                        </div>
                      ) : (
                        <Text size="sm" fw={600} c="red">
                          ✗ Target not achieved
                        </Text>
                      )
                    ) : (
                      <Text size="sm" c="dimmed">
                        N/A
                      </Text>
                    )
                  ) : (
                    <Text size="sm" c="dimmed">
                      Enter target %
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <span className="text-sm">
                    {dayjs(order.timestamp).format("DD-MM-YYYY HH:mm:ss")}
                  </span>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>

      {/* Expandable Charts by Stock */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Charts by Stock</h3>
        <Accordion
          multiple
          value={accordionValue}
          variant="separated"
          onChange={handleAccordionChange}
          className="flex flex-col gap-4"
        >
          {stockSymbols.map((symbol) => {
            const stockOrders = ordersByStock[symbol];
            return (
              <Accordion.Item key={symbol} value={symbol} className="mt-0!">
                <Accordion.Control>
                  <div className="flex items-center justify-between w-full h-full pr-4">
                    <Text fw={600}>{symbol}</Text>
                    <Text fw={600}>
                      {stockOrders.length} {stockOrders.length === 1 ? "order" : "orders"}
                    </Text>
                  </div>
                </Accordion.Control>
                <Accordion.Panel>
                  <StockChart
                    symbol={symbol}
                    orders={stockOrders}
                    runStartTime={selectedRun?.startTime || null}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

export const RunOrdersDrawer = ({
  opened,
  onClose,
  selectedRun,
}: {
  opened: boolean;
  onClose: () => void;
  selectedRun: Run | null;
}) => {
  // VARIABLES
  const drawerTitle = selectedRun ? (
    <div className="flex flex-col gap-1">
      <h4 className="text-lg font-semibold">Run Orders</h4>
      <span className="text-sm text-gray-500">
        {dayjs(selectedRun.startTime).format("DD-MM-YYYY HH:mm")} -{" "}
        {dayjs(selectedRun.endTime).format("HH:mm")}
      </span>
    </div>
  ) : (
    "Run Orders"
  );

  // DRAW
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="90%"
      title={drawerTitle}
      padding="lg"
    >
      {selectedRun && <RunOrdersPanel selectedRun={selectedRun} />}
    </Drawer>
  );
};
