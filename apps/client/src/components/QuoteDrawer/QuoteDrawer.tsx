import { Drawer } from "@mantine/core";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import type { Time } from "lightweight-charts";
import { useMemo } from "react";
import { dashboardAPI } from "../../store/api/dashboardApi";
import type { ShortlistEntryWithQuote } from "../../types";
import { useRTKNotifier } from "../../utils/hooks/useRTKNotifier";
import { convertUTCToIST, formatDateForAPI } from "../../utils/dateFormatting";
import {
  CandleChart,
  type CandleData,
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
  const errorMessage = getCandlesAPI.error
    ? "data" in getCandlesAPI.error &&
      typeof getCandlesAPI.error.data === "object" &&
      getCandlesAPI.error.data !== null &&
      "error" in getCandlesAPI.error.data
      ? String(getCandlesAPI.error.data.error)
      : "Failed to fetch candle data"
    : null;


  // Transform selectedDate into series markers format
  const seriesMarkers: SeriesMarkerConfig[] = useMemo(() => {
    if (!selectedDate || !candleData || candleData.length === 0) return [];

    // Convert selectedDate to UTC dayjs object for comparison
    const selectedTime = dayjs.tz(selectedDate, "Asia/Kolkata").format("YYYY-MM-DDTHH:mm");
    let closestCandle = candleData[0];
    let minDiff = Infinity;

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
            histogramSeries={[]}
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
