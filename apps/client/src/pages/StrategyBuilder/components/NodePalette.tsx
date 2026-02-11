import { Text, Paper, Stack, Badge, ScrollArea } from "@mantine/core";
import { NODE_REGISTRY } from "../nodes";
import { NODE_CATEGORY_COLORS } from "../types";

const CATEGORIES = [
  { key: "config", label: "Config" },
  { key: "dataSource", label: "Data Sources" },
  { key: "logic", label: "Logic" },
  { key: "action", label: "Actions" },
] as const;

interface NodePaletteProps {
  onAddNode: (nodeType: string) => void;
}

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const handleDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData("application/rete-node-type", nodeType);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      style={{
        width: 220,
        borderRight: "1px solid var(--mantine-color-dark-4)",
        background: "var(--mantine-color-dark-8)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ padding: "12px 12px 8px" }}>
        <Text size="sm" fw={600} c="dimmed">
          Node Palette
        </Text>
      </div>
      <ScrollArea style={{ flex: 1 }} scrollbarSize={6}>
        <Stack gap={12} style={{ padding: "0 12px 12px" }}>
          {CATEGORIES.map(({ key, label }) => {
            const entries = Object.entries(NODE_REGISTRY).filter(
              ([, entry]) => entry.category === key
            );
            if (entries.length === 0) return null;

            return (
              <div key={key}>
                <Badge
                  size="xs"
                  variant="light"
                  color="gray"
                  style={{ marginBottom: 6 }}
                >
                  {label}
                </Badge>
                <Stack gap={4}>
                  {entries.map(([nodeType, entry]) => (
                    <Paper
                      key={nodeType}
                      shadow="none"
                      p="xs"
                      style={{
                        cursor: "grab",
                        borderLeft: `3px solid ${NODE_CATEGORY_COLORS[entry.category]}`,
                        background: "var(--mantine-color-dark-6)",
                        transition: "background 0.15s",
                      }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, nodeType)}
                      onClick={() => onAddNode(nodeType)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--mantine-color-dark-5)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "var(--mantine-color-dark-6)")
                      }
                    >
                      <Text size="xs" fw={500}>
                        {entry.label}
                      </Text>
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {entry.description}
                      </Text>
                    </Paper>
                  ))}
                </Stack>
              </div>
            );
          })}
        </Stack>
      </ScrollArea>
    </div>
  );
}
