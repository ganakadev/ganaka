import { ScrollArea, Card, Badge, Text, Group, Stack, Title, ActionIcon } from "@mantine/core";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { dashboardAPI } from "../../../store/api/dashboardApi";
import type { Run } from "../../../types";
import { useRTKNotifier } from "../../../utils/hooks/useRTKNotifier";
import { useDeleteConfirmModal } from "../../../utils/hooks/useDeleteConfirmModal";

export const RunsSidebar = ({
  onRunClick,
  onRunDelete,
}: {
  onRunClick?: (run: Run) => void;
  onRunDelete?: (runId: string) => void;
}) => {
  // API
  const getRunsAPI = dashboardAPI.useGetRunsQuery();
  useRTKNotifier({
    requestName: "Get Runs",
    error: getRunsAPI.error,
  });
  // Delete mutation
  const [deleteRun, deleteRunAPI] = dashboardAPI.useDeleteRunMutation();
  useRTKNotifier({
    requestName: "Delete Run",
    error: deleteRunAPI.error,
  });

  // HOOKS
  // Delete confirmation modal
  const { invokeModal } = useDeleteConfirmModal();

  // GUARDS
  if (getRunsAPI.isLoading) {
    return (
      <div className="w-80 border-r border-gray-700 p-4">
        <Text size="sm" c="dimmed">
          Loading runs...
        </Text>
      </div>
    );
  }

  if (!getRunsAPI.data?.data || Object.keys(getRunsAPI.data.data).length === 0) {
    return (
      <div className="w-80 border-r border-gray-700 p-4">
        <Text size="sm" c="dimmed">
          No runs found
        </Text>
      </div>
    );
  }

  // HANDLERS
  const handleDelete = (run: Run, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    const runTimeRange = `${dayjs(run.startTime).format("YYYY-MM-DD")} ${dayjs(
      run.startTime
    ).format("HH:mm")} - ${dayjs(run.endTime).format("HH:mm")}`;
    invokeModal({
      artifact: "run",
      value: runTimeRange,
      isLoading: deleteRunAPI.isLoading,
      onConfirm: async () => {
        await deleteRun({ runId: run.id }).unwrap();
        onRunDelete?.(run.id);
      },
    });
  };

  // VARIABLES
  const groupedRuns = getRunsAPI.data?.data;

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
                <Card
                  key={run.id}
                  padding="sm"
                  radius="md"
                  withBorder
                  className={
                    onRunClick
                      ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      : ""
                  }
                  onClick={() => onRunClick?.(run)}
                >
                  <Stack gap="xs">
                    <Group justify="space-between" align="flex-start">
                      <div className="flex-1 min-w-0">
                        <Text size="xs" c="dimmed" truncate>
                          {dayjs(run.startTime).format("HH:mm")} -{" "}
                          {dayjs(run.endTime).format("HH:mm")}
                        </Text>
                      </div>
                      <Group gap="xs">
                        <Badge color={run.completed ? "green" : "yellow"} size="xs" variant="light">
                          {run.completed ? "Completed" : "In Progress"}
                        </Badge>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          size="sm"
                          onClick={(e) => handleDelete(run, e)}
                          loading={deleteRunAPI.isLoading}
                          title="Delete run"
                        >
                          <Icon icon="mdi:delete" width={16} height={16} />
                        </ActionIcon>
                      </Group>
                    </Group>
                    <Text size="xs" c="dimmed">
                      {run.orderCount} {run.orderCount === 1 ? "order" : "orders"}
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
