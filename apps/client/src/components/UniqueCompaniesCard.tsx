import { Card, Skeleton } from "@mantine/core";
import { dashboardAPI } from "../store/api/dashboardApi";
import { useRTKNotifier } from "../utils/hooks/useRTKNotifier";

export const UniqueCompaniesCard = ({
  selectedDate,
  activeTab,
}: {
  selectedDate: Date | null;
  activeTab: "TOP_GAINERS" | "VOLUME_SHOCKERS" | null;
}) => {
  // API
  // Fetch unique companies count
  const {
    data,
    isLoading: loading,
    error,
  } = dashboardAPI.useGetDailyUniqueCompaniesQuery(
    {
      date: selectedDate?.toISOString() || "",
      type: activeTab || "TOP_GAINERS",
    },
    {
      skip: !selectedDate || !activeTab,
    }
  );
  useRTKNotifier({
    requestName: "Get Daily Unique Companies",
    error: error,
  });

  // VARIABLES
  const uniqueCount = data?.data.uniqueCount ?? null;
  const errorMessage = error
    ? "data" in error &&
      typeof error.data === "object" &&
      error.data !== null &&
      "error" in error.data
      ? String(error.data.error)
      : "Failed to fetch unique companies count"
    : null;

  // DRAW
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-gray-400">
          Unique Companies across the day
        </h3>
        {loading ? (
          <Skeleton height={40} width="100%" />
        ) : errorMessage ? (
          <p className="text-sm text-red-500">{errorMessage}</p>
        ) : !selectedDate ? (
          <p className="text-sm text-gray-500">No date selected</p>
        ) : uniqueCount !== null ? (
          <p className="text-3xl font-bold tabular-nums">{uniqueCount}</p>
        ) : (
          <p className="text-sm text-gray-500">No data available</p>
        )}
      </div>
    </Card>
  );
};
