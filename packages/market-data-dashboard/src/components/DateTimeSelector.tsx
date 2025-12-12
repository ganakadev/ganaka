"use client";

import { DatePickerInput } from "@mantine/dates";
import { Select } from "@mantine/core";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

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
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    // Reset time selection when date changes
    setSelectedTime(null);
    onTimeChange(null);
  }, [selectedDate, onTimeChange]);

  useEffect(() => {
    if (availableTimestamps.length > 0 && !selectedTime) {
      // Default to latest timestamp
      const latestRaw = availableTimestamps[availableTimestamps.length - 1];
      const latest =
        latestRaw instanceof Date ? latestRaw : new Date(latestRaw);
      if (!isNaN(latest.getTime())) {
        setSelectedTime(latest.toISOString());
        onTimeChange(latest);
      }
    }
  }, [availableTimestamps, selectedTime, onTimeChange]);

  const timeOptions = availableTimestamps
    .map((ts) => {
      // Ensure ts is a Date object
      const date = ts instanceof Date ? ts : new Date(ts);
      return {
        value: date.toISOString(),
        label: dayjs(date).format("HH:mm:ss"),
      };
    })
    .filter((opt) => !isNaN(new Date(opt.value).getTime())); // Filter out invalid dates

  const handleTimeChange = (value: string | null) => {
    setSelectedTime(value);
    if (value) {
      onTimeChange(new Date(value));
    } else {
      onTimeChange(null);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "flex-end",
        marginBottom: "2rem",
      }}
    >
      <DatePickerInput
        label="Select Date"
        placeholder="Pick a date"
        value={selectedDate}
        onChange={onDateChange}
        maxDate={latestDate ? new Date(latestDate) : undefined}
        style={{ flex: 1 }}
      />
      <Select
        label="Select Time"
        placeholder="Pick a time"
        data={timeOptions}
        value={selectedTime}
        onChange={handleTimeChange}
        disabled={availableTimestamps.length === 0}
        style={{ flex: 1 }}
      />
    </div>
  );
}
