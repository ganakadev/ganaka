import { Avatar, Menu, NumberInput, SegmentedControl } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { dashboardAPI } from "../../../store/api/dashboardApi";
import { useRTKNotifier } from "../../../utils/hooks/useRTKNotifier";
import { useNavigate, useSearchParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { authLocalStorage } from "../../../utils/authLocalStorage";
import { formatDateTimeForURL } from "../../../utils/dateFormatting";

dayjs.extend(utc);
dayjs.extend(timezone);

export const Header = ({
  activeTab,
  setActiveTab,
  selectedDate,
  setSelectedDate,
  takeProfitPercentage,
  setTakeProfitPercentage,
  stopLossPercentage,
  setStopLossPercentage,
}: {
  activeTab: "TOP_GAINERS" | "VOLUME_SHOCKERS" | null;
  setActiveTab: (value: "TOP_GAINERS" | "VOLUME_SHOCKERS") => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  takeProfitPercentage: number;
  setTakeProfitPercentage: (value: number) => void;
  stopLossPercentage: number;
  setStopLossPercentage: (value: number) => void;
}) => {
  // HOOKS
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const shouldProcessSearchParamDate = useRef(true);

  // STATE
  const [localSelectedDate, setLocalSelectedDate] = useState<Date | null>(null);
  const [timePresets, setTimePresets] = useState<string[]>([]);

  // API
  const getAvailableDatetimesAPI = dashboardAPI.useGetAvailableDatetimesQuery({});
  useRTKNotifier({
    requestName: "Get Available Datetimes",
    error: getAvailableDatetimesAPI.error,
  });

  // HANDLERS
  // Get available times for a specific date
  const getAvailableTimesForDate = useCallback(
    (date: string | null): string[] => {
      if (!date || !getAvailableDatetimesAPI.data) return [];
      const dateKey = dayjs(date).format("YYYY-MM-DD");
      const dateData = getAvailableDatetimesAPI.data.data.dates.find((d) => d.date === dateKey);
      if (!dateData) return [];
      // API returns UTC timestamps, convert to local time for display
      return Array.from(
        new Set(dateData.timestamps.map((ts) => dayjs.utc(ts).tz("Asia/Kolkata").format("HH:mm")))
      );
    },
    [getAvailableDatetimesAPI.data]
  );
  // Check if a date has any available data
  const isDateAvailable = (date: Date): boolean => {
    const dateKey = dayjs(date).format("YYYY-MM-DD");
    return (
      getAvailableDatetimesAPI.data?.data.dates?.some((d) => {
        return d.date === dateKey;
      }) ?? false
    );
  };
  // Handle date/time change with validation
  const handleChange = (value: string | null) => {
    if (value) {
      const valueDayjs = dayjs(value);
      setLocalSelectedDate(valueDayjs.toDate());
      setTimePresets(getAvailableTimesForDate(dayjs(valueDayjs).format("YYYY-MM-DD")));

      // only update state if the time is not at default (00:00)
      if (valueDayjs.format("HH:mm") !== "00:00") {
        // Store datetime in UTC format for search params (YYYY-MM-DDTHH:mm:ss)
        const utcDateTime = formatDateTimeForURL(valueDayjs.toDate());
        searchParams.set("date", utcDateTime);
        setSearchParams(searchParams);
        setSelectedDate(valueDayjs.toDate());
        setLocalSelectedDate(valueDayjs.toDate());
      }
    }
  };
  const excludeDate = (date: string): boolean => {
    const dateDayjs = dayjs(date);
    // Exclude weekends
    const day = dateDayjs.day();
    if (day === 6 || day === 0) return true;

    // Exclude dates without data
    if (getAvailableDatetimesAPI.data && !isDateAvailable(dateDayjs.toDate())) {
      return true;
    }
    return false;
  };
  const processSearchParamDate = useCallback(
    (date: string) => {
      try {
        // Parse the UTC datetime string from search params
        const dateDayjs = dayjs.utc(date);
        if (!dateDayjs.isValid()) {
          notifications.show({
            title: "Invalid date",
            message: "The date you provided is invalid",
            color: "red",
          });
          return;
        }

        const dateKey = dateDayjs.format("YYYY-MM-DD");
        if (
          !getAvailableDatetimesAPI.data?.data.dates?.some((d) => {
            return d.date === dateKey;
          })
        ) {
          notifications.show({
            title: "No data available",
            message: "No data available for the date you provided",
            color: "red",
          });
          searchParams.delete("date");
          setSearchParams(searchParams);
          return;
        }

        // Compare UTC timestamps - API returns UTC strings in YYYY-MM-DDTHH:mm:ss format
        const timeMatch = getAvailableDatetimesAPI.data?.data.dates
          ?.find((d) => d.date === dateKey)
          ?.timestamps.find((timestamp) => {
            // Compare UTC times
            return dayjs.utc(timestamp).format("HH:mm") === dateDayjs.format("HH:mm");
          });

        if (!timeMatch) {
          notifications.show({
            title: "No data available",
            message: "No data available for the time you provided",
            color: "red",
          });
          searchParams.delete("date");
          setSearchParams(searchParams);
          return;
        }

        setTimePresets(getAvailableTimesForDate(dateKey));
        // Convert UTC datetime to local Date object for the picker
        setSelectedDate(dateDayjs.toDate());
        setLocalSelectedDate(dateDayjs.toDate());
      } catch (error) {
        console.error(error);
      }
    },
    [
      getAvailableDatetimesAPI.data,
      getAvailableTimesForDate,
      setSearchParams,
      setSelectedDate,
      searchParams,
    ]
  );

  // HANDLERS
  const handleLogout = () => {
    authLocalStorage.logout();
    const result = navigate("/signin");
    if (result instanceof Promise) {
      result.catch((error) => {
        console.error("Error navigating to signin:", error);
      });
    }
  };

  // VARIABLES
  const username = authLocalStorage.getUsername();

  // EFFECTS
  useEffect(() => {
    if (getAvailableDatetimesAPI.data && shouldProcessSearchParamDate.current) {
      shouldProcessSearchParamDate.current = false;
      const date = searchParams.get("date");
      if (date) {
        startTransition(() => {
          console.log("processSearchParamDate", date);
          processSearchParamDate(date);
        });
      }
    }
  }, [searchParams, getAvailableDatetimesAPI.data, processSearchParamDate]);

  // DRAW
  return (
    <div className="flex gap-4 items-end mb-4 sticky top-0 bg-(--mantine-color-body) z-10 justify-between">
      <div className="flex gap-4 items-end w-full">
        <div className="w-full max-w-xs">
          <DateTimePicker
            label="Pick date and time"
            placeholder="Pick date and time"
            valueFormat="DD MMM YYYY hh:mm A"
            className="w-full"
            value={selectedDate ?? localSelectedDate}
            onChange={handleChange}
            excludeDate={excludeDate}
            hideOutsideDates={true}
            highlightToday
            timePickerProps={{
              withDropdown: true,
              format: "12h",
              presets: timePresets,
            }}
            disabled={getAvailableDatetimesAPI.isLoading}
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
        <div className="flex gap-2">
          <NumberInput
            label="Take Profit %"
            placeholder="2"
            value={takeProfitPercentage}
            onChange={(value) => setTakeProfitPercentage(Number(value) || 0)}
            min={0}
            max={100}
            step={0.1}
            decimalScale={2}
            className="w-24"
            size="sm"
          />
          <NumberInput
            label="Stop Loss %"
            placeholder="1.5"
            value={stopLossPercentage}
            onChange={(value) => setStopLossPercentage(Number(value) || 0)}
            min={0}
            max={100}
            step={0.1}
            decimalScale={2}
            className="w-24"
            size="sm"
          />
        </div>
      </div>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Avatar
            color="initials"
            radius="xl"
            style={{ cursor: "pointer" }}
            title={username || "User"}
            name={username || "User"}
          />
        </Menu.Target>
        <Menu.Dropdown>
          {username && <Menu.Label>{username.toUpperCase()}</Menu.Label>}
          <Menu.Item onClick={handleLogout} color="red">
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};
