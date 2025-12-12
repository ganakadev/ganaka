"use client";

import { Card, Text, Badge, Button, Collapse } from "@mantine/core";
import { useState } from "react";
import { ShortlistEntry } from "@/types";
import { QuotePanel } from "./QuotePanel";

interface CompanyCardProps {
  entry: ShortlistEntry;
  timestamp: Date;
  shortlistType: string;
}

export function CompanyCard({
  entry,
  timestamp,
  shortlistType,
}: CompanyCardProps) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ marginBottom: "0.5rem" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Text fw={500} size="lg">
            {entry.name}
          </Text>
          <Text size="sm" c="dimmed">
            {entry.nseSymbol}
          </Text>
          <Text size="xl" fw={700} mt="xs">
            ₹
            {entry.price.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </div>
        <Button
          variant="light"
          onClick={() => setOpened(!opened)}
          loading={loading}
        >
          {opened ? "Hide Details" : "Show Details"}
        </Button>
      </div>
      <Collapse in={opened}>
        <div style={{ marginTop: "1rem" }}>
          <QuotePanel
            nseSymbol={entry.nseSymbol}
            timestamp={timestamp}
            shortlistType={shortlistType}
            onLoadingChange={setLoading}
          />
        </div>
      </Collapse>
    </Card>
  );
}
