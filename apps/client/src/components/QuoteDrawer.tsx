import { Drawer } from "@mantine/core";
import type { QuoteData, ShortlistEntryWithQuote } from "../types";
import { CandleChart, type CandleData } from "./CandleChart";
import { QuoteDataTables } from "./QuoteDataTables";
import dayjs from "dayjs";
import type { Time } from "lightweight-charts";
import { dashboardAPI } from "../store/api/dashboardApi";

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
  // Fetch candle data using RTK Query
  const { data: candlesData, error: candleError } =
    dashboardAPI.useGetCandlesQuery(
      {
        symbol: selectedEntry?.nseSymbol || "",
        date: selectedDate?.toISOString() || "",
        interval: "5minute",
      },
      {
        skip: !selectedEntry || !selectedDate,
      }
    );

  const candleData: CandleData[] | null = candlesData?.data.candles
    ? candlesData.data.candles.map((candle) => ({
        time: candle.time as Time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }))
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
      size="xl"
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
