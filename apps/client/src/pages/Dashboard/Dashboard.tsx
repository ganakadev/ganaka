import { useState } from "react";
import { QuoteDrawer } from "../../components/QuoteDrawer/QuoteDrawer";
import { RunOrdersDrawer } from "../../components/RunDrawer/RunDrawer";
import { dashboardAPI } from "../../store/api/dashboardApi";
import type { Run, ShortlistEntryWithQuote } from "../../types";
import { useRTKNotifier } from "../../utils/hooks/useRTKNotifier";
import { formatDateTimeForAPI, formatDateForAPI } from "../../utils/dateFormatting";
import { Header } from "./components/Header";
import {
  PersistentCompaniesTable,
  type PersistentCompany,
} from "./components/PersistentCompaniesTable";
import { RunsSidebar } from "./components/RunsSidebar";
import { ShortlistTable } from "./components/ShortlistTable";
import { UniqueCompaniesCard } from "./components/UniqueCompaniesCard";

export const Dashboard = () => {
  // STATE
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<"TOP_GAINERS" | "VOLUME_SHOCKERS" | null>(
    "TOP_GAINERS"
  );
  const [takeProfitPercentage, setTakeProfitPercentage] = useState<number>(2);
  const [stopLossPercentage, setStopLossPercentage] = useState<number>(1.5);
  // Drawer state
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ShortlistEntryWithQuote | null>(null);
  // Run orders drawer state
  const [runDrawerOpened, setRunDrawerOpened] = useState(false);
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);

  // API
  const getShortlistsAPI = dashboardAPI.useGetShortlistsQuery(
    {
      datetime: formatDateTimeForAPI(selectedDate),
      timezone: "Asia/Kolkata",
      type: activeTab || "TOP_GAINERS",
      takeProfitPercentage,
      stopLossPercentage,
    },
    {
      skip: !selectedDate || !activeTab,
    }
  );
  useRTKNotifier({
    requestName: "Get Shortlists",
    error: getShortlistsAPI.error,
  });
  const getPersistentCompaniesAPI = dashboardAPI.useGetDailyPersistentCompaniesQuery(
    {
      date: formatDateForAPI(selectedDate),
      type: activeTab || "TOP_GAINERS",
    },
    {
      skip: !selectedDate || !activeTab,
    }
  );
  useRTKNotifier({
    requestName: "Get Daily Persistent Companies",
    error: getPersistentCompaniesAPI.error,
  });

  // Transform shortlist data
  const shortlist = getShortlistsAPI.data?.data.shortlist
    ? {
        id: getShortlistsAPI.data.data.shortlist.id,
        timestamp: new Date(getShortlistsAPI.data.data.shortlist.timestamp), // API returns UTC string, Date constructor handles it correctly
        shortlistType: getShortlistsAPI.data.data.shortlist.shortlistType,
        entries: getShortlistsAPI.data.data.shortlist.entries,
      }
    : null;

  // Transform persistent companies data
  const persistentCompanies: PersistentCompany[] =
    getPersistentCompaniesAPI.data?.data.companies || [];
  const totalSnapshots = getPersistentCompaniesAPI.data?.data.totalSnapshots;

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

  const handleRunDelete = (runId: string) => {
    // Close drawer if the deleted run is currently selected
    if (selectedRun?.id === runId) {
      setRunDrawerOpened(false);
      setSelectedRun(null);
    }
  };

  // DRAW
  return (
    <div className="flex h-screen">
      <RunsSidebar onRunClick={handleRunClick} onRunDelete={handleRunDelete} />
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto min-h-full py-8 pt-4 px-4 grid grid-rows-[auto_1fr] gap-4">
          <Header
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            takeProfitPercentage={takeProfitPercentage}
            setTakeProfitPercentage={setTakeProfitPercentage}
            stopLossPercentage={stopLossPercentage}
            setStopLossPercentage={setStopLossPercentage}
          />
          <div className="w-full">
            {activeTab === "TOP_GAINERS" && (
              <ShortlistTable
                shortlist={shortlist?.entries || []}
                loading={getShortlistsAPI.isLoading}
                onRowClick={handleRowClick}
                selectedDate={selectedDate}
              />
            )}

            {activeTab === "VOLUME_SHOCKERS" && (
              <ShortlistTable
                shortlist={shortlist?.entries || []}
                onRowClick={handleRowClick}
                loading={getShortlistsAPI.isLoading}
                selectedDate={selectedDate}
              />
            )}
            <UniqueCompaniesCard selectedDate={selectedDate} activeTab={activeTab} />
            <PersistentCompaniesTable
              companies={persistentCompanies}
              loading={getPersistentCompaniesAPI.isLoading}
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
