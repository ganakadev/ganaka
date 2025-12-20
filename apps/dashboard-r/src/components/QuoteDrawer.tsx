import { Drawer } from "@mantine/core";
import { CandleChart } from "./CandleChart";
import { QuoteDataTables } from "./QuoteDataTables";
import { useMemo } from "react";
import dayjs from "dayjs";
import { useGetCandlesQuery } from "@/store/api";
import type { CandleData } from "./CandleChart";
import type { QuoteData, ShortlistEntry } from "@ganaka/db";
import type { Time } from "lightweight-charts";

export function QuotePanel({
  quoteData,
  selectedEntry,
  selectedDate,
}: {
  quoteData: QuoteData | null | undefined;
  selectedEntry: ShortlistEntry | null;
  selectedDate: Date | null;
}) {
  // Use RTKQ hook for candles
  const { data: candlesResponse, error: candlesError } = useGetCandlesQuery(
    {
      symbol: selectedEntry?.nseSymbol || "",
      date: selectedDate?.toISOString() || "",
      interval: "5minute",
    },
    {
      skip: !selectedEntry || !selectedDate,
    }
  );

  // Transform candle data from API response
  const candleData = useMemo<CandleData[] | null>(() => {
    if (!candlesResponse) return null;
    return candlesResponse.candles.map((candle) => ({
      time: candle.time as Time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));
  }, [candlesResponse]);

  // Derive error message from query error
  const candleError = useMemo<string | null>(() => {
    if (!candlesError) return null;
    return "error" in candlesError
      ? String(candlesError.error)
      : "Failed to fetch candle data";
  }, [candlesError]);

  // DRAW
  return (
    <div className="flex flex-col gap-4">
      {selectedEntry && selectedDate && (
        <>
          {candleError && (
            <div className="border rounded-md p-4 bg-red-50">
              <p className="text-sm text-red-600">
                Error loading chart: {candleError}
              </p>
            </div>
          )}
          <CandleChart
            selectedDate={selectedDate}
            candleData={candleData}
            buyerControlPercentage={0}
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
  selectedEntry: ShortlistEntry | null;
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
