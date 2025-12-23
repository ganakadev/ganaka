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
  LineSeries,
  type LineSeriesPartialOptions,
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
  const lineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
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
        visible: true,
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

    // Add line series for buyer control percentage
    const lineSeries = chart.addSeries(LineSeries, {
      color: "#ffa500",
      lineWidth: 1,
      priceScaleId: "right",
      priceFormat: {
        type: "price",
        precision: 2,
        minMove: 0.01,
      },
    } as LineSeriesPartialOptions);

    // Configure right price scale for buyer control percentage (0-100%)
    chart.priceScale("right").applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    });

    lineSeriesRef.current = lineSeries;

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

  // sets the buyer control line data
  useEffect(() => {
    if (
      !lineSeriesRef.current ||
      !buyerControlData ||
      buyerControlData.length === 0
    )
      return;

    // eliminate data points that have duplicate times
    const uniqueData = buyerControlData.filter(
      (point, index, self) =>
        index === self.findIndex((t) => t.time === point.time)
    );

    // Set line data
    lineSeriesRef.current.setData(uniqueData);
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
