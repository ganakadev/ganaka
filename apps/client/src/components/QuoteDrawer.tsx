import { Drawer } from "@mantine/core";
import type { QuoteData, ShortlistEntryWithQuote } from "../types";
import { CandleChart, type CandleData } from "./CandleChart";
import { QuoteDataTables } from "./QuoteDataTables";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import type { Time } from "lightweight-charts";
import { dashboardAPI } from "../store/api/dashboardApi";
import { calculateBuyerControlPercentage } from "../utils/buyerControl";

dayjs.extend(utc);
dayjs.extend(timezone);

interface QuotePanelProps {
  quoteData: QuoteData | null | undefined;
  selectedEntry: ShortlistEntryWithQuote | null;
  selectedDate: Date | null;
}

function QuotePanel({
  quoteData,
  selectedEntry,
  selectedDate,
}: QuotePanelProps) {
  // API
  // Fetch candle data using RTK Query
  const { data: candlesData, error: candleError } =
    dashboardAPI.useGetCandlesQuery(
      {
        symbol: selectedEntry?.nseSymbol || "",
        date: selectedDate?.toISOString() || "",
        interval: "1minute",
      },
      {
        skip: !selectedEntry || !selectedDate,
      }
    );
  // Fetch quote snapshots using RTK Query
  const { data: quoteTimelineData } = dashboardAPI.useGetQuoteTimelineQuery(
    {
      symbol: selectedEntry?.nseSymbol || "",
      date: selectedDate?.toISOString() || "",
    },
    {
      skip: !selectedEntry || !selectedDate,
    }
  );

  // VARIABLES
  const candleData: CandleData[] | null = candlesData?.data.candles
    ? candlesData.data.candles.map((candle) => ({
        time: candle.time as Time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }))
    : null;
  // Process quote snapshots to calculate buyerControlPercentage for each
  const buyerControlData: Array<{ time: Time; value: number }> | null =
    quoteTimelineData?.data.quoteTimeline
      ? quoteTimelineData.data.quoteTimeline
          .map(
            (timeline: {
              id: string;
              timestamp: Date;
              nseSymbol: string;
              quoteData: QuoteData;
            }) => {
              const buyerControlPercentage = calculateBuyerControlPercentage(
                timeline.quoteData as QuoteData,
                "hybrid"
              );
              if (buyerControlPercentage === null) {
                return null;
              }
              // Convert timestamp to Unix timestamp (seconds)
              const time = dayjs
                .utc(timeline.timestamp)
                .add(5, "hours")
                .add(30, "minutes"); // Add 5 hours and 30 minutes to the UTC timestamp to get the IST timestamp
              return {
                time: time.unix() as Time,
                value: buyerControlPercentage,
              };
            }
          )
          .filter(
            (
              item: { time: Time; value: number } | null
            ): item is { time: Time; value: number } => item !== null
          )
      : null;
  const errorMessage = candleError
    ? "data" in candleError &&
      typeof candleError.data === "object" &&
      candleError.data !== null &&
      "error" in candleError.data
      ? String(candleError.data.error)
      : "Failed to fetch candle data"
    : null;

  // DRAW
  return (
    <div className="flex flex-col gap-4">
      {selectedEntry && selectedDate && (
        <>
          {errorMessage && (
            <div className="border rounded-md p-4 bg-red-50">
              <p className="text-sm text-red-600">
                Error loading chart: {errorMessage}
              </p>
            </div>
          )}
          <CandleChart
            selectedDate={selectedDate}
            candleData={candleData}
            buyerControlPercentage={selectedEntry.buyerControlPercentage}
            buyerControlData={[]}
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
      <span className="text-sm text-gray-500">{`${
        selectedEntry.nseSymbol
      } at ${dayjs(selectedDate).format("DD-MM-YYYY HH:mm")}`}</span>
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
