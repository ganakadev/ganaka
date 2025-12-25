import { SegmentedControl } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { useState } from "react";
import { dashboardAPI } from "../store/api/dashboardApi";
import { useRTKNotifier } from "../utils/hooks/useRTKNotifier";

export const PageHeader = ({
  onDateChange,
  activeTab,
  setActiveTab,
}: {
  activeTab: "TOP_GAINERS" | "VOLUME_SHOCKERS" | null;
  setActiveTab: (value: "TOP_GAINERS" | "VOLUME_SHOCKERS") => void;
  onDateChange: (date: Date) => void;
}) => {
  // STATE
  const [timePresets, setTimePresets] = useState<string[]>([]);

  // API
  const {
    data: availableDatetimes,
    isLoading: loading,
    error: getAvailableDatetimesAPIError,
  } = dashboardAPI.useGetAvailableDatetimesQuery({});
  useRTKNotifier({
    requestName: "Get Available Datetimes",
    error: getAvailableDatetimesAPIError,
  });

  // HANDLERS
  // Get available times for a specific date
  const getAvailableTimesForDate = (date: string | null): string[] => {
    if (!date || !availableDatetimes) return [];
    const dateKey = dayjs(date).format("YYYY-MM-DD");
    const dateData = availableDatetimes.data.dates.find(
      (d) => d.date === dateKey
    );
    if (!dateData) return [];
    return Array.from(
      new Set(dateData.timestamps.map((ts) => dayjs(ts).format("HH:mm")))
    );
  };

  // Check if a date has any available data
  const isDateAvailable = (date: Date): boolean => {
    const dateKey = dayjs(date).format("YYYY-MM-DD");
    return (
      availableDatetimes?.data.dates?.some((d) => {
        return d.date === dateKey;
      }) ?? false
    );
  };

  // Handle date/time change with validation
  const handleChange = (value: string | null) => {
    if (value) {
      const selectedDate = dayjs(value);
      setTimePresets(
        getAvailableTimesForDate(dayjs(selectedDate).format("YYYY-MM-DD"))
      );

      // only update state if the time is not at default (00:00)
      if (selectedDate.format("HH:mm") !== "00:00") {
        onDateChange(selectedDate.toDate());
      }
    }
  };

  const excludeDate = (date: string): boolean => {
    const dateDayjs = dayjs(date);
    // Exclude weekends
    const day = dateDayjs.day();
    if (day === 6 || day === 0) return true;

    // Exclude dates without data
    if (availableDatetimes && !isDateAvailable(dateDayjs.toDate())) {
      return true;
    }
    return false;
  };

  // DRAW
  return (
    <div className="flex gap-4 items-end mb-4 sticky top-0 bg-(--mantine-color-body) z-10">
      <div className="w-full max-w-xs">
        <DateTimePicker
          label="Pick date and time"
          placeholder="Pick date and time"
          valueFormat="DD MMM YYYY hh:mm A"
          className="w-full"
          onChange={handleChange}
          excludeDate={excludeDate}
          hideOutsideDates={true}
          highlightToday
          timePickerProps={{
            withDropdown: true,
            format: "12h",
            presets: timePresets,
          }}
          disabled={loading}
        />
      </div>
      <SegmentedControl
        value={activeTab ?? undefined}
        onChange={(value) => {
          setActiveTab(value as "TOP_GAINERS" | "VOLUME_SHOCKERS");
        }}
        data={[
          { value: "TOP_GAINERS", label: "Top Gainers" },
          { value: "VOLUME_SHOCKERS", label: "Volume Shockers" },
        ]}
      />
    </div>
  );
};
