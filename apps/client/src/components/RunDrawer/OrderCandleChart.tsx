import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
    type CandlestickData,
    CandlestickSeries,
    type CandlestickSeriesPartialOptions,
    createChart,
    createSeriesMarkers,
    type IChartApi,
    type ISeriesApi,
    type SeriesMarker,
    type Time
} from "lightweight-charts";
import { useEffect, useRef } from "react";
import type { Order } from "../types";

dayjs.extend(utc);
dayjs.extend(timezone);

export type CandleData = CandlestickData<Time>;

export function OrderCandleChart({
  candleData,
  orders,
}: {
  selectedDate: Date | null;
  candleData: CandleData[] | null;
  orders: Order[];
}) {
  // HOOKS
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const markersRef = useRef<ReturnType<
    typeof createSeriesMarkers<Time>
  > | null>(null);

  // EFFECTS
  // creates the chart
  useEffect(() => {
    if (!chartContainerRef.current || chartRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        textColor: "white",
        attributionLogo: false,
        background: { color: "black" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 250,
      leftPriceScale: {
        visible: true,
        borderColor: "rgba(255, 255, 255, 0.2)",
      },
      rightPriceScale: {
        visible: false,
        borderColor: "rgba(255, 255, 255, 0.2)",
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      grid: {
        horzLines: {
          visible: false,
        },
        vertLines: {
          visible: false,
        },
      },
    });

    chartRef.current = chart;

    // Add candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: true,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      priceLineVisible: false,
      priceScaleId: "left",
    } as CandlestickSeriesPartialOptions);

    seriesRef.current = candlestickSeries;

    // Create series markers manager
    markersRef.current = createSeriesMarkers(candlestickSeries, []);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // sets the candle data
  useEffect(() => {
    if (!seriesRef.current || !candleData || candleData.length === 0) return;

    // eliminate candles that have duplicate times
    const uniqueCandles = candleData.filter(
      (candle, index, self) =>
        index === self.findIndex((t) => t.time === candle.time)
    );

    // Set candle data
    seriesRef.current.setData(uniqueCandles);

    // Fit content to show all candles
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [candleData]);

  // adds markers for orders
  useEffect(() => {
    if (
      !seriesRef.current ||
      !candleData ||
      candleData.length === 0 ||
      !orders ||
      orders.length === 0 ||
      !markersRef.current
    ) {
      return;
    }

    // Create markers for each order
    const orderMarkers: SeriesMarker<Time>[] = orders.map((order, index) => {
      // Convert order timestamp to dayjs and find closest candle
      const orderTime = dayjs(order.timestamp).format("YYYY-MM-DDTHH:mm");
      let closestCandle = candleData[0];
      let minDiff = Infinity;

      for (const candle of candleData) {
        const candleTime = dayjs
          .unix(candle.time as number)
          .utc()
          .format("YYYY-MM-DDTHH:mm");
        const diff = Math.abs(
          dayjs(orderTime).diff(dayjs(candleTime), "minutes")
        );

        if (diff < minDiff) {
          minDiff = diff;
          closestCandle = candle;
        }
      }

      // Use different colors for multiple orders
      const colors = ["#FFA500", "#00FFFF", "#FF00FF", "#FFFF00", "#00FF00"];
      const color = colors[index % colors.length];

      return {
        time: closestCandle.time,
        position: "belowBar",
        color: color,
        size: 1,
        shape: "circle",
        text: `Order ${index + 1}: ₹${order.entryPrice.toFixed(2)}`,
      };
    });

    // Set markers using the markers manager
    markersRef.current.setMarkers(orderMarkers);
  }, [orders, candleData]);

  // DRAW
  return (
    <div className="border rounded-md p-4 pr-4 bg-black">
      <div ref={chartContainerRef} className="w-full min-h-[200px]" />
    </div>
  );
}

