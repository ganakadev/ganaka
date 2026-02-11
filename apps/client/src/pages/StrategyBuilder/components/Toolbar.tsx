import { Button, Group } from "@mantine/core";

interface ToolbarProps {
  onAutoArrange: () => void;
  onGenerateCode: () => void;
  onClear: () => void;
  onZoomToFit: () => void;
}

export function Toolbar({
  onAutoArrange,
  onGenerateCode,
  onClear,
  onZoomToFit,
}: ToolbarProps) {
  return (
    <div
      style={{
        padding: "8px 16px",
        borderBottom: "1px solid var(--mantine-color-dark-4)",
        background: "var(--mantine-color-dark-8)",
      }}
    >
      <Group gap="xs">
        <Button size="xs" variant="default" onClick={onAutoArrange}>
          Auto Arrange
        </Button>
        <Button size="xs" variant="default" onClick={onZoomToFit}>
          Fit View
        </Button>
        <Button size="xs" variant="default" onClick={onClear}>
          Clear
        </Button>
        <div style={{ flex: 1 }} />
        <Button size="xs" variant="filled" onClick={onGenerateCode}>
          Generate Code
        </Button>
      </Group>
    </div>
  );
}
