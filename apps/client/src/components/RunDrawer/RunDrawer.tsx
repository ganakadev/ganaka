import { Accordion, Drawer, NumberInput, Table, Text } from "@mantine/core";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import type { Time } from "lightweight-charts";
import { useMemo, useState } from "react";
import { dashboardAPI } from "../../store/api/dashboardApi";
import type { Order, Run } from "../../types";
import { useRTKNotifier } from "../../utils/hooks/useRTKNotifier";
import { convertUTCToIST, formatDateForAPI } from "../../utils/dateFormatting";
import {
  CandleChart,
  type CandleData,
  type PriceLineConfig,
  type SeriesMarkerConfig,
} from "../CandleChart";

dayjs.extend(utc);
dayjs.extend(timezone);

const StockChart = ({
  symbol,
  orders,
  runStartTime,
  isExpanded,
}: {
  symbol: string;
  orders: Order[];
  runStartTime: Date | string | null;
  isExpanded: boolean;
}) => {
  // API
  // Normalize runStartTime to date string for API: handle both Date objects and string values
  const runStartTimeDate =
    runStartTime === null || runStartTime === undefined
      ? null
      : typeof runStartTime === "string"
      ? new Date(runStartTime)
      : runStartTime;

  const getCandlesAPI = dashboardAPI.useGetCandlesQuery(
    {
      symbol: symbol,
      date: formatDateForAPI(runStartTimeDate),
      interval: "1minute",
    },
    {
      skip: !runStartTime || !isExpanded,
    }
  );
  useRTKNotifier({
    requestName: "Get Candles",
    error: getCandlesAPI.error,
  });

  // VARIABLES
  const candleData: CandleData[] | null = getCandlesAPI.data?.data.candles
    ? getCandlesAPI.data.data.candles.map((candle) => ({
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
      // Convert order timestamp (already UTC Date) to Unix timestamp and find closest candle
      const orderTime = convertUTCToIST(order.timestamp);
      // TODO: Find a better way to convert to Unix timestamp instead of converting to UTC and then to Unix timestamp
      const orderUnixTime = dayjs.utc(orderTime.format("YYYY-MM-DDTHH:mm:ss")).unix();
      let closestCandle = candleData[0];
      let minDiff = Infinity;

      for (const candle of candleData) {
        // Compare Unix timestamps directly (both are in UTC)
        const diff = Math.abs(orderUnixTime - (candle.time as number));
        if (diff < minDiff) {
          minDiff = diff;
          closestCandle = candle;
        }
      }

      // Use different colors for multiple orders
      const color = colors[index % colors.length];
      console.log("closestCandle.time", closestCandle.time);

      return {
        time: closestCandle.time,
        position: "belowBar" as const,
        color: color,
        size: 1,
        shape: "circle" as const,
        text: `Order: ₹${order.entryPrice.toFixed(2)}`,
      };
    });
  }, [orders, candleData]);

  // Transform orders into price lines format (stop loss and take profit)
  const priceLines: PriceLineConfig[] = useMemo(() => {
    if (!orders || orders.length === 0) {
      return [];
    }

    const priceLinesList: PriceLineConfig[] = [];

    orders.forEach((order, index) => {
      // Stop Loss price line - red color
      priceLinesList.push({
        price: order.stopLossPrice,
        color: "#ef5350", // red color matching chart's down color
        lineWidth: 1,
        lineStyle: 0, // solid line
        axisLabelVisible: true,
        title: `SL${index + 1 > 1 ? ` (Order ${index + 1})` : ""}: ₹${order.stopLossPrice.toFixed(
          2
        )}`,
      });

      // Take Profit price line - green color
      priceLinesList.push({
        price: order.takeProfitPrice,
        color: "#26a69a", // green color matching chart's up color
        lineWidth: 1,
        lineStyle: 0, // solid line
        axisLabelVisible: true,
        title: `TP${index + 1 > 1 ? ` (Order ${index + 1})` : ""}: ₹${order.takeProfitPrice.toFixed(
          2
        )}`,
      });
    });

    return priceLinesList;
  }, [orders]);

  const errorMessage = getCandlesAPI.error
    ? "data" in getCandlesAPI.error &&
      typeof getCandlesAPI.error.data === "object" &&
      getCandlesAPI.error.data !== null &&
      "error" in getCandlesAPI.error.data
      ? String(getCandlesAPI.error.data.error)
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
      <div className="border rounded-md p-4 h-[284px]">
        <Text size="sm" c="dimmed">
          Loading chart data...
        </Text>
      </div>
    );
  }

  // DRAW
  // Use a key based on symbol to force chart re-initialization when data becomes available
  return (
    <CandleChart
      key={symbol}
      candleData={candleData}
      seriesMarkers={seriesMarkers}
      priceLines={priceLines}
    />
  );
};

