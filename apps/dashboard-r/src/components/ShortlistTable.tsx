import { Skeleton, Table } from "@mantine/core";
import { times } from "lodash";
import type { ShortlistEntry } from "@ganaka/db";

export const ShortlistTable = ({
  shortlist,
  onRowClick,
  loading,
  selectedDate,
}: {
  shortlist: {
    id: string;
    timestamp: Date;
    shortlistType: "TOP_GAINERS" | "VOLUME_SHOCKERS";
    entries: ShortlistEntry[];
  } | null;
  onRowClick: (entry: ShortlistEntry) => void;
  loading: boolean;
  selectedDate: Date | null;
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
          {!selectedDate ? (
            <Table.Tr>
              <Table.Td colSpan={4} className="text-center py-8">
                <p className="text-sm text-gray-500">No date selected</p>
              </Table.Td>
            </Table.Tr>
          ) : loading || !shortlist ? (
            times(10, (index) => (
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
          ) : (
            shortlist.entries.map((entry, index) => (
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
                  {/* <span className="text-sm">
                    {entry.buyerControlPercentage
                      ? `${entry.buyerControlPercentage.toFixed(2)}%`
                      : "N/A"}
                  </span> */}
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
            ))
          )}
        </Table.Tbody>
      </Table>
    </div>
  );
};
