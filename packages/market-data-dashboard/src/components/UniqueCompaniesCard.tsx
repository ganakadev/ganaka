"use client";

import { DailyUniqueCompaniesResponse } from "@/types";
import { Card, Skeleton } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export const UniqueCompaniesCard = ({
  selectedDate,
  activeTab,
}: {
  selectedDate: Date | null;
  activeTab: "TOP_GAINERS" | "VOLUME_SHOCKERS" | null;
}) => {
  // STATE
  const [uniqueCount, setUniqueCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // EFFECTS
  useEffect(() => {
    const fetchUniqueCount = async () => {
      setLoading(true);
      setError(null);
      try {
        if (selectedDate && activeTab) {
          const { data, status } =
            await axios.get<DailyUniqueCompaniesResponse>(
              `/api/daily-unique-companies`,
              {
                params: {
                  date: selectedDate.toISOString(),
                  type: activeTab,
                },
              }
            );

          if (status === 200) {
            setUniqueCount(data.uniqueCount);
          } else {
            setUniqueCount(null);
            setError("Failed to fetch unique companies count");
          }
        } else {
          setUniqueCount(null);
        }
      } catch (err) {
        console.error("Error fetching unique companies count:", err);
        setUniqueCount(null);
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.error ||
              err.message ||
              "Failed to fetch unique companies count"
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUniqueCount();
  }, [selectedDate, activeTab]);

  // DRAW
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-gray-400">
          Unique Companies across the day
        </h3>
        {loading ? (
          <Skeleton height={40} width="100%" />
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : !selectedDate ? (
          <p className="text-sm text-gray-500">No date selected</p>
        ) : uniqueCount !== null ? (
          <p className="text-3xl font-bold tabular-nums">{uniqueCount}</p>
        ) : (
          <p className="text-sm text-gray-500">No data available</p>
        )}
      </div>
    </Card>
  );
};

