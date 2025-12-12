"use client";

import { useEffect, useState } from "react";
import { Text, Card, Stack, Badge, Loader, Center } from "@mantine/core";
import { QuoteSnapshotData } from "@/types";

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

        const response = await fetch(`/api/quotes?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch quote");
        }

        const data = await response.json();
        setQuote(data.quote);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
        onLoadingChange?.(false);
      }
    };

    fetchQuote();
  }, [nseSymbol, timestamp, shortlistType, onLoadingChange]);

  if (loading) {
    return (
      <Center p="xl">
        <Loader size="md" />
      </Center>
    );
  }

  if (error) {
    return (
      <Card padding="md" radius="md" withBorder>
        <Text c="red">Error: {error}</Text>
      </Card>
    );
  }

  if (!quote) {
    return (
      <Card padding="md" radius="md" withBorder>
        <Text c="dimmed">No quote data available</Text>
      </Card>
    );
  }

  const quoteData = quote.quoteData;

  return (
    <Card padding="md" radius="md" withBorder>
      <Stack gap="sm">
        <div>
          <Text size="sm" c="dimmed">
            Quote Data
          </Text>
          {quote.buyerControlPercentage !== null && (
            <Badge
              color={quote.buyerControlPercentage > 50 ? "green" : "red"}
              mt="xs"
            >
              Buyer Control: {quote.buyerControlPercentage.toFixed(2)}%
            </Badge>
          )}
        </div>
        <div style={{ maxHeight: "400px", overflow: "auto" }}>
          <pre
            style={{
              fontSize: "0.75rem",
              background: "#f5f5f5",
              padding: "1rem",
              borderRadius: "4px",
            }}
          >
            {JSON.stringify(quoteData, null, 2)}
          </pre>
        </div>
      </Stack>
    </Card>
  );
}
