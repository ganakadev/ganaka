"use client";

import { Drawer } from "@mantine/core";
import { QuotePanel } from "./QuotePanel";
import { ShortlistEntry } from "@/types";

interface QuoteDrawerProps {
  opened: boolean;
  onClose: () => void;
  selectedEntry: ShortlistEntry | null;
  timestamp: Date | null;
  shortlistType: string | null;
}

export function QuoteDrawer({
  opened,
  onClose,
  selectedEntry,
  timestamp,
  shortlistType,
}: QuoteDrawerProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="xl"
      title={
        selectedEntry ? (
          <div className="flex flex-col gap-1">
            <h4 className="text-lg font-semibold">{selectedEntry.name}</h4>
            <span className="text-sm text-gray-500">
              {selectedEntry.nseSymbol}
            </span>
          </div>
        ) : (
          "Quote Details"
        )
      }
      padding="lg"
    >
      {selectedEntry && timestamp && shortlistType && (
        <QuotePanel
          nseSymbol={selectedEntry.nseSymbol}
          timestamp={timestamp}
          shortlistType={shortlistType}
        />
      )}
    </Drawer>
  );
}
