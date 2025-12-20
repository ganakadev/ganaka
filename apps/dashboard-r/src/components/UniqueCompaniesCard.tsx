import { Card, Skeleton } from "@mantine/core";
import { useGetDailyUniqueCompaniesQuery } from "@/store/api";

export const UniqueCompaniesCard = ({
  selectedDate,
  activeTab,
}: {
  selectedDate: Date | null;
  activeTab: "TOP_GAINERS" | "VOLUME_SHOCKERS" | null;
}) => {
  // Use RTKQ hook
  const {
    data: uniqueCompaniesData,
    isLoading: loading,
    error,
  } = useGetDailyUniqueCompaniesQuery(
    {
      date: selectedDate?.toISOString() || "",
      type: activeTab || "TOP_GAINERS",
    },
    {
      skip: !selectedDate || !activeTab,
    }
  );

  // DRAW
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-gray-400">
          Unique Companies across the day
        </h3>
        {loading ? (
          <Skeleton height={40} width="100%" />
        ) : error ? (
          <p className="text-sm text-red-500">
            {"error" in error ? String(error.error) : "Failed to fetch unique companies count"}
          </p>
        ) : !selectedDate ? (
          <p className="text-sm text-gray-500">No date selected</p>
        ) : uniqueCompaniesData ? (
          <p className="text-3xl font-bold tabular-nums">{uniqueCompaniesData.uniqueCount}</p>
        ) : (
          <p className="text-sm text-gray-500">No data available</p>
        )}
      </div>
    </Card>
  );
};

