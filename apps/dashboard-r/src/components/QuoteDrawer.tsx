import { Drawer } from "@mantine/core";
import { QuoteData, ShortlistEntry } from "@/types";
import { CandleChart } from "./CandleChart";
import { QuoteDataTables } from "./QuoteDataTables";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useGetCandlesQuery } from "@/store/api";
import type { CandleData } from "./CandleChart";

export function QuotePanel({
  quoteData,
  selectedEntry,
  selectedDate,
}: {
  quoteData: QuoteData | null | undefined;
  selectedEntry: ShortlistEntry | null;
  selectedDate: Date | null;
}) {
  const [candleData, setCandleData] = useState<CandleData[] | null>(null);
  const [candleError, setCandleError] = useState<string | null>(null);

  // Use RTKQ hook for candles
  const {
    data: candlesResponse,
    isLoading: loadingCandles,
    error: candlesError,
  } = useGetCandlesQuery(
    {
      symbol: selectedEntry?.nseSymbol || "",
      date: selectedDate?.toISOString() || "",
      interval: "5minute",
    },
    {
      skip: !selectedEntry || !selectedDate,
    }
  );

  // Update candle data when response changes
  useEffect(() => {
    if (candlesResponse) {
      setCandleData(
        candlesResponse.candles.map((candle) => ({
          time: candle.time as number,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        }))
      );
      setCandleError(null);
    } else if (candlesError) {
      setCandleError(
        "error" in candlesError
          ? String(candlesError.error)
          : "Failed to fetch candle data"
      );
      setCandleData(null);
    }
  }, [candlesResponse, candlesError]);

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

