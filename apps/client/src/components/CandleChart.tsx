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
  HistogramSeries,
  type HistogramSeriesPartialOptions,
  type SeriesMarker,
  type Time,
} from "lightweight-charts";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

export type CandleData = CandlestickData<Time>;

export interface HistogramSeriesConfig {
  data: Array<{ time: Time; value: number; color?: string }>;
  priceScaleId?: string; // empty string for overlay
  scaleMargins?: { top: number; bottom: number };
  priceFormat?: { type: "volume" | "price" };
}

export interface SeriesMarkerConfig {
  time: Time;
  position: "aboveBar" | "belowBar" | "inBar";
  color: string;
  size: number;
  shape: "circle" | "square" | "arrowUp" | "arrowDown";
  text?: string;
}

export interface PriceLineConfig {
  price: number;
  color: string;
  lineWidth: number;
  lineStyle: 0 | 1 | 2 | 3; // 0 = solid, 1 = dotted, 2 = dashed, 3 = large dashed
  axisLabelVisible: boolean;
  title?: string;
}

export interface CandleChartProps {
  candleData: CandleData[] | null;
  histogramSeries?: HistogramSeriesConfig[];
  seriesMarkers?: SeriesMarkerConfig[];
  priceLines?: PriceLineConfig[];
  height?: number;
}

