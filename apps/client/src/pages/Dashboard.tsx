import { PageHeader } from "../components/PageHeader";
import { QuoteDrawer } from "../components/QuoteDrawer";
import { ShortlistTable } from "../components/ShortlistTable";
import {
  PersistentCompaniesTable,
  type PersistentCompany,
} from "../components/PersistentCompaniesTable";
import { UniqueCompaniesCard } from "../components/UniqueCompaniesCard";
import { useState } from "react";
import type {
  ShortlistEntryWithQuote,
  ShortlistSnapshotWithEntries,
} from "../types";
import { dashboardAPI } from "../store/api/dashboardApi";

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

  // RTK Query hooks
  const { data: shortlistsData, isLoading: loadingShortlists } =
    dashboardAPI.useGetShortlistsQuery(
      {
        date: selectedDate?.toISOString() || "",
        type: activeTab || "TOP_GAINERS",
      },
      {
        skip: !selectedDate || !activeTab,
      }
    );

  const {
    data: persistentCompaniesData,
    isLoading: loadingPersistentCompanies,
  } = dashboardAPI.useGetDailyPersistentCompaniesQuery(
    {
      date: selectedDate?.toISOString() || "",
      type: activeTab || "TOP_GAINERS",
    },
    {
      skip: !selectedDate || !activeTab,
    }
  );

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

  // DRAW
  return (
    <div className="max-w-5xl mx-auto min-h-full py-8 px-4 grid grid-rows-[auto_1fr] gap-4">
      <PageHeader
        onDateChange={setSelectedDate}
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
      </div>
    </div>
  );
};
