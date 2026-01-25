import { Button, Checkbox, Group, Paper, Table, Text, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useState } from "react";
import {
  useAddHolidaysMutation,
  useDeleteDatesMutation,
  useGetAvailableDatesQuery,
  useGetHolidaysQuery,
  useRemoveHolidaysMutation,
} from "../../store/api/adminApi";
import { useRTKNotifier } from "../../utils/hooks/useRTKNotifier";

dayjs.extend(utc);
dayjs.extend(timezone);

export const Admin = () => {
  // STATE - Data Management
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  // STATE - Holiday Management
  const [holidayDate, setHolidayDate] = useState<Date | null>(null);
  const [selectedHolidays, setSelectedHolidays] = useState<Set<string>>(new Set());

  // API - Data Management
  const getAvailableDatesAPI = useGetAvailableDatesQuery();
  useRTKNotifier({
    requestName: "Get Available Dates",
    error: getAvailableDatesAPI.error,
  });

  const [deleteDatesMutation, { isLoading: isDeletingDates }] = useDeleteDatesMutation();

  // API - Holiday Management
  const getHolidaysAPI = useGetHolidaysQuery();
  useRTKNotifier({
    requestName: "Get Holidays",
    error: getHolidaysAPI.error,
  });

  const [addHolidaysMutation, { isLoading: isAddingHolidays }] = useAddHolidaysMutation();
  const [removeHolidaysMutation, { isLoading: isRemovingHolidays }] = useRemoveHolidaysMutation();

  // HANDLERS - Data Management
  const handleDateToggle = (date: string) => {
    const newSelected = new Set(selectedDates);
    if (newSelected.has(date)) {
      newSelected.delete(date);
    } else {
      newSelected.add(date);
    }
    setSelectedDates(newSelected);
  };

  const handleSelectAllDates = () => {
    if (getAvailableDatesAPI.data?.data.dates) {
      if (selectedDates.size === getAvailableDatesAPI.data.data.dates.length) {
        setSelectedDates(new Set());
      } else {
        setSelectedDates(new Set(getAvailableDatesAPI.data.data.dates.map((d) => d.date)));
      }
    }
  };

  const handleDeleteDates = async () => {
    if (selectedDates.size === 0) {
      notifications.show({
        title: "No dates selected",
        message: "Please select at least one date to delete",
        color: "yellow",
      });
      return;
    }

    try {
      await deleteDatesMutation({ dates: Array.from(selectedDates) }).unwrap();
      notifications.show({
        title: "Success",
        message: `Deleted data for ${selectedDates.size} date(s)`,
        color: "green",
      });
      setSelectedDates(new Set());
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete data",
        color: "red",
      });
    }
  };

  // HANDLERS - Holiday Management
  const handleAddHoliday = async () => {
    if (!holidayDate) {
      notifications.show({
        title: "No date selected",
        message: "Please select a date to add as holiday",
        color: "yellow",
      });
      return;
    }

    const dateStr = dayjs(holidayDate).format("YYYY-MM-DD");
    try {
      await addHolidaysMutation({ dates: [dateStr] }).unwrap();
      notifications.show({
        title: "Success",
        message: `Added holiday for ${dateStr}`,
        color: "green",
      });
      setHolidayDate(null);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? String((error.data as { message?: string }).message || "Failed to add holiday")
          : "Failed to add holiday";
      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
      });
    }
  };

  const handleHolidayToggle = (date: string) => {
    const newSelected = new Set(selectedHolidays);
    if (newSelected.has(date)) {
      newSelected.delete(date);
    } else {
      newSelected.add(date);
    }
    setSelectedHolidays(newSelected);
  };

  const handleSelectAllHolidays = () => {
    if (getHolidaysAPI.data?.data.holidays) {
      if (selectedHolidays.size === getHolidaysAPI.data.data.holidays.length) {
        setSelectedHolidays(new Set());
      } else {
        setSelectedHolidays(
          new Set(getHolidaysAPI.data.data.holidays.map((h) => h.date))
        );
      }
    }
  };

  const handleRemoveHolidays = async () => {
    if (selectedHolidays.size === 0) {
      notifications.show({
        title: "No holidays selected",
        message: "Please select at least one holiday to remove",
        color: "yellow",
      });
      return;
    }

    try {
      await removeHolidaysMutation({ dates: Array.from(selectedHolidays) }).unwrap();
      notifications.show({
        title: "Success",
        message: `Removed ${selectedHolidays.size} holiday(s)`,
        color: "green",
      });
      setSelectedHolidays(new Set());
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to remove holidays",
        color: "red",
      });
    }
  };

  // DRAW
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Title order={1} mb="xl">
        Admin Console
      </Title>

      <div className="grid grid-cols-2 gap-6">
        {/* Data Management Section */}
        <Paper p="md" withBorder>
          <Title order={2} mb="md">
            Data Management
          </Title>
          <Text c="dimmed" mb="md">
            Select dates to delete all recorded data (shortlists, quotes, nifty quotes) for those
            dates.
          </Text>

          {getAvailableDatesAPI.isLoading ? (
            <Text>Loading available dates...</Text>
          ) : getAvailableDatesAPI.data?.data.dates.length === 0 ? (
            <Text c="dimmed">No data available</Text>
          ) : (
            <>
              <Group mb="md">
                <Button
                  variant="light"
                  onClick={handleSelectAllDates}
                  disabled={!getAvailableDatesAPI.data?.data.dates}
                >
                  {selectedDates.size === getAvailableDatesAPI.data?.data.dates.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
                <Button
                  color="red"
                  onClick={() => {
                    handleDeleteDates().catch((error) => console.error(error))
                  }}
                  disabled={selectedDates.size === 0 || isDeletingDates}
                  loading={isDeletingDates}
                >
                  Delete Selected ({selectedDates.size})
                </Button>
              </Group>

              <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ width: "50px" }}>
                      <Checkbox
                        checked={
                          getAvailableDatesAPI.data?.data.dates &&
                          selectedDates.size === getAvailableDatesAPI.data.data.dates.length &&
                          selectedDates.size > 0
                        }
                        indeterminate={
                          selectedDates.size > 0 &&
                          selectedDates.size < (getAvailableDatesAPI.data?.data.dates.length || 0)
                        }
                        onChange={handleSelectAllDates}
                      />
                    </Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th ta="right">Shortlists</Table.Th>
                    <Table.Th ta="right">Quotes</Table.Th>
                    <Table.Th ta="right">Nifty Quotes</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {getAvailableDatesAPI.data?.data.dates.map((dateInfo) => (
                    <Table.Tr key={dateInfo.date}>
                      <Table.Td>
                        <Checkbox
                          checked={selectedDates.has(dateInfo.date)}
                          onChange={() => handleDateToggle(dateInfo.date)}
                        />
                      </Table.Td>
                      <Table.Td>{dateInfo.date}</Table.Td>
                      <Table.Td ta="right">{dateInfo.shortlistCount}</Table.Td>
                      <Table.Td ta="right">{dateInfo.quoteCount}</Table.Td>
                      <Table.Td ta="right">{dateInfo.niftyCount}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </>
          )}
        </Paper>

        {/* Holiday Management Section */}
        <Paper p="md" withBorder>
          <Title order={2} mb="md">
            NSE Holiday Management
          </Title>
          <Text c="dimmed" mb="md">
            Manage NSE holidays. The collector will not run on days marked as holidays.
          </Text>

          <Group mb="md">
            <DatePickerInput
              label="Add Holiday"
              placeholder="Select date"
              value={holidayDate}
              onChange={(value) => {
                if (value) {
                  setHolidayDate(new Date(value))
                }
              }}
              clearable
            />
            <Button
              onClick={() => {
                handleAddHoliday().catch((error) => console.error(error))
              }}
              disabled={!holidayDate || isAddingHolidays}
              loading={isAddingHolidays}
              style={{ marginTop: "24px" }}
            >
              Add Holiday
            </Button>
          </Group>

          {getHolidaysAPI.isLoading ? (
            <Text>Loading holidays...</Text>
          ) : getHolidaysAPI.data?.data.holidays.length === 0 ? (
            <Text c="dimmed">No holidays configured</Text>
          ) : (
            <>
              <Group mb="md">
                <Button
                  variant="light"
                  onClick={handleSelectAllHolidays}
                  disabled={!getHolidaysAPI.data?.data.holidays}
                >
                  {selectedHolidays.size === getHolidaysAPI.data?.data.holidays.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
                <Button
                  color="red"
                  onClick={() => {
                    handleRemoveHolidays().catch((error) => console.error(error))
                  }}
                  disabled={selectedHolidays.size === 0 || isRemovingHolidays}
                  loading={isRemovingHolidays}
                >
                  Remove Selected ({selectedHolidays.size})
                </Button>
              </Group>

              <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ width: "50px" }}>
                      <Checkbox
                        checked={
                          getHolidaysAPI.data?.data.holidays &&
                          selectedHolidays.size === getHolidaysAPI.data.data.holidays.length &&
                          selectedHolidays.size > 0
                        }
                        indeterminate={
                          selectedHolidays.size > 0 &&
                          selectedHolidays.size < (getHolidaysAPI.data?.data.holidays.length || 0)
                        }
                        onChange={handleSelectAllHolidays}
                      />
                    </Table.Th>
                    <Table.Th>Date</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {getHolidaysAPI.data?.data.holidays.map((holiday) => (
                    <Table.Tr key={holiday.id}>
                      <Table.Td>
                        <Checkbox
                          checked={selectedHolidays.has(holiday.date)}
                          onChange={() => handleHolidayToggle(holiday.date)}
                        />
                      </Table.Td>
                      <Table.Td>{holiday.date}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </>
          )}
        </Paper>
      </div>
    </div>
  );
};