export function CandleChart({
  candleData,
  histogramSeries = [],
  seriesMarkers = [],
  priceLines = [],
  height = 250,
}: CandleChartProps) {
  // HOOKS
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const histogramSeriesRefsRef = useRef<Array<ISeriesApi<"Histogram"> | null>>([]);
  const markersRef = useRef<ReturnType<typeof createSeriesMarkers<Time>> | null>(null);
  const priceLinesRef = useRef<Array<ReturnType<ISeriesApi<"Candlestick">["createPriceLine"]>>>([]);

  // STATE
  const [containerReady, setContainerReady] = useState(false);
  // Set up ResizeObserver to detect when container has dimensions
  useLayoutEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    // Set up ResizeObserver to track container dimensions
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerReady(true);
        }
      }
    });

    resizeObserver.observe(container);
    resizeObserverRef.current = resizeObserver;

    // Check if container already has dimensions (defer to avoid synchronous setState)
    requestAnimationFrame(() => {
      if (container.clientWidth > 0) {
        setContainerReady(true);
      }
    });

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      resizeObserverRef.current = null;
    };
  }, []);

  // Initialize or update chart when container is ready and data is available
  const initializeChart = useCallback(() => {
    if (!chartContainerRef.current || !candleData || candleData.length === 0) return;

    const chart = chartRef.current;

    // CREATE CHART if it doesn't exist
    if (!chart) {
      const newChart = createChart(chartContainerRef.current, {
        layout: {
          textColor: "white",
          attributionLogo: false,
          background: { color: "black" },
        },
        width: chartContainerRef.current.clientWidth,
        height: height,
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
      chartRef.current = newChart;

      // ADDING CANDLESTICK SERIES
      const newCandlestickSeries = newChart.addSeries(CandlestickSeries, {
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: true,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
        priceLineVisible: false,
        priceScaleId: "left",
      } as CandlestickSeriesPartialOptions);
      seriesRef.current = newCandlestickSeries;

      // CREATE MARKERS MANAGER
      markersRef.current = createSeriesMarkers(newCandlestickSeries, []);
    }

    // Get current chart and series (either newly created or existing)
    const currentChart = chartRef.current!;
    const currentCandlestickSeries = seriesRef.current!;

    // SETTING/UPDATE CANDLE DATA
    // eliminate candles that have duplicate times
    const uniqueCandles = candleData.filter(
      (candle, index, self) => index === self.findIndex((t) => t.time === candle.time)
    );
    currentCandlestickSeries.setData(uniqueCandles);

    // UPDATE HISTOGRAM SERIES
    const currentHistogramRefs = histogramSeriesRefsRef.current;
    if (histogramSeries && histogramSeries.length > 0) {
      // Remove existing histogram series if count doesn't match
      if (currentHistogramRefs.length !== histogramSeries.length) {
        currentHistogramRefs.forEach((ref) => {
          if (ref) currentChart.removeSeries(ref);
        });
        histogramSeriesRefsRef.current = [];

        // Recreate histogram series
        const histogramSeriesRefs: Array<ISeriesApi<"Histogram"> | null> = [];
        histogramSeries.forEach((config) => {
          const histogramSeriesInstance = currentChart.addSeries(HistogramSeries, {
            priceFormat: config.priceFormat || {
              type: "volume",
            },
            priceScaleId: config.priceScaleId ?? "", // default to overlay
          } as HistogramSeriesPartialOptions);

          // Configure scale margins if provided
          if (config.scaleMargins) {
            histogramSeriesInstance.priceScale().applyOptions({
              scaleMargins: config.scaleMargins,
            });
          }

          histogramSeriesRefs.push(histogramSeriesInstance);
        });
        histogramSeriesRefsRef.current = histogramSeriesRefs;
      }

      // SETTING/UPDATE HISTOGRAM DATA
      histogramSeries.forEach((config, index) => {
        const histogramSeriesRef = histogramSeriesRefsRef.current[index];
        if (!histogramSeriesRef || !config.data || config.data.length === 0) {
          return;
        }

        // eliminate data points that have duplicate times
        const uniqueData = config.data.filter(
          (point, idx, self) => idx === self.findIndex((t) => t.time === point.time)
        );

        // Transform data to histogram format
        const histogramData = uniqueData.map((point) => ({
          time: point.time,
          value: point.value,
          color: point.color || "#808080", // default gray if no color provided
        }));

        // Set histogram data
        histogramSeriesRef.setData(histogramData);
      });

      // Configure candlestick scale margins to prevent overlap with histogram
      currentCandlestickSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.1,
          bottom: 0.4,
        },
      });
    } else {
      // Remove histogram series if none provided
      currentHistogramRefs.forEach((ref) => {
        if (ref) currentChart.removeSeries(ref);
      });
      histogramSeriesRefsRef.current = [];

      // Reset margins when no histogram series
      currentCandlestickSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0,
          bottom: 0,
        },
      });
    }

    // FITTING CONTENT
    currentChart.timeScale().fitContent();

    // SETTING/UPDATE SERIES MARKERS (after fitContent to ensure proper viewport)
    // Use requestAnimationFrame to ensure chart has rendered before setting markers
    requestAnimationFrame(() => {
      if (markersRef.current) {
        if (seriesMarkers && seriesMarkers.length > 0) {
          // Create a Set of valid candle times for validation
          const validCandleTimes = new Set(uniqueCandles.map((candle) => candle.time));

          // Filter and map markers, only including those with times that exist in candle data
          const markers: SeriesMarker<Time>[] = seriesMarkers
            .filter((config) => validCandleTimes.has(config.time))
            .map((config) => ({
              time: config.time,
              position: config.position,
              color: config.color,
              size: config.size,
              shape: config.shape,
              text: config.text,
            }));
          markersRef.current.setMarkers(markers);
        } else {
          markersRef.current.setMarkers([]);
        }
      }
    });

    // SETTING/UPDATE PRICE LINES
    // Remove existing price lines
    priceLinesRef.current.forEach((priceLine) => {
      currentCandlestickSeries.removePriceLine(priceLine);
    });
    priceLinesRef.current = [];

    // Create new price lines
    if (priceLines && priceLines.length > 0) {
      priceLines.forEach((config) => {
        const priceLine = currentCandlestickSeries.createPriceLine({
          price: config.price,
          color: config.color,
          lineWidth: config.lineWidth,
          lineStyle: config.lineStyle,
          axisLabelVisible: config.axisLabelVisible,
          title: config.title,
        });
        priceLinesRef.current.push(priceLine);
      });
    }
  }, [candleData, histogramSeries, seriesMarkers, priceLines, height]);

  // Initialize or update chart when container is ready and data is available
  useEffect(() => {
    if (containerReady && candleData && candleData.length > 0) {
      initializeChart();
    }
  }, [containerReady, candleData, initializeChart]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      seriesRef.current = null;
      histogramSeriesRefsRef.current = [];
      markersRef.current = null;
      priceLinesRef.current = [];
    };
  }, []);

  // DRAW
  return (
    <div className="border rounded-md p-4 pr-4 bg-black">
      <div ref={chartContainerRef} className="w-full min-h-[200px]" />
    </div>
  );
}
