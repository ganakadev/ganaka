"use client";

import { DateTimePicker, getTimeRange } from "@mantine/dates";
import { useEffect } from "react";

interface DateTimeSelectorProps {
  selectedDate: Date | null;
  availableTimestamps: Date[];
  onDateChange: (date: Date | null) => void;
  onTimeChange: (timestamp: Date | null) => void;
  latestDate: string | null;
}

export function DateTimeSelector({
  selectedDate,
  availableTimestamps,
  onDateChange,
  onTimeChange,
  latestDate,
}: DateTimeSelectorProps) {
  // DRAW
  return (
    <div className="flex gap-4 items-end mb-4 max-w-sm">
      <DateTimePicker
        label="Pick date and time"
        placeholder="Pick date and time"
        value={selectedDate}
        dropdownType="modal"
        valueFormat="DD MMM YYYY hh:mm A"
        className="w-full"
        onChange={(date) => {
          // onDateChange(date);
          // if (date) {
          //   onTimeChange(date);
          // }
        }}
        maxDate={latestDate ? new Date(latestDate) : undefined}
        excludeDate={(date) =>
          new Date(date).getDay() === 6 || new Date(date).getDay() === 0
        }
        timePickerProps={{
          withDropdown: true,
          format: "12h",
          presets: getTimeRange({
            startTime: "09:15:00",
            endTime: "15:30:00",
            interval: "0:1:0",
          }),
        }}
      />
    </div>
  );
}
