"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickSeriesPartialOptions,
  SeriesMarker,
  Time,
  CandlestickSeries,
  createSeriesMarkers,
  CandlestickData,
  CrosshairMode,
} from "lightweight-charts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export type CandleData = CandlestickData<Time>;

interface CandleChartProps {
  symbol: string;
  selectedDate: Date | null;
  candleData: CandleData[] | null;
  loading?: boolean;
}

export function CandleChart({
  symbol,
  selectedDate,
  candleData,
  loading = false,
}: CandleChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const markersRef = useRef<ReturnType<
    typeof createSeriesMarkers<Time>
  > | null>(null);

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
      height: 400,

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
    console.log("Chart created");

    chartRef.current = chart;

    // Add candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
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
      // if (chart) {
      //   chart.remove();
      // }
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !candleData || candleData.length === 0) return;

    // Set candle data
    seriesRef.current.setData(candleData);

    // Fit content to show all candles
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [candleData]);

  useEffect(() => {
    if (
      !seriesRef.current ||
      !selectedDate ||
      !candleData ||
      candleData.length === 0
    ) {
      return;
    }

    // Convert selectedDate to Unix timestamp
    const selectedTimestamp = dayjs(selectedDate).unix();

    // Find the closest candle to the selected time
    // Our API returns Unix timestamps as numbers, so time is always a number
    const getTimeAsNumber = (time: Time): number => {
      return typeof time === "number" ? time : 0;
    };

    let closestCandle = candleData[0];
    const firstTime = getTimeAsNumber(candleData[0].time);
    let minDiff = Math.abs(firstTime - selectedTimestamp);

    for (const candle of candleData) {
      const candleTime = getTimeAsNumber(candle.time);
      const diff = Math.abs(candleTime - selectedTimestamp);
      if (diff < minDiff) {
        minDiff = diff;
        closestCandle = candle;
      }
    }

    // Create marker at the selected time
    // Time format should match the candle data format (Unix timestamp as number)
    const marker: SeriesMarker<Time> = {
      time: closestCandle.time,
      position: "inBar",
      color: "#2196F3",
      size: 1,
      shape: "circle",
      text: dayjs(selectedDate).format("HH:mm"),
    };

    // Set markers using the markers manager (v5 API)
    if (markersRef.current) {
      markersRef.current.setMarkers([marker]);
    }
  }, [selectedDate, candleData]);

  // DRAW
  return (
    <div className="border rounded-md p-4 pr-3 bg-black">
      <div className="mb-2">
        <h3 className="text-lg font-semibold">{symbol}</h3>
        <p className="text-sm text-gray-500">
          {selectedDate
            ? dayjs(selectedDate).format("DD MMM YYYY HH:mm")
            : "Select a date"}
        </p>
      </div>
      <div
        ref={chartContainerRef}
        className="w-full"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
}
