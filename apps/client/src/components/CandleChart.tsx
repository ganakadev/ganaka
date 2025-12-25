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
import { useEffect, useRef } from "react";

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

export interface CandleChartProps {
  candleData: CandleData[] | null;
  histogramSeries?: HistogramSeriesConfig[];
  seriesMarkers?: SeriesMarkerConfig[];
  height?: number;
}

export function CandleChart({
  candleData,
  histogramSeries = [],
  seriesMarkers = [],
  height = 250,
}: CandleChartProps) {
  // HOOKS
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const histogramSeriesRefsRef = useRef<
    Array<ISeriesApi<"Histogram"> | null>
  >([]);
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
  }, [height]);

  // updates candlestick scale margins based on histogram series presence
  useEffect(() => {
    if (!seriesRef.current) return;

    // Configure left price scale margins to prevent overlap with histogram
    // Only apply if there are histogram series
    if (histogramSeries.length > 0) {
      seriesRef.current.priceScale().applyOptions({
        scaleMargins: {
          top: 0.1,
          bottom: 0.4,
        },
      });
    } else {
      // Reset margins when no histogram series
      seriesRef.current.priceScale().applyOptions({
        scaleMargins: {
          top: 0,
          bottom: 0,
        },
      });
    }
  }, [histogramSeries.length]);

  // creates histogram series dynamically
  useEffect(() => {
    if (!chartRef.current || !seriesRef.current) return;

    const chart = chartRef.current;
    
    // Cleanup: remove existing histogram series first
    histogramSeriesRefsRef.current.forEach((series) => {
      if (series && chart) {
        chart.removeSeries(series);
      }
    });

    const histogramSeriesRefs: Array<ISeriesApi<"Histogram"> | null> = [];

    // Create histogram series for each config
    histogramSeries.forEach((config) => {
      const histogramSeries = chart.addSeries(HistogramSeries, {
        priceFormat: config.priceFormat || {
          type: "volume",
        },
        priceScaleId: config.priceScaleId ?? "", // default to overlay
      } as HistogramSeriesPartialOptions);

      // Configure scale margins if provided
      if (config.scaleMargins) {
        histogramSeries.priceScale().applyOptions({
          scaleMargins: config.scaleMargins,
        });
      }

      histogramSeriesRefs.push(histogramSeries);
    });

    histogramSeriesRefsRef.current = histogramSeriesRefs;
  }, [histogramSeries]);

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

  // sets histogram series data
  useEffect(() => {
    if (
      !histogramSeriesRefsRef.current ||
      histogramSeriesRefsRef.current.length === 0 ||
      !histogramSeries ||
      histogramSeries.length === 0
    )
      return;

    histogramSeries.forEach((config, index) => {
      const histogramSeriesRef = histogramSeriesRefsRef.current[index];
      if (
        !histogramSeriesRef ||
        !config.data ||
        config.data.length === 0
      ) {
        return;
      }

      // eliminate data points that have duplicate times
      const uniqueData = config.data.filter(
        (point, idx, self) =>
          idx === self.findIndex((t) => t.time === point.time)
      );

      // Transform data to histogram format
      // If color is provided in data, use it; otherwise use a default color
      const histogramData = uniqueData.map((point) => ({
        time: point.time,
        value: point.value,
        color: point.color || "#808080", // default gray if no color provided
      }));

      // Set histogram data
      histogramSeriesRef.setData(histogramData);
    });
  }, [histogramSeries]);

  // sets series markers
  useEffect(() => {
    if (
      !seriesRef.current ||
      !markersRef.current ||
      !seriesMarkers ||
      seriesMarkers.length === 0
    ) {
      // Clear markers if none provided
      if (markersRef.current) {
        markersRef.current.setMarkers([]);
      }
      return;
    }

    // Convert marker configs to SeriesMarker format
    const markers: SeriesMarker<Time>[] = seriesMarkers.map((config) => ({
      time: config.time,
      position: config.position,
      color: config.color,
      size: config.size,
      shape: config.shape,
      text: config.text,
    }));

    // Set markers using the markers manager
    markersRef.current.setMarkers(markers);
  }, [seriesMarkers]);

  // DRAW
  return (
    <div className="border rounded-md p-4 pr-4 bg-black">
      <div ref={chartContainerRef} className="w-full min-h-[200px]" />
    </div>
  );
}

