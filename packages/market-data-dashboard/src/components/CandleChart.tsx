"use client";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  CandlestickData,
  CandlestickSeries,
  CandlestickSeriesPartialOptions,
  createChart,
  createSeriesMarkers,
  IChartApi,
  ISeriesApi,
  SeriesMarker,
  Time,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

export type CandleData = CandlestickData<Time>;

export function CandleChart({
  selectedDate,
  candleData,
}: {
  selectedDate: Date | null;
  candleData: CandleData[] | null;
}) {
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
      height: 250,
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

  useEffect(() => {
    if (
      !seriesRef.current ||
      !selectedDate ||
      !candleData ||
      candleData.length === 0
    ) {
      return;
    }

    // Convert selectedDate to dayjs object
    const selectedTime = dayjs(selectedDate).format("YYYY-MM-DDTHH:mm");
    let closestCandle = candleData[0];
    const firstCandleTime = dayjs
      .unix(candleData[30].time as number)
      .utc()
      .format("YYYY-MM-DDTHH:mm");
    let minDiff = Math.abs(
      dayjs(selectedTime).diff(dayjs(firstCandleTime), "minutes")
    );

    for (const candle of candleData) {
      const candleTime = dayjs
        .unix(candle.time as number)
        .utc()
        .format("YYYY-MM-DDTHH:mm");
      const diff = dayjs(selectedTime).diff(dayjs(candleTime), "minutes");

      if (Math.abs(diff) < minDiff) {
        minDiff = Math.abs(diff);
        closestCandle = candle;
      }
    }

    // Create marker at the selected time
    // Time format should match the candle data format (Unix timestamp as number)
    const marker: SeriesMarker<Time> = {
      time: closestCandle.time,
      position: "belowBar",
      color: "orange",
      size: 1,
      shape: "circle",
      text: "Selected Time",
    };

    // Set markers using the markers manager (v5 API)
    if (markersRef.current) {
      markersRef.current.setMarkers([marker]);
    }
  }, [selectedDate, candleData]);

  // DRAW
  return (
    <div className="border rounded-md p-4 pr-3 bg-black">
      <div ref={chartContainerRef} className="w-full min-h-[200px]" />
    </div>
  );
}
