"use client";

import { Badge, Drawer, Loader } from "@mantine/core";
import { ApiQuotesResponse, QuoteSnapshotData, ShortlistEntry } from "@/types";
import axios from "axios";
import { useState, useEffect } from "react";

export function QuotePanel({
  nseSymbol,
  timestamp,
  shortlistType,
  onLoadingChange,
}: {
  nseSymbol: string;
  timestamp: Date;
  shortlistType: string;
  onLoadingChange?: (loading: boolean) => void;
}) {
  // STATE
  const [quote, setQuote] = useState<QuoteSnapshotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // EFFECTS
  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true);
      onLoadingChange?.(true);
      setError(null);

      try {
        const { data } = await axios.get<ApiQuotesResponse>(`/api/quotes`, {
          params: {
            nseSymbol,
            timestamp: timestamp.toISOString(),
            shortlistType,
          },
        });
        setQuote(data.quote);
      } catch (err) {
        let errorMessage = "Unknown error";
        if (axios.isAxiosError(err)) {
          errorMessage =
            err.response?.data?.error || err.message || "Failed to fetch quote";
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
        onLoadingChange?.(false);
      }
    };

    fetchQuote();
  }, [nseSymbol, timestamp, shortlistType, onLoadingChange]);

  // DRAW
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border rounded-md p-4 bg-(--mantine-color-body)">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="border rounded-md p-4 bg-(--mantine-color-body)">
        <p className="text-sm text-gray-500">No quote data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-gray-500 mb-2">Quote Data</p>
        {quote.buyerControlPercentage !== null && (
          <Badge
            color={quote.buyerControlPercentage > 50 ? "green" : "red"}
            size="lg"
          >
            Buyer Control: {quote.buyerControlPercentage.toFixed(2)}%
          </Badge>
        )}
      </div>
      <div className="border rounded-md p-4">
        <div className="max-h-[60vh] overflow-auto">
          <pre className="text-xs  p-4 rounded m-0">
            {JSON.stringify(quote.quoteData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function QuoteDrawer({
  opened,
  onClose,
  selectedEntry,
  timestamp,
  shortlistType,
}: {
  opened: boolean;
  onClose: () => void;
  selectedEntry: ShortlistEntry | null;
  timestamp: Date | null;
  shortlistType: string | null;
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
      {selectedEntry && timestamp && shortlistType && (
        <QuotePanel
          nseSymbol={selectedEntry.nseSymbol}
          timestamp={timestamp}
          shortlistType={shortlistType}
        />
      )}
    </Drawer>
  );
}
