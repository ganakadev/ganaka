import { Drawer } from "@mantine/core";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import type { Time } from "lightweight-charts";
import { useMemo } from "react";
import { dashboardAPI } from "../../store/api/dashboardApi";
import type { ShortlistEntryWithQuote } from "../../types";
import { calculateBuyerControlPercentage } from "../../utils/buyerControl";
import { useRTKNotifier } from "../../utils/hooks/useRTKNotifier";
import { convertUTCToIST, formatDateForAPI } from "../../utils/dateFormatting";
import {
  CandleChart,
  type CandleData,
  type HistogramSeriesConfig,
  type SeriesMarkerConfig,
} from "../CandleChart";
import { QuoteDataTables } from "./QuoteDataTables";
import type { growwQuoteSchema } from "@ganaka/schemas";
import { z } from "zod";

dayjs.extend(utc);
dayjs.extend(timezone);

interface QuotePanelProps {
  quoteData: z.infer<typeof growwQuoteSchema>;
  selectedEntry: ShortlistEntryWithQuote | null;
  selectedDate: Date | null;
}

function QuotePanel({ quoteData, selectedEntry, selectedDate }: QuotePanelProps) {
  // API
  // Fetch candle data using RTK Query
  const getCandlesAPI = dashboardAPI.useGetCandlesQuery(
    {
      symbol: selectedEntry?.nseSymbol || "",
      date: formatDateForAPI(selectedDate),
      interval: "1minute",
    },
    {
      skip: !selectedEntry || !selectedDate,
    }
  );
  useRTKNotifier({
    requestName: "Get Candles",
    error: getCandlesAPI.error,
  });

  // Fetch quote snapshots using RTK Query
  const getQuoteTimelineAPI = dashboardAPI.useGetQuoteTimelineQuery(
    {
      symbol: selectedEntry?.nseSymbol || "",
      date: formatDateForAPI(selectedDate),
    },
    {
      skip: !selectedEntry || !selectedDate,
    }
  );
  useRTKNotifier({
    requestName: "Get Quote Timeline",
    error: getQuoteTimelineAPI.error,
  });

  // VARIABLES
  const candleData: CandleData[] | null = getCandlesAPI.data?.data.candles
    ? getCandlesAPI.data.data.candles.map((candle) => {
        const time = convertUTCToIST(dayjs.unix(candle.time).toDate());
        return {
          time: time.unix() as Time,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        };
      })
    : null;
  // Process quote snapshots to calculate buyerControlPercentage for each
  const buyerControlData: Array<{ time: Time; value: number }> | null = getQuoteTimelineAPI.data
    ?.data.quoteTimeline
    ? getQuoteTimelineAPI.data.data.quoteTimeline
        .map(
          (timeline: {
            id: string;
            timestamp: string;
            nseSymbol: string;
            quoteData: z.infer<typeof growwQuoteSchema>;
          }) => {
            const buyerControlPercentage = calculateBuyerControlPercentage(
              timeline.quoteData,
              "total"
            );
            if (buyerControlPercentage === null) {
              return null;
            }
            // Convert UTC timestamp to Unix timestamp (seconds)
            // API returns UTC timestamps, so we parse them as UTC directly
            // Unix timestamps are timezone-agnostic, so no timezone conversion needed
            // TODO: Find a better way to implement this offset instead of hardcoding it
            const time = convertUTCToIST(dayjs.utc(timeline.timestamp).toDate());
            return {
              time: time.unix() as Time,
              value: buyerControlPercentage,
            };
          }
        )
        .filter(
          (item: { time: Time; value: number } | null): item is { time: Time; value: number } =>
            item !== null
        )
    : null;
  const errorMessage = getCandlesAPI.error
    ? "data" in getCandlesAPI.error &&
      typeof getCandlesAPI.error.data === "object" &&
      getCandlesAPI.error.data !== null &&
      "error" in getCandlesAPI.error.data
      ? String(getCandlesAPI.error.data.error)
      : "Failed to fetch candle data"
    : null;

  // Transform buyerControlData into histogram series format with trend-based coloring
  const histogramSeries: HistogramSeriesConfig[] = useMemo(() => {
    if (!buyerControlData || buyerControlData.length === 0) return [];

    // eliminate data points that have duplicate times
    const uniqueData = buyerControlData.filter(
      (point, index, self) => index === self.findIndex((t) => t.time === point.time)
    );

    // Transform data to histogram format with color based on trend (up/down movement)
    const histogramData = uniqueData.map((point, index) => {
      // First point: use neutral color (no previous point to compare)
      if (index === 0) {
        return {
          time: point.time,
          value: point.value,
          color: "#808080", // neutral gray for first point
        };
      }

      // Compare to previous point to determine trend
      const previousValue = uniqueData[index - 1].value;
      const isTrendingUp = point.value > previousValue;

      return {
        time: point.time,
        value: point.value,
        color: isTrendingUp ? "#13413b" : "#5C2121", // green if trending up, red if trending down
      };
    });

    return [
      {
        data: histogramData,
        priceScaleId: "", // set as an overlay by setting a blank priceScaleId
        scaleMargins: {
          top: 0.7, // highest point of the series will be 70% away from the top
          bottom: 0, // lowest point will be at the very bottom
        },
        priceFormat: {
          type: "volume",
        },
      },
    ];
  }, [buyerControlData]);

  // Transform selectedDate into series markers format
  const seriesMarkers: SeriesMarkerConfig[] = useMemo(() => {
    if (!selectedDate || !candleData || candleData.length === 0) return [];

    // Convert selectedDate to UTC dayjs object for comparison
    const selectedTime = dayjs.tz(selectedDate, "Asia/Kolkata").format("YYYY-MM-DDTHH:mm");
    let closestCandle = candleData[0];
    const referenceIndex = Math.min(30, candleData.length - 1);
    const firstCandleTime = dayjs
      .unix(candleData[referenceIndex].time as number)
      .utc()
      .format("YYYY-MM-DDTHH:mm");
    let minDiff = Math.abs(dayjs.utc(selectedTime).diff(dayjs.utc(firstCandleTime), "minutes"));

    for (const candle of candleData) {
      const candleTime = dayjs
        .unix(candle.time as number)
        .utc()
        .format("YYYY-MM-DDTHH:mm");
      const diff = dayjs.utc(selectedTime).diff(dayjs.utc(candleTime), "minutes");

      if (Math.abs(diff) < minDiff) {
        minDiff = Math.abs(diff);
        closestCandle = candle;
      }
    }

    // Create marker at the selected time
    return [
      {
        time: closestCandle.time,
        position: "belowBar",
        color: "orange",
        size: 1,
        shape: "circle",
        text: `${dayjs.utc(selectedTime).format("HH:mm")}`,
      },
    ];
  }, [selectedDate, candleData]);

  // DRAW
  return (
    <div className="flex flex-col gap-4">
      {selectedEntry && selectedDate && (
        <>
          {errorMessage && (
            <div className="border rounded-md p-4 bg-red-50">
              <p className="text-sm text-red-600">Error loading chart: {errorMessage}</p>
            </div>
          )}
          <CandleChart
            candleData={candleData}
            histogramSeries={histogramSeries}
            seriesMarkers={seriesMarkers}
          />
        </>
      )}
      <QuoteDataTables quoteData={quoteData} selectedDate={selectedDate} />
    </div>
  );
}

export function QuoteDrawer({
  opened,
  onClose,
  selectedEntry,
  selectedDate,
}: {
  opened: boolean;
  onClose: () => void;
  selectedEntry: ShortlistEntryWithQuote | null;
  selectedDate: Date | null;
}) {
  // VARIABLES
  const drawerTitle = selectedEntry ? (
    <div className="flex flex-col gap-1">
      <h4 className="text-lg font-semibold">{selectedEntry.name}</h4>
      <span className="text-sm text-gray-500">{`${selectedEntry.nseSymbol} at ${dayjs(
        selectedDate
      ).format("DD-MM-YYYY HH:mm")}`}</span>
    </div>
  ) : (
    "Quote Details"
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
      {selectedEntry && (
        <QuotePanel
          quoteData={selectedEntry.quoteData}
          selectedEntry={selectedEntry}
          selectedDate={selectedDate}
        />
      )}
    </Drawer>
  );
}
