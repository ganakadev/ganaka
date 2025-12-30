import { ActionIcon, Badge, Button, Card, Checkbox, ScrollArea, Text, Title } from "@mantine/core";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
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
  // STATE
  const [selectedRunIds, setSelectedRunIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [deletingRunId, setDeletingRunId] = useState<string | null>(null);

  // API
  const getRunsAPI = dashboardAPI.useGetRunsQuery(undefined, {
    pollingInterval: 10000,
    skipPollingIfUnfocused: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
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

  // VARIABLES
  const groupedRuns = useMemo(() => getRunsAPI.data?.data ?? {}, [getRunsAPI.data]);
  const allRuns = useMemo(() => Object.values(groupedRuns).flat(), [groupedRuns]);
  const allRunIds = useMemo(() => allRuns.map((run) => run.id), [allRuns]);
  const selectedCount = selectedRunIds.size;
  const allSelected = allRunIds.length > 0 && selectedCount === allRunIds.length;
  const someSelected = selectedCount > 0 && selectedCount < allRunIds.length;

  useEffect(() => {
    const validIds = new Set(allRunIds);
    setSelectedRunIds((prev) => {
      const next = new Set<string>();
      for (const id of prev) {
        if (validIds.has(id)) {
          next.add(id);
        }
      }
      return next.size === prev.size ? prev : next;
    });
  }, [allRunIds]);

  // HANDLERS
  const handleDelete = (run: Run, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card click
    const runTimeRange = `${dayjs(run.startTime).format("YYYY-MM-DD")} ${dayjs(
      run.startTime
    ).format("HH:mm")} - ${dayjs(run.endTime).format("HH:mm")}`;
    invokeModal({
      artifact: "run",
      value: runTimeRange,
      isLoading: false,
      onConfirm: async () => {
        setDeletingRunId(run.id);
        try {
          await deleteRun({ runId: run.id }).unwrap();
          onRunDelete?.(run.id);
          setSelectedRunIds((prev) => {
            const next = new Set(prev);
            next.delete(run.id);
            return next;
          });
        } finally {
          setDeletingRunId(null);
        }
      },
    });
  };

  const handleRunSelectionChange = (runId: string, checked: boolean) => {
    setSelectedRunIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(runId);
      } else {
        next.delete(runId);
      }
      return next;
    });
  };

  const handleSelectAllChange = (checked: boolean) => {
    if (!checked) {
      setSelectedRunIds(new Set());
      return;
    }
    setSelectedRunIds(new Set(allRunIds));
  };

  const handleBulkDelete = () => {
    const runIdsToDelete = Array.from(selectedRunIds);
    if (runIdsToDelete.length === 0) {
      return;
    }

    const value =
      runIdsToDelete.length === allRunIds.length
        ? "All runs"
        : `${runIdsToDelete.length} selected ${runIdsToDelete.length === 1 ? "run" : "runs"}`;

    invokeModal({
      artifact: "runs",
      value,
      isLoading: false,
      onConfirm: async () => {
        setIsBulkDeleting(true);
        try {
          for (const runId of runIdsToDelete) {
            await deleteRun({ runId }).unwrap();
            onRunDelete?.(runId);
          }
          setSelectedRunIds(new Set());
        } finally {
          setIsBulkDeleting(false);
        }
      },
    });
  };

  // DRAW
  return (
    <div className="w-80 border-r border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Title order={4}>Runs</Title>
          <Text size="xs" c="dimmed">
            {selectedCount > 0
              ? `${selectedCount} selected`
              : `${allRunIds.length} ${allRunIds.length === 1 ? "run" : "runs"}`}
          </Text>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              size="xs"
              label="Select all"
              checked={allSelected}
              indeterminate={someSelected}
              disabled={getRunsAPI.isLoading || isBulkDeleting || allRunIds.length === 0}
              onChange={(e) => handleSelectAllChange(e.currentTarget.checked)}
            />
          </div>
          <Button
            size="xs"
            color="red"
            variant="light"
            disabled={selectedCount === 0 || getRunsAPI.isLoading}
            loading={isBulkDeleting}
            onClick={handleBulkDelete}
          >
            {allSelected ? "Delete All" : "Delete Selected"}
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {getRunsAPI.isLoading && (
            <Text size="sm" c="dimmed">
              Loading runs...
            </Text>
          )}

          {!getRunsAPI.isLoading && Object.keys(groupedRuns).length === 0 && (
            <Text size="sm" c="dimmed">
              No runs found
            </Text>
          )}

          {!getRunsAPI.isLoading &&
            Object.entries(groupedRuns).map(([date, runs]) => (
              <div key={date} className="space-y-2">
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb="xs">
                  {dayjs(date).format("MMM DD, YYYY")}
                </Text>
                {runs.map((run) => {
                  const isSelected = selectedRunIds.has(run.id);
                  const isDeletingThisRun = deletingRunId === run.id;
                  return (
                    <Card
                      key={run.id}
                      padding="sm"
                      radius="md"
                      withBorder
                      className={[
                        onRunClick
                          ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          : "",
                        isSelected ? "border-red-500/40" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() =>
                        onRunClick?.({
                          ...run,
                          startTime: new Date(run.start_datetime),
                          endTime: new Date(run.end_datetime),
                        })
                      }
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div onClick={(e) => e.stopPropagation()} title="Select run">
                              <Checkbox
                                size="xs"
                                checked={isSelected}
                                disabled={isBulkDeleting}
                                onChange={(e) =>
                                  handleRunSelectionChange(run.id, e.currentTarget.checked)
                                }
                                aria-label="Select run"
                              />
                            </div>
                            <div className="h-full min-w-0 flex-1">
                              <Text size="xs" c="dimmed" truncate className="leading-none!">
                                {dayjs(run.start_datetime).format("HH:mm")} -{" "}
                                {dayjs(run.end_datetime).format("HH:mm")}
                              </Text>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              color={run.completed ? "green" : "yellow"}
                              size="xs"
                              variant="light"
                            >
                              {run.completed ? "Completed" : "In Progress"}
                            </Badge>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              size="sm"
                              disabled={isBulkDeleting || deletingRunId !== null}
                              onClick={(e) =>
                                handleDelete(
                                  {
                                    ...run,
                                    startTime: new Date(run.start_datetime),
                                    endTime: new Date(run.end_datetime),
                                  },
                                  e
                                )
                              }
                              loading={isDeletingThisRun}
                              title="Delete run"
                            >
                              <Icon icon="mdi:delete" width={16} height={16} />
                            </ActionIcon>
                          </div>
                        </div>

                        <Text size="xs" c="dimmed">
                          {run.orderCount} {run.orderCount === 1 ? "order" : "orders"}
                        </Text>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};
