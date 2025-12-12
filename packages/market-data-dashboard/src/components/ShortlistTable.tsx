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
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Company Name</Table.Th>
            <Table.Th>Symbol</Table.Th>
            <Table.Th className="text-right">Price</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {loading
            ? times(10, (index) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    <Skeleton height={20} width="100%" />
                  </Table.Td>
                  <Table.Td>
                    <Skeleton height={20} width="100%" />
                  </Table.Td>
                  <Table.Td>
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
                  <Table.Td>
                    <span className="font-medium">{entry.name}</span>
                  </Table.Td>
                  <Table.Td>
                    <span className="text-sm">{entry.nseSymbol}</span>
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
};
