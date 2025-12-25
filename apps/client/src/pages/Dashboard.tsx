import { PageHeader } from "../components/PageHeader";
import { QuoteDrawer } from "../components/QuoteDrawer";
import { ShortlistTable } from "../components/ShortlistTable";
import {
  PersistentCompaniesTable,
  type PersistentCompany,
} from "../components/PersistentCompaniesTable";
import { UniqueCompaniesCard } from "../components/UniqueCompaniesCard";
import { RunsSidebar } from "../components/RunsSidebar";
import { RunOrdersDrawer } from "../components/RunOrdersDrawer";
import { useState } from "react";
import type {
  ShortlistEntryWithQuote,
  ShortlistSnapshotWithEntries,
  Run,
} from "../types";
import { dashboardAPI } from "../store/api/dashboardApi";
import { useRTKNotifier } from "../utils/hooks/useRTKNotifier";

export const Dashboard = () => {
  // STATE
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<
    "TOP_GAINERS" | "VOLUME_SHOCKERS" | null
  >("TOP_GAINERS");
  // Drawer state
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedEntry, setSelectedEntry] =
    useState<ShortlistEntryWithQuote | null>(null);
  // Run orders drawer state
  const [runDrawerOpened, setRunDrawerOpened] = useState(false);
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);

  // API
  const {
    data: shortlistsData,
    isLoading: loadingShortlists,
    error: getShortlistsAPIError,
  } = dashboardAPI.useGetShortlistsQuery(
    {
      date: selectedDate?.toISOString() || "",
      type: activeTab || "TOP_GAINERS",
    },
    {
      skip: !selectedDate || !activeTab,
    }
  );
  useRTKNotifier({
    requestName: "Get Shortlists",
    error: getShortlistsAPIError,
  });
  const {
    data: persistentCompaniesData,
    isLoading: loadingPersistentCompanies,
    error: getPersistentCompaniesAPIError,
  } = dashboardAPI.useGetDailyPersistentCompaniesQuery(
    {
      date: selectedDate?.toISOString() || "",
      type: activeTab || "TOP_GAINERS",
    },
    {
      skip: !selectedDate || !activeTab,
    }
  );
  useRTKNotifier({
    requestName: "Get Daily Persistent Companies",
    error: getPersistentCompaniesAPIError,
  });

  // Transform shortlist data
  const shortlist: ShortlistSnapshotWithEntries | null = shortlistsData?.data
    .shortlist
    ? {
        id: shortlistsData.data.shortlist.id,
        timestamp: new Date(shortlistsData.data.shortlist.timestamp),
        shortlistType: shortlistsData.data.shortlist.shortlistType as
          | "TOP_GAINERS"
          | "VOLUME_SHOCKERS",
        entries: shortlistsData.data.shortlist.entries,
      }
    : null;

  // Transform persistent companies data
  const persistentCompanies: PersistentCompany[] =
    persistentCompaniesData?.data.companies || [];
  const totalSnapshots = persistentCompaniesData?.data.totalSnapshots;

  const handleRowClick = (entry: ShortlistEntryWithQuote) => {
    setSelectedEntry(entry);
    setDrawerOpened(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpened(false);
    setSelectedEntry(null);
  };

  const handleRunClick = (run: Run) => {
    setSelectedRun(run);
    setRunDrawerOpened(true);
  };

  const handleRunDrawerClose = () => {
    setRunDrawerOpened(false);
    setSelectedRun(null);
  };

  // DRAW
  return (
    <div className="flex h-screen">
      <RunsSidebar onRunClick={handleRunClick} />
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto min-h-full py-8 px-4 grid grid-rows-[auto_1fr] gap-4">
          <PageHeader
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className="w-full">
            {activeTab === "TOP_GAINERS" && (
              <ShortlistTable
                shortlist={shortlist}
                loading={loadingShortlists}
                onRowClick={handleRowClick}
                selectedDate={selectedDate}
              />
            )}

            {activeTab === "VOLUME_SHOCKERS" && (
              <ShortlistTable
                shortlist={shortlist}
                onRowClick={handleRowClick}
                loading={loadingShortlists}
                selectedDate={selectedDate}
              />
            )}
            <UniqueCompaniesCard
              selectedDate={selectedDate}
              activeTab={activeTab}
            />
            <PersistentCompaniesTable
              companies={persistentCompanies}
              loading={loadingPersistentCompanies}
              selectedDate={selectedDate}
              totalSnapshots={totalSnapshots}
            />
            <QuoteDrawer
              opened={drawerOpened}
              onClose={handleDrawerClose}
              selectedEntry={selectedEntry}
              selectedDate={selectedDate}
            />
            <RunOrdersDrawer
              opened={runDrawerOpened}
              onClose={handleRunDrawerClose}
              selectedRun={selectedRun}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
