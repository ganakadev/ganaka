"use client";

import { Table, Badge } from "@mantine/core";
import { ShortlistSnapshotData, ShortlistEntry } from "@/types";

interface ShortlistTableProps {
  shortlist: ShortlistSnapshotData;
  onRowClick: (
    entry: ShortlistEntry,
    timestamp: Date,
    shortlistType: string
  ) => void;
}

export function ShortlistTable({ shortlist, onRowClick }: ShortlistTableProps) {
  // VARIABLES
  const shortlistTypeLabel =
    shortlist.shortlistType === "TOP_GAINERS"
      ? "Top Gainers"
      : "Volume Shockers";
  const color = shortlist.shortlistType === "TOP_GAINERS" ? "green" : "blue";

  // DRAW
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <Badge color={color} size="lg">
          {shortlistTypeLabel}
        </Badge>
        <span className="text-sm text-gray-500">
          {new Date(shortlist.timestamp).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </div>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Company Name</Table.Th>
            <Table.Th>Symbol</Table.Th>
            <Table.Th className="text-right">Price</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {shortlist.entries.map((entry, index) => (
            <Table.Tr
              key={`${entry.nseSymbol}-${index}`}
              className="cursor-pointer"
              onClick={() =>
                onRowClick(entry, shortlist.timestamp, shortlist.shortlistType)
              }
            >
              <Table.Td>
                <span className="font-medium">{entry.name}</span>
              </Table.Td>
              <Table.Td>
                <span className="text-sm text-gray-500">{entry.nseSymbol}</span>
              </Table.Td>
              <Table.Td className="text-right">
                <span className="font-bold">
                  ₹
                  {entry.price.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}
