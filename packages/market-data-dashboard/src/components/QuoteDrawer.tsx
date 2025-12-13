"use client";

import { Badge, Drawer } from "@mantine/core";
import { QuoteData, ShortlistEntry } from "@/types";

export function QuotePanel({
  quoteData,
  buyerControlPercentage,
}: {
  quoteData: QuoteData | null | undefined;
  buyerControlPercentage: number | null | undefined;
}) {
  // DRAW
  if (!quoteData) {
    return (
      <div className="border rounded-md p-4 bg-(--mantine-color-body)">
        <p className="text-sm text-gray-500">No quote data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="border rounded-md p-4">
        <div className="max-h-[60vh] overflow-auto">
          <pre className="text-xs  p-4 rounded m-0">
            {JSON.stringify(quoteData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function QuoteDrawer({
  opened,
  onClose,
  selectedEntry,
}: {
  opened: boolean;
  onClose: () => void;
  selectedEntry: ShortlistEntry | null;
}) {
  // VARIABLES
  const drawerTitle = selectedEntry ? (
    <div className="flex flex-col gap-1">
      <h4 className="text-lg font-semibold">{selectedEntry.name}</h4>
      <span className="text-sm text-gray-500">{selectedEntry.nseSymbol}</span>
    </div>
  ) : (
    "Quote Details"
  );
  console.log("selectedEntry", selectedEntry);
  console.log("selectedEntry quoteData", selectedEntry?.quoteData);

  // DRAW
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="xl"
      title={drawerTitle}
      padding="lg"
    >
      {selectedEntry && (
        <QuotePanel
          quoteData={selectedEntry.quoteData}
          buyerControlPercentage={selectedEntry.buyerControlPercentage}
        />
      )}
    </Drawer>
  );
}