const RunOrdersPanel = ({ selectedRun }: { selectedRun: Run | null }) => {
  // STATE
  const [targetGainPercentage, setTargetGainPercentage] = useState<number | undefined>(2);
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
  // Parse UTC datetime strings from API responses
  // Date constructor correctly handles UTC strings in YYYY-MM-DDTHH:mm:ss format
  const orders: Order[] =
    runOrdersAPI.data?.data.map((order) => ({
      id: order.id,
      nseSymbol: order.nseSymbol,
      entryPrice: order.entryPrice,
      stopLossPrice: order.stopLossPrice,
      takeProfitPrice: order.takeProfitPrice,
      runId: order.runId,
      targetGainPercentage: order.targetGainPercentage,
      targetAchieved: order.targetAchieved,
      targetGainPercentageActual: order.targetGainPercentageActual,
      dynamicTakeProfitPrice: order.dynamicTakeProfitPrice,
      stopLossHit: order.stopLossHit,
      // API returns UTC datetime strings, Date constructor handles them correctly
      timestamp: new Date(order.timestamp),
      stopLossTimestamp: order.stopLossTimestamp ? new Date(order.stopLossTimestamp) : undefined,
      targetTimestamp: order.targetTimestamp ? new Date(order.targetTimestamp) : undefined,
      timeToStopLossMinutes: order.timeToStopLossMinutes,
      timeToTargetMinutes: order.timeToTargetMinutes,
    })) || [];
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
                    suffix="%"
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
                    // Priority: Stop loss status takes precedence over target achievement
                    order.stopLossHit === true ? (
                      <div className="flex flex-col gap-1">
                        <Text size="sm" fw={600} c="red">
                          {`✗ Stop Loss Hit in ${formatTime(order.timeToStopLossMinutes)} @ ${dayjs
                            .tz(order.stopLossTimestamp, "Asia/Kolkata")
                            .format("HH:mm")}`}
                        </Text>
                        {order.dynamicTakeProfitPrice !== undefined && (
                          <Text size="xs" c="dimmed">
                            Dynamic TP: ₹
                            {order.dynamicTakeProfitPrice.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Text>
                        )}
                      </div>
                    ) : order.targetAchieved !== undefined ? (
                      order.targetAchieved ? (
                        <div className="flex flex-col gap-1">
                          <Text size="sm" fw={600} c="green">
                            {`✓ Achieved in ${formatTime(order.timeToTargetMinutes)} @ ${dayjs
                              .tz(order.targetTimestamp, "Asia/Kolkata")
                              .format("HH:mm")}`}
                          </Text>
                          {order.dynamicTakeProfitPrice !== undefined && (
                            <Text size="xs" c="dimmed">
                              Dynamic TP: ₹
                              {order.dynamicTakeProfitPrice.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </Text>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <Text size="sm" fw={600} c="red">
                            ✗ Target not achieved
                          </Text>
                          {order.dynamicTakeProfitPrice !== undefined && (
                            <Text size="xs" c="dimmed">
                              Dynamic TP: ₹
                              {order.dynamicTakeProfitPrice.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </Text>
                          )}
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col gap-1">
                        <Text size="sm" c="dimmed">
                          N/A
                        </Text>
                        {order.dynamicTakeProfitPrice !== undefined && (
                          <Text size="xs" c="dimmed">
                            Dynamic TP: ₹
                            {order.dynamicTakeProfitPrice.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Text>
                        )}
                      </div>
                    )
                  ) : (
                    <Text size="sm" c="dimmed">
                      Enter target %
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <span className="text-sm">
                    {dayjs(convertUTCToIST(order.timestamp)).format("DD-MM-YYYY HH:mm:ss")}
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
                    isExpanded={expandedStocks.has(symbol)}
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
