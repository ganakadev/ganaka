import { PageHeader } from "@/components/PageHeader";
import { QuoteDrawer } from "@/components/QuoteDrawer";
import { ShortlistTable } from "@/components/ShortlistTable";
import {
  PersistentCompaniesTable,
  type PersistentCompany,
} from "@/components/PersistentCompaniesTable";
import { UniqueCompaniesCard } from "@/components/UniqueCompaniesCard";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useMemo, useState } from "react";
import {
  useGetShortlistsQuery,
  useGetDailyPersistentCompaniesQuery,
} from "@/store/api";
import type { ShortlistEntry } from "@ganaka/db";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function DashboardPage() {
  // STATE
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<
    "TOP_GAINERS" | "VOLUME_SHOCKERS" | null
  >("TOP_GAINERS");
  // Drawer state
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ShortlistEntry | null>(
    null
  );

  // RTKQ hooks for shortlists
  const { data: shortlistsData, isLoading: loadingShortlists } =
    useGetShortlistsQuery(
      {
        date: selectedDate?.toISOString() || "",
        type: activeTab || "TOP_GAINERS",
      },
      {
        skip: !selectedDate || !activeTab,
      }
    );

  // RTKQ hooks for persistent companies
  const {
    data: persistentCompaniesData,
    isLoading: loadingPersistentCompanies,
  } = useGetDailyPersistentCompaniesQuery(
    {
      date: selectedDate?.toISOString() || "",
      type: activeTab || "TOP_GAINERS",
    },
    {
      skip: !selectedDate || !activeTab,
    }
  );

  const handleRowClick = (entry: ShortlistEntry) => {
    setSelectedEntry(entry);
    setDrawerOpened(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpened(false);
    setSelectedEntry(null);
  };

  // Get the appropriate shortlist based on active tab, transforming to match ShortlistEntry type
  const currentShortlist = useMemo(() => {
    if (!shortlistsData?.shortlist) return null;
    return {
      id: shortlistsData.shortlist.id,
      timestamp: shortlistsData.shortlist.timestamp,
      shortlistType: shortlistsData.shortlist.shortlistType,
      entries: shortlistsData.shortlist.entries.map(
        (entry): ShortlistEntry => ({
          nseSymbol: entry.nseSymbol,
          name: entry.name,
          price: entry.price,
          quoteData: entry.quoteData as ShortlistEntry["quoteData"],
        })
      ),
    };
  }, [shortlistsData]);

  // Get the appropriate persistent companies based on active tab
  const currentPersistentCompanies: PersistentCompany[] =
    persistentCompaniesData?.companies || [];
  const currentTotalSnapshots = persistentCompaniesData?.totalSnapshots;

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
            shortlist={currentShortlist}
            loading={loadingShortlists}
            onRowClick={handleRowClick}
            selectedDate={selectedDate}
          />
        )}

        {activeTab === "VOLUME_SHOCKERS" && (
          <ShortlistTable
            shortlist={currentShortlist}
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
          companies={currentPersistentCompanies}
          loading={loadingPersistentCompanies}
          selectedDate={selectedDate}
          totalSnapshots={currentTotalSnapshots}
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
}
