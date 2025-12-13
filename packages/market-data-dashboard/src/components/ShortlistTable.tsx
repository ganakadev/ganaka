"use client";

import { ShortlistEntry, ShortlistSnapshotData } from "@/types";
import { Skeleton, Table } from "@mantine/core";
import { times } from "lodash";

export const ShortlistTable = ({
  shortlist,
  onRowClick,
  loading,
}: {
  shortlist: ShortlistSnapshotData;
  onRowClick: (
    entry: ShortlistEntry,
    timestamp: Date,
    shortlistType: string
  ) => void;
  loading: boolean;
}) => {
  // DRAW
  return (
    <div className="mb-8">
      <Table
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
        style={{ tableLayout: "fixed" }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="w-[55%]">Company Name</Table.Th>
            <Table.Th className="w-[20%]">Symbol</Table.Th>
            <Table.Th className="text-right w-[25%]">Price</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {loading
            ? times(10, (index) => (
                <Table.Tr key={index}>
                  <Table.Td className="w-[55%]">
                    <Skeleton height={20} width="100%" />
                  </Table.Td>
                  <Table.Td className="w-[20%]">
                    <Skeleton height={20} width="100%" />
                  </Table.Td>
                  <Table.Td className="w-[25%]">
                    <Skeleton height={20} width="100%" />
                  </Table.Td>
                </Table.Tr>
              ))
            : shortlist.entries.map((entry, index) => (
                <Table.Tr
                  key={`${entry.nseSymbol}-${index}`}
                  className="cursor-pointer"
                  onClick={() =>
                    onRowClick(
                      entry,
                      shortlist.timestamp,
                      shortlist.shortlistType
                    )
                  }
                >
                  <Table.Td className="w-[55%]">
                    <span className="font-medium">{entry.name}</span>
                  </Table.Td>
                  <Table.Td className="w-[20%]">
                    <span className="text-sm">{entry.nseSymbol}</span>
                  </Table.Td>
                  <Table.Td className="text-right w-[25%]">
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
};
