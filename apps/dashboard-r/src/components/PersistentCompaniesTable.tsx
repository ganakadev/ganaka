import { Skeleton, Table } from "@mantine/core";
import { times } from "lodash";

export interface PersistentCompany {
  nseSymbol: string;
  name: string;
  count: number;
  percentage: number;
}

export const PersistentCompaniesTable = ({
  companies,
  loading,
  onRowClick,
  totalSnapshots,
  selectedDate,
}: {
  companies: PersistentCompany[];
  loading: boolean;
  selectedDate: Date | null;
  onRowClick?: (company: PersistentCompany) => void;
  totalSnapshots?: number;
}) => {
  // DRAW
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">
        Persistent Companies across the day
      </h3>
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
            <Table.Th className="w-[40%]">Company Name</Table.Th>
            <Table.Th className="w-[25%]">Symbol</Table.Th>
            <Table.Th className="w-[15%]">Occurrences</Table.Th>
            <Table.Th className="w-[15%]">Occurrences %</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {!selectedDate ? (
            <Table.Tr>
              <Table.Td colSpan={4} className="text-center py-8">
                <p className="text-sm text-gray-500">No date selected</p>
              </Table.Td>
            </Table.Tr>
          ) : loading ? (
            times(10, (index) => (
              <Table.Tr key={index}>
                <Table.Td className="w-[40%]">
                  <Skeleton height={20} width="100%" />
                </Table.Td>
                <Table.Td className="w-[25%]">
                  <Skeleton height={20} width="100%" />
                </Table.Td>
                <Table.Td className="w-[15%]">
                  <Skeleton height={20} width="100%" />
                </Table.Td>
                <Table.Td className="w-[20%]">
                  <Skeleton height={20} width="100%" />
                </Table.Td>
              </Table.Tr>
            ))
          ) : companies.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={4} className="text-center py-8">
                <p className="text-sm text-gray-500">
                  No persistent companies found
                </p>
              </Table.Td>
            </Table.Tr>
          ) : (
            companies.map((company, index) => (
              <Table.Tr
                key={`${company.nseSymbol}-${index}`}
                className={onRowClick ? "cursor-pointer" : ""}
                onClick={() => onRowClick?.(company)}
              >
                <Table.Td className="w-[40%]">
                  <span className="font-medium">{company.name}</span>
                </Table.Td>
                <Table.Td className="w-[25%]">
                  <span className="text-sm">{company.nseSymbol}</span>
                </Table.Td>
                <Table.Td className="w-[15%]">
                  <span className="text-sm">
                    {totalSnapshots
                      ? `${company.count} / ${totalSnapshots}`
                      : company.count}
                  </span>
                </Table.Td>
                <Table.Td className="w-[20%]">
                  <span className="text-sm">
                    {company.percentage.toFixed(1)}%
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

