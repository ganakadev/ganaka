"use client";

import { PageHeader } from "@/components/PageHeader";
import { QuoteDrawer } from "@/components/QuoteDrawer";
import { ShortlistTable } from "@/components/ShortlistTable";
import {
  PersistentCompaniesTable,
  PersistentCompany,
} from "@/components/PersistentCompaniesTable";
import {
  ApiShortlistsResponse,
  ShortlistEntry,
  ShortlistSnapshot,
  DailyPersistentCompaniesResponse,
} from "@/types";
import { Loader, SegmentedControl } from "@mantine/core";
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
  const [topGainersShortlist, setTopGainersShortlist] =
    useState<ShortlistSnapshot | null>(null);
  const [volumeShockersShortlist, setVolumeShockersShortlist] =
    useState<ShortlistSnapshot | null>(null);
  const [topGainersPersistentCompanies, setTopGainersPersistentCompanies] =
    useState<PersistentCompany[] | null>(null);
  const [
    volumeShockersPersistentCompanies,
    setVolumeShockersPersistentCompanies,
  ] = useState<PersistentCompany[] | null>(null);
  const [topGainersTotalSnapshots, setTopGainersTotalSnapshots] = useState<
    number | null
  >(null);
  const [volumeShockersTotalSnapshots, setVolumeShockersTotalSnapshots] =
    useState<number | null>(null);
  const [loadingPersistentCompanies, setLoadingPersistentCompanies] =
    useState(false);

  const handleRowClick = (entry: ShortlistEntry) => {
    setSelectedEntry(entry);
    setDrawerOpened(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpened(false);
    setSelectedEntry(null);
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

  // Fetch persistent companies when date changes
  useEffect(() => {
    const fetchPersistentCompanies = async () => {
      setLoadingPersistentCompanies(true);
      try {
        if (selectedDate && activeTab) {
          const { data, status } =
            await axios.get<DailyPersistentCompaniesResponse>(
              `/api/daily-persistent-companies`,
              {
                params: {
                  date: selectedDate.toISOString(),
                  type: activeTab,
                },
              }
            );

          if (status === 200) {
            if (activeTab === "TOP_GAINERS") {
              setTopGainersPersistentCompanies(data.companies);
              setTopGainersTotalSnapshots(data.totalSnapshots);
            } else {
              setVolumeShockersPersistentCompanies(data.companies);
              setVolumeShockersTotalSnapshots(data.totalSnapshots);
            }
          } else {
            if (activeTab === "TOP_GAINERS") {
              setTopGainersPersistentCompanies(null);
              setTopGainersTotalSnapshots(null);
            } else {
              setVolumeShockersPersistentCompanies(null);
              setVolumeShockersTotalSnapshots(null);
            }
            console.error("Error fetching persistent companies");
          }
        }
      } catch (error) {
        console.error("Error fetching persistent companies:", error);
        if (activeTab === "TOP_GAINERS") {
          setTopGainersPersistentCompanies(null);
          setTopGainersTotalSnapshots(null);
        } else {
          setVolumeShockersPersistentCompanies(null);
          setVolumeShockersTotalSnapshots(null);
        }
      } finally {
        setLoadingPersistentCompanies(false);
      }
    };

    fetchPersistentCompanies();
  }, [selectedDate, activeTab]);

  // DRAW
  return (
    <div className="max-w-5xl mx-auto h-full py-8 px-4 grid grid-rows-[auto_1fr] gap-4">
      <PageHeader
        onDateChange={setSelectedDate}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="w-full h-full">
        {activeTab === "TOP_GAINERS" && (
          <div className="h-full">
            {topGainersShortlist ? (
              <>
                <ShortlistTable
                  shortlist={topGainersShortlist}
                  loading={loading}
                  onRowClick={handleRowClick}
                />
                <PersistentCompaniesTable
                  companies={topGainersPersistentCompanies ?? []}
                  loading={loadingPersistentCompanies}
                  totalSnapshots={topGainersTotalSnapshots ?? undefined}
                />
              </>
            ) : (
              <div className="flex items-center justify-center p-8 h-full">
                <p className="text-sm">No top gainers data available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "VOLUME_SHOCKERS" && (
          <div className="h-full">
            {volumeShockersShortlist ? (
              <>
                <ShortlistTable
                  shortlist={volumeShockersShortlist}
                  onRowClick={handleRowClick}
                  loading={loading}
                />
                <PersistentCompaniesTable
                  companies={volumeShockersPersistentCompanies ?? []}
                  loading={loadingPersistentCompanies}
                  totalSnapshots={volumeShockersTotalSnapshots ?? undefined}
                />
              </>
            ) : (
              <div className="flex items-center justify-center p-8 h-full">
                <p className="text-sm">No volume shockers data available</p>
              </div>
            )}
          </div>
        )}

        <QuoteDrawer
          opened={drawerOpened}
          onClose={handleDrawerClose}
          selectedEntry={selectedEntry}
        />
      </div>
    </div>
  );
}
