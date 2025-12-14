"use client";

import { Drawer } from "@mantine/core";
import { QuoteData, ShortlistEntry } from "@/types";
import { CandleChart, CandleData } from "./CandleChart";
import { QuoteDataTables } from "./QuoteDataTables";
import { useEffect, useState } from "react";
import axios from "axios";

interface CandleApiResponse {
  candles: CandleData[];
  start_time: string;
  end_time: string;
  interval_in_minutes: number;
}

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
  const [loadingCandles, setLoadingCandles] = useState(false);
  const [candleError, setCandleError] = useState<string | null>(null);

  // Fetch candle data when drawer opens
  useEffect(() => {
    const fetchCandleData = async () => {
      if (!selectedEntry || !selectedDate) {
        setCandleData(null);
        return;
      }

      setLoadingCandles(true);
      setCandleError(null);

      try {
        console.log("Fetching candle data for:", {
          symbol: selectedEntry.nseSymbol,
          date: selectedDate.toISOString(),
        });
        const { data } = await axios.get<CandleApiResponse>("/api/candles", {
          params: {
            symbol: selectedEntry.nseSymbol,
            date: selectedDate.toISOString(),
            interval: "5minute",
          },
        });

        console.log("Candle data received:", {
          count: data.candles?.length || 0,
          candles: data.candles,
        });
        setCandleData(data.candles);
      } catch (error) {
        console.error("Error fetching candle data:", error);
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.error ||
            error.message ||
            "Failed to fetch candle data"
          : error instanceof Error
          ? error.message
          : "Failed to fetch candle data";
        console.error("Candle API Error:", errorMessage);
        setCandleError(errorMessage);
        setCandleData(null);
      } finally {
        setLoadingCandles(false);
      }
    };

    fetchCandleData();
  }, [selectedEntry, selectedDate]);

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
            symbol={selectedEntry.nseSymbol}
            selectedDate={selectedDate}
            candleData={candleData}
            loading={loadingCandles}
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
      <span className="text-sm text-gray-500">{selectedEntry.nseSymbol}</span>
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
