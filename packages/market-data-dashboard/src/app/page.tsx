"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, Loader } from "@mantine/core";
import { DateTimeSelector } from "@/components/DateTimeSelector";
import { ShortlistTable } from "@/components/ShortlistTable";
import { QuoteDrawer } from "@/components/QuoteDrawer";
import {
  GroupedShortlist,
  ApiShortlistsResponse,
  ShortlistEntry,
} from "@/types";

export default function DashboardPage() {
  // STATE
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimestamp, setSelectedTimestamp] = useState<Date | null>(null);
  const [groupedShortlists, setGroupedShortlists] = useState<
    GroupedShortlist[]
  >([]);
  const [latestDate, setLatestDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTimestamps, setAvailableTimestamps] = useState<Date[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>("all");
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

  // EFFECTS
  // Fetch shortlists when date changes
  useEffect(() => {
    const fetchShortlists = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (selectedDate) {
          params.set("date", selectedDate.toISOString().split("T")[0]);
        }
        if (activeTab && activeTab !== "all") {
          params.set("type", activeTab);
        }

        const { data } = await axios.get<ApiShortlistsResponse>(
          `/api/shortlists?${params.toString()}`
        );

        // Convert timestamp strings to Date objects
        const processedGroupedShortlists: GroupedShortlist[] =
          data.groupedShortlists.map((group) => ({
            date: group.date,
            timestamps: group.timestamps.map((ts) => ({
              timestamp: new Date(ts.timestamp),
              shortlists: ts.shortlists.map((shortlist) => ({
                ...shortlist,
                timestamp: new Date(shortlist.timestamp),
                createdAt: new Date(shortlist.createdAt),
              })),
            })),
          }));

        setGroupedShortlists(processedGroupedShortlists);
        setLatestDate(data.latestDate);

        // Set default date to latest if not set
        if (!selectedDate && data.latestDate) {
          const latest = new Date(data.latestDate);
          setSelectedDate(latest);
        }

        // Collect all available timestamps (convert strings to Date objects)
        const allTimestamps: Date[] = [];
        processedGroupedShortlists.forEach((group) => {
          group.timestamps.forEach((ts) => {
            allTimestamps.push(ts.timestamp);
          });
        });
        setAvailableTimestamps(allTimestamps);

        // Reset timestamp selection when date changes
        if (selectedDate) {
          setSelectedTimestamp(null);
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
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchShortlists();
  }, [selectedDate, activeTab]);

  // Filter shortlists by selected timestamp
  const getFilteredShortlists = () => {
    if (!selectedTimestamp) {
      // If no timestamp selected, show all
      return groupedShortlists.flatMap((group) =>
        group.timestamps.flatMap((ts) => ts.shortlists)
      );
    }

    // Find shortlists matching the selected timestamp
    const matching: any[] = [];
    groupedShortlists.forEach((group) => {
      group.timestamps.forEach((ts) => {
        if (ts.timestamp.getTime() === selectedTimestamp.getTime()) {
          matching.push(...ts.shortlists);
        }
      });
    });
    return matching;
  };

  const filteredShortlists = getFilteredShortlists();

  // Group filtered shortlists by type
  const topGainers = filteredShortlists.filter(
    (s) => s.shortlistType === "TOP_GAINERS"
  );
  const volumeShockers = filteredShortlists.filter(
    (s) => s.shortlistType === "VOLUME_SHOCKERS"
  );

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

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <DateTimeSelector
        selectedDate={selectedDate}
        availableTimestamps={availableTimestamps}
        onDateChange={setSelectedDate}
        onTimeChange={setSelectedTimestamp}
        latestDate={latestDate}
      />

      {/* <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="TOP_GAINERS">Top Gainers</Tabs.Tab>
          <Tabs.Tab value="VOLUME_SHOCKERS">Volume Shockers</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all" className="pt-8">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader size="lg" />
            </div>
          ) : (
            <>
              {topGainers.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Top Gainers</h2>
                  {topGainers.map((shortlist) => (
                    <ShortlistTable
                      key={shortlist.id}
                      shortlist={shortlist}
                      onRowClick={handleRowClick}
                    />
                  ))}
                </div>
              )}

              {volumeShockers.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Volume Shockers
                  </h2>
                  {volumeShockers.map((shortlist) => (
                    <ShortlistTable
                      key={shortlist.id}
                      shortlist={shortlist}
                      onRowClick={handleRowClick}
                    />
                  ))}
                </div>
              )}

              {filteredShortlists.length === 0 && !loading && (
                <div className="flex items-center justify-center p-8">
                  <p className="text-sm text-gray-500">
                    No shortlist data available for the selected date/time
                  </p>
                </div>
              )}
            </>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="TOP_GAINERS" className="pt-8">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader size="lg" />
            </div>
          ) : topGainers.length > 0 ? (
            topGainers.map((shortlist) => (
              <ShortlistTable
                key={shortlist.id}
                shortlist={shortlist}
                onRowClick={handleRowClick}
              />
            ))
          ) : (
            <div className="flex items-center justify-center p-8">
              <p className="text-sm text-gray-500">
                No top gainers data available
              </p>
            </div>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="VOLUME_SHOCKERS" className="pt-8">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader size="lg" />
            </div>
          ) : volumeShockers.length > 0 ? (
            volumeShockers.map((shortlist) => (
              <ShortlistTable
                key={shortlist.id}
                shortlist={shortlist}
                onRowClick={handleRowClick}
              />
            ))
          ) : (
            <div className="flex items-center justify-center p-8">
              <p className="text-sm text-gray-500">
                No volume shockers data available
              </p>
            </div>
          )}
        </Tabs.Panel>
      </Tabs> */}

      {/* <QuoteDrawer
        opened={drawerOpened}
        onClose={handleDrawerClose}
        selectedEntry={selectedEntry}
        timestamp={selectedEntryTimestamp}
        shortlistType={selectedEntryShortlistType}
      /> */}
    </div>
  );
}
