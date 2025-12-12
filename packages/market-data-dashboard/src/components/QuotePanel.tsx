"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Badge, Loader } from "@mantine/core";
import { QuoteSnapshotData, ApiQuotesResponse } from "@/types";

interface QuotePanelProps {
  nseSymbol: string;
  timestamp: Date;
  shortlistType: string;
  onLoadingChange?: (loading: boolean) => void;
}

export function QuotePanel({
  nseSymbol,
  timestamp,
  shortlistType,
  onLoadingChange,
}: QuotePanelProps) {
  const [quote, setQuote] = useState<QuoteSnapshotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true);
      onLoadingChange?.(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          nseSymbol,
          timestamp: timestamp.toISOString(),
          shortlistType,
        });

        const { data } = await axios.get<ApiQuotesResponse>(
          `/api/quotes?${params.toString()}`
        );
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border rounded-md p-4 bg-[var(--mantine-color-body)]">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="border rounded-md p-4 bg-[var(--mantine-color-body)]">
        <p className="text-sm text-gray-500">No quote data available</p>
      </div>
    );
  }

  const quoteData = quote.quoteData;

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
      <div className="border rounded-md p-4 bg-[var(--mantine-color-body)]">
        <div className="max-h-[60vh] overflow-auto">
          <pre className="text-xs bg-gray-100 p-4 rounded m-0">
            {JSON.stringify(quoteData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
