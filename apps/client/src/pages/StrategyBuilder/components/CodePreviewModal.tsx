import { Modal, Button, CopyButton, ScrollArea, Text } from "@mantine/core";

interface CodePreviewModalProps {
  opened: boolean;
  onClose: () => void;
  code: string;
}

export function CodePreviewModal({
  opened,
  onClose,
  code,
}: CodePreviewModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Generated Strategy Code"
      size="xl"
      styles={{
        body: { padding: 0 },
      }}
    >
      <div style={{ padding: "0 16px 8px" }}>
        <Text size="xs" c="dimmed">
          This is the TypeScript code generated from your visual strategy. Copy
          it to use with the Ganaka SDK.
        </Text>
      </div>
      <ScrollArea h={500} style={{ padding: "0 16px" }}>
        <pre
          style={{
            background: "var(--mantine-color-dark-8)",
            padding: 16,
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 1.6,
            overflow: "auto",
            whiteSpace: "pre",
            margin: 0,
            color: "var(--mantine-color-gray-3)",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {code || "// No code generated. Build a strategy first."}
        </pre>
      </ScrollArea>
      <div style={{ padding: "12px 16px", display: "flex", justifyContent: "flex-end" }}>
        <CopyButton value={code}>
          {({ copied, copy }) => (
            <Button
              size="xs"
              variant={copied ? "filled" : "default"}
              color={copied ? "teal" : undefined}
              onClick={copy}
            >
              {copied ? "Copied" : "Copy to Clipboard"}
            </Button>
          )}
        </CopyButton>
      </div>
    </Modal>
  );
}
