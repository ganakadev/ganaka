"use client";

import { DateTimeSelector } from "@/components/DateTimeSelector";
import { QuoteDrawer } from "@/components/QuoteDrawer";
import { ShortlistTable } from "@/components/ShortlistTable";
import {
  ApiShortlistsResponse,
  ShortlistEntry,
  ShortlistSnapshotData,
} from "@/types";
import { Loader, Tabs } from "@mantine/core";
import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function DashboardPage() {
  // STATE
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "TOP_GAINERS" | "VOLUME_SHOCKERS" | null
  >("TOP_GAINERS");
  // Drawer state
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ShortlistEntry | null>(
    null
  );
  const [selectedEntryTimestamp, setSelectedEntryTimestamp] =
    useState<Date | null>(null);
  const [selectedEntryShortlistType, setSelectedEntryShortlistType] = useState<
    string | null
  >(null);
  const [topGainersShortlist, setTopGainersShortlist] =
    useState<ShortlistSnapshotData | null>(null);
  const [volumeShockersShortlist, setVolumeShockersShortlist] =
    useState<ShortlistSnapshotData | null>(null);

  const handleRowClick = (
    entry: ShortlistEntry,
    timestamp: Date,
    shortlistType: string
  ) => {
    setSelectedEntry(entry);
    setSelectedEntryTimestamp(timestamp);
    setSelectedEntryShortlistType(shortlistType);
    setDrawerOpened(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpened(false);
    setSelectedEntry(null);
    setSelectedEntryTimestamp(null);
    setSelectedEntryShortlistType(null);
  };

  // EFFECTS
  // Fetch shortlists when date changes
  useEffect(() => {
    const fetchShortlists = async () => {
      setLoading(true);
      try {
        if (selectedDate && activeTab) {
          const { data, status } = await axios.get<ApiShortlistsResponse>(
            `/api/shortlists`,
            {
              params: {
                date: selectedDate.toISOString(),
                type: activeTab,
              },
            }
          );

          if (status === 200) {
            if (activeTab === "TOP_GAINERS") {
              setTopGainersShortlist(data.shortlist);
            } else {
              setVolumeShockersShortlist(data.shortlist);
            }
          } else {
            if (activeTab === "TOP_GAINERS") {
              setTopGainersShortlist(null);
            } else {
              setVolumeShockersShortlist(null);
            }
            console.error("Error fetching shortlists");
          }
        }
      } catch (error) {
        console.error("Error fetching shortlists:", error);
        let errorMessage = "An unknown error occurred";
        if (axios.isAxiosError(error)) {
          errorMessage =
            error.response?.data?.error ||
            error.message ||
            `HTTP ${error.response?.status}: ${error.response?.statusText}`;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShortlists();
  }, [selectedDate, activeTab]);

  // DRAW
  return (
    <div className="max-w-5xl mx-auto h-full py-8 px-4 grid grid-rows-[auto_1fr] gap-4">
      <DateTimeSelector onDateChange={setSelectedDate} />
      <div className="w-full h-full">
        <Tabs
          value={activeTab}
          classNames={{
            root: "h-full",
          }}
          onChange={(value) => {
            setTopGainersShortlist(null);
            setVolumeShockersShortlist(null);
            setActiveTab(value as "TOP_GAINERS" | "VOLUME_SHOCKERS");
            setLoading(true);
          }}
          variant="default"
        >
          <Tabs.List>
            <Tabs.Tab value="TOP_GAINERS">Top Gainers</Tabs.Tab>
            <Tabs.Tab value="VOLUME_SHOCKERS">Volume Shockers</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="TOP_GAINERS" className="pt-8 h-full">
            {topGainersShortlist ? (
              <ShortlistTable
                shortlist={topGainersShortlist}
                onRowClick={handleRowClick}
              />
            ) : (
              <div className="flex items-center justify-center p-8 h-full">
                <p className="text-sm">No top gainers data available</p>
              </div>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="VOLUME_SHOCKERS" className="pt-8 h-full">
            {volumeShockersShortlist ? (
              <ShortlistTable
                shortlist={volumeShockersShortlist}
                onRowClick={handleRowClick}
              />
            ) : (
              <div className="flex items-center justify-center p-8 h-full">
                <p className="text-sm">No volume shockers data available</p>
              </div>
            )}
          </Tabs.Panel>
        </Tabs>

        <QuoteDrawer
          opened={drawerOpened}
          onClose={handleDrawerClose}
          selectedEntry={selectedEntry}
          timestamp={selectedEntryTimestamp}
          shortlistType={selectedEntryShortlistType}
        />
      </div>
    </div>
  );
}
