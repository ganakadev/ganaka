import type { v1_shortlists_schemas } from "@ganaka/schemas";
import { Skeleton, Table } from "@mantine/core";
import { times } from "lodash";
import { z } from "zod";
import type { ShortlistEntryWithQuote } from "../../../types";

export const ShortlistTable = ({
  shortlist,
  loading,
  selectedDate,
}: {
  shortlist: z.infer<typeof v1_shortlists_schemas.getShortlists.response>["data"] | null;
  onRowClick: (entry: ShortlistEntryWithQuote) => void;
  loading: boolean;
  selectedDate: Date | null;
}) => {
  // Helper function to format time
  // const formatTime = (minutes?: number): string => {
  //   if (minutes === undefined || minutes === null) return "N/A";
  //   if (minutes < 60) {
  //     return `${minutes} min`;
  //   }
  //   const hours = Math.floor(minutes / 60);
  //   const mins = minutes % 60;
  //   return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
  // };

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
            <Table.Th className="w-[35%]">Company Name</Table.Th>
            <Table.Th className="w-[15%]">Symbol</Table.Th>
            <Table.Th ta="right" className="text-right w-[12%]">
              Price per share
            </Table.Th>
            <Table.Th ta="right" className="text-right w-[12%]">
              Target Price
            </Table.Th>
            <Table.Th className="w-[26%]">Trade Result</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {!selectedDate ? (
            <Table.Tr>
              <Table.Td colSpan={5} className="text-center py-8">
                <p className="text-sm text-gray-500">No date selected</p>
              </Table.Td>
            </Table.Tr>
          ) : loading || !shortlist ? (
            times(10, (index) => (
              <Table.Tr key={index}>
                <Table.Td className="w-[35%]">
                  <Skeleton height={20} width="100%" />
                </Table.Td>
                <Table.Td className="w-[15%]">
                  <Skeleton height={20} width="100%" />
                </Table.Td>
                <Table.Td className="w-[12%]">
                  <Skeleton height={20} width="100%" />
                </Table.Td>
                <Table.Td className="w-[12%]">
                  <Skeleton height={20} width="100%" />
                </Table.Td>
                <Table.Td className="w-[26%]">
                  <Skeleton height={20} width="100%" />
                </Table.Td>
              </Table.Tr>
            ))
          ) : (
            shortlist.map((entry, index) => (
              <Table.Tr
                key={`${entry.nseSymbol}-${index}`}
                className="cursor-pointer"
                onClick={() => {
                  // if (entry.quoteData) {
                  //   onRowClick({
                  //     name: entry.name,
                  //     nseSymbol: entry.nseSymbol,
                  //     price: entry.price,
                  //     quoteData: entry.quoteData,
                  //   });
                  // }
                }}
              >
                <Table.Td className="w-[35%]">
                  <span className="font-medium">{entry.name}</span>
                </Table.Td>
                <Table.Td className="w-[15%]">
                  <span className="text-sm">{entry.nseSymbol}</span>
                </Table.Td>
                <Table.Td className="text-right w-[12%]">
                  <span className="font-bold">
                    ₹
                    {entry.price.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </Table.Td>
                <Table.Td className="text-right w-[12%]">
                  {/* {entry.targetPrice !== undefined ? (
                    <span className="text-sm">
                      ₹
                      {entry.targetPrice.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )} */}
                </Table.Td>
                <Table.Td className="w-[26%]">
                  {/* {entry.stopLossHit === true ? (
                    <div className="flex flex-col gap-1">
                      <Text size="sm" fw={600} c="red">
                        ✗ Stop Loss Hit in {formatTime(entry.timeToStopLossMinutes)}
                      </Text>
                    </div>
                  ) : entry.targetAchieved === true ? (
                    <div className="flex flex-col gap-1">
                      <Text size="sm" fw={600} c="green">
                        ✓ Achieved in {formatTime(entry.timeToTargetMinutes)}
                      </Text>
                    </div>
                  ) : entry.targetAchieved === false ? (
                    <div className="flex flex-col gap-1">
                      <Text size="sm" fw={600} c="red">
                        ✗ Target not achieved
                      </Text>
                    </div>
                  ) : (
                    <Text size="sm" c="dimmed">
                      N/A
                    </Text>
                  )} */}
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </div>
  );
};
