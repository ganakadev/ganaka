import {
  ScrollArea,
  Card,
  Badge,
  Text,
  Group,
  Stack,
  Title,
} from "@mantine/core";
import dayjs from "dayjs";
import { dashboardAPI } from "../store/api/dashboardApi";
import { useRTKNotifier } from "../utils/hooks/useRTKNotifier";

export const RunsSidebar = () => {
  // API
  const {
    data: runsData,
    isLoading,
    error: getRunsAPIError,
  } = dashboardAPI.useGetRunsQuery();
  useRTKNotifier({
    requestName: "Get Runs",
    error: getRunsAPIError,
  });

  // GUARDS
  if (isLoading) {
    return (
      <div className="w-80 border-r border-gray-700 p-4">
        <Text size="sm" c="dimmed">
          Loading runs...
        </Text>
      </div>
    );
  }

  if (!runsData?.data || Object.keys(runsData.data).length === 0) {
    return (
      <div className="w-80 border-r border-gray-700 p-4">
        <Text size="sm" c="dimmed">
          No runs found
        </Text>
      </div>
    );
  }

  // VARIABLES
  const groupedRuns = runsData.data;

  // DRAW
  return (
    <div className="w-80 border-r border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <Title order={4}>Runs</Title>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {Object.entries(groupedRuns).map(([date, runs]) => (
            <div key={date} className="space-y-2">
              <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb="xs">
                {dayjs(date).format("MMM DD, YYYY")}
              </Text>
              {runs.map((run) => (
                <Card key={run.id} padding="sm" radius="md" withBorder>
                  <Stack gap="xs">
                    <Group justify="space-between" align="flex-start">
                      <div className="flex-1 min-w-0">
                        <Text size="xs" c="dimmed" truncate>
                          {dayjs(run.startTime).format("HH:mm")} -{" "}
                          {dayjs(run.endTime).format("HH:mm")}
                        </Text>
                      </div>
                      <Badge
                        color={run.completed ? "green" : "yellow"}
                        size="xs"
                        variant="light"
                      >
                        {run.completed ? "Completed" : "In Progress"}
                      </Badge>
                    </Group>
                    <Text size="xs" c="dimmed">
                      {run.orderCount}{" "}
                      {run.orderCount === 1 ? "order" : "orders"}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
