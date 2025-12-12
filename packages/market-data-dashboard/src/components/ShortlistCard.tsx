"use client";

import { Card, Text, Badge, Stack } from "@mantine/core";
import { ShortlistSnapshotData } from "@/types";
import { CompanyCard } from "./CompanyCard";

interface ShortlistCardProps {
  shortlist: ShortlistSnapshotData;
}

export function ShortlistCard({ shortlist }: ShortlistCardProps) {
  const shortlistTypeLabel =
    shortlist.shortlistType === "TOP_GAINERS"
      ? "Top Gainers"
      : "Volume Shockers";
  const color = shortlist.shortlistType === "TOP_GAINERS" ? "green" : "blue";

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ marginBottom: "1rem" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <Badge color={color} size="lg">
          {shortlistTypeLabel}
        </Badge>
        <Text size="sm" c="dimmed">
          {new Date(shortlist.timestamp).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </Text>
      </div>
      <Stack gap="xs">
        {shortlist.entries.map((entry, index) => (
          <CompanyCard
            key={`${entry.nseSymbol}-${index}`}
            entry={entry}
            timestamp={shortlist.timestamp}
            shortlistType={shortlist.shortlistType}
          />
        ))}
      </Stack>
    </Card>
  );
}
