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

export function CandleChart({
  selectedDate,
  candleData,
  buyerControlPercentage,
  buyerControlData,
}: {
  selectedDate: Date | null;
  candleData: CandleData[] | null;
  buyerControlPercentage: number | null | undefined;
  buyerControlData: Array<{ time: Time; value: number }> | null;
}) {
  // HOOKS
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const histogramSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
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

    // Configure left price scale margins to prevent overlap with histogram
    candlestickSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.4,
      },
    });

    seriesRef.current = candlestickSeries;

    // Add histogram series for buyer control percentage
    const histogramSeries = chart.addSeries(HistogramSeries, {
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "", // set as an overlay by setting a blank priceScaleId
    } as HistogramSeriesPartialOptions);

    // Configure histogram scale margins to position at bottom 30% of chart
    histogramSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.7, // highest point of the series will be 70% away from the top
        bottom: 0, // lowest point will be at the very bottom
      },
    });

    histogramSeriesRef.current = histogramSeries;

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

  // sets the buyer control histogram data
  useEffect(() => {
    if (
      !histogramSeriesRef.current ||
      !buyerControlData ||
      buyerControlData.length === 0
    )
      return;

    // eliminate data points that have duplicate times
    const uniqueData = buyerControlData.filter(
      (point, index, self) =>
        index === self.findIndex((t) => t.time === point.time)
    );

    // Transform data to histogram format with color based on buyer control percentage
    const histogramData = uniqueData.map((point) => ({
      time: point.time,
      value: point.value,
      color: point.value > 50 ? "#1b5b55" : "#7f3130", // green if > 50%, red if ≤ 50%
    }));

    // Set histogram data
    histogramSeriesRef.current.setData(histogramData);
  }, [buyerControlData]);

  // adds a marker at the selected time
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
    const referenceIndex = Math.min(30, candleData.length - 1);
    const firstCandleTime = dayjs
      .unix(candleData[referenceIndex].time as number)
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
    const selectedTimeMarker: SeriesMarker<Time> = {
      time: closestCandle.time,
      position: "belowBar",
      color: "orange",
      size: 1,
      shape: "circle",
      text: `${dayjs(selectedTime).format("HH:mm")}`,
    };
    const buyerControlMarker: SeriesMarker<Time> = {
      time: closestCandle.time,
      position: "aboveBar",
      color:
        buyerControlPercentage && buyerControlPercentage > 50
          ? "lightGreen"
          : "red",
      size: 1,
      shape: "circle",
      text: `${
        buyerControlPercentage ? buyerControlPercentage.toFixed(2) : "N/A"
      }%`,
    };

    // Set markers using the markers manager (v5 API)
    if (markersRef.current) {
      markersRef.current.setMarkers([selectedTimeMarker, buyerControlMarker]);
    }
  }, [selectedDate, candleData, buyerControlPercentage]);

  // DRAW
  return (
    <div className="border rounded-md p-4 pr-4 bg-black">
      <div ref={chartContainerRef} className="w-full min-h-[200px]" />
    </div>
  );
}
