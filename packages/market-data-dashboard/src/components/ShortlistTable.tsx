"use client";

import { ShortlistEntry, ShortlistSnapshotData } from "@/types";
import { Skeleton, Table } from "@mantine/core";
import { times } from "lodash";

export type OrderLevel = {
  price: number;
  quantity: number;
};

export type OrderBookSide = OrderLevel[];

export type DominanceResult = {
  /** −100 (strong sellers) → +100 (strong buyers) */
  dominancePct: number;
  buyScore: number;
  sellScore: number;
};

export function calculateOrderBookDominance(
  buys: OrderBookSide,
  sells: OrderBookSide,
  ltp: number,
  options?: {
    levels?: number; // default 5
    tickSize?: number; // default 0.5
  }
): DominanceResult {
  const levels = options?.levels ?? 5;
  const tickSize = options?.tickSize ?? 0.5;

  const weight = (price: number): number =>
    1 / (1 + Math.abs(price - ltp) / tickSize);

  const buyScore = buys
    .slice(0, levels)
    .reduce((sum, l) => sum + l.quantity * weight(l.price), 0);

  const sellScore = sells
    .slice(0, levels)
    .reduce((sum, l) => sum + l.quantity * weight(l.price), 0);

  const total = buyScore + sellScore;

  if (total === 0) {
    return { dominancePct: 0, buyScore: 0, sellScore: 0 };
  }

  const dominancePct = ((buyScore - sellScore) / total) * 100;

  return {
    dominancePct: Number(dominancePct.toFixed(2)),
    buyScore,
    sellScore,
  };
}

export const ShortlistTable = ({
  shortlist,
  onRowClick,
  loading,
}: {
  shortlist: ShortlistSnapshotData;
  onRowClick: (entry: ShortlistEntry) => void;
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
        tabularNums
        style={{ tableLayout: "fixed" }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="w-[55%]">Company Name</Table.Th>
            <Table.Th className="w-[20%]">Symbol</Table.Th>
            <Table.Th className="w-[15%]">Buyer Control %</Table.Th>
            <Table.Th ta="right" className="text-right w-[15%]">
              Price per share
            </Table.Th>
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
                  onClick={() => onRowClick(entry)}
                >
                  <Table.Td className="w-[55%]">
                    <span className="font-medium">{entry.name}</span>
                  </Table.Td>
                  <Table.Td className="w-[20%]">
                    <span className="text-sm">{entry.nseSymbol}</span>
                  </Table.Td>
                  <Table.Td className="w-[20%]">
                    <span className="text-sm">
                      {calculateOrderBookDominance(
                        entry.quoteData?.payload.depth.buy ?? [],
                        entry.quoteData?.payload.depth.sell ?? [],
                        entry.price
                      ).dominancePct.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      %
                    </span>
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
