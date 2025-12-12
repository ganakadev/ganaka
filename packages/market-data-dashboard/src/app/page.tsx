"use client";

import { useState, useEffect } from "react";
import { Container, Title, Tabs, Loader, Center, Text } from "@mantine/core";
import { DateTimeSelector } from "@/components/DateTimeSelector";
import { ShortlistCard } from "@/components/ShortlistCard";
import { GroupedShortlist, ApiShortlistsResponse } from "@/types";

export default function DashboardPage() {
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

        let response: Response;
        try {
          response = await fetch(`/api/shortlists?${params.toString()}`);
        } catch (fetchError) {
          throw new Error(
            `Network error: ${
              fetchError instanceof Error
                ? fetchError.message
                : "Failed to connect to API"
            }`
          );
        }

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const errorData = await response.json();
            if (errorData.error) {
              errorMessage = errorData.error;
            }
          } catch {
            // If response is not JSON, use the status text
          }
          throw new Error(errorMessage);
        }

        const data: ApiShortlistsResponse = await response.json();

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
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
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

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        Market Data Dashboard
      </Title>

      <DateTimeSelector
        selectedDate={selectedDate}
        availableTimestamps={availableTimestamps}
        onDateChange={setSelectedDate}
        onTimeChange={setSelectedTimestamp}
        latestDate={latestDate}
      />

      {error && (
        <div
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            borderRadius: "4px",
            color: "#c33",
          }}
        >
          <Text fw={500} c="red">
            Error: {error}
          </Text>
          <Text size="sm" c="red" mt="xs">
            Please ensure:
            <br />
            1. Prisma client is generated: <code>pnpm prisma:generate</code>
            <br />
            2. DATABASE_URL is set in .env.local
            <br />
            3. Database is accessible
          </Text>
        </div>
      )}

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="TOP_GAINERS">Top Gainers</Tabs.Tab>
          <Tabs.Tab value="VOLUME_SHOCKERS">Volume Shockers</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all" pt="xl">
          {loading ? (
            <Center p="xl">
              <Loader size="lg" />
            </Center>
          ) : (
            <>
              {topGainers.length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                  <Title order={2} mb="md">
                    Top Gainers
                  </Title>
                  {topGainers.map((shortlist) => (
                    <ShortlistCard key={shortlist.id} shortlist={shortlist} />
                  ))}
                </div>
              )}

              {volumeShockers.length > 0 && (
                <div>
                  <Title order={2} mb="md">
                    Volume Shockers
                  </Title>
                  {volumeShockers.map((shortlist) => (
                    <ShortlistCard key={shortlist.id} shortlist={shortlist} />
                  ))}
                </div>
              )}

              {filteredShortlists.length === 0 && !loading && (
                <Center p="xl">
                  <Text c="dimmed">
                    No shortlist data available for the selected date/time
                  </Text>
                </Center>
              )}
            </>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="TOP_GAINERS" pt="xl">
          {loading ? (
            <Center p="xl">
              <Loader size="lg" />
            </Center>
          ) : topGainers.length > 0 ? (
            topGainers.map((shortlist) => (
              <ShortlistCard key={shortlist.id} shortlist={shortlist} />
            ))
          ) : (
            <Center p="xl">
              <Text c="dimmed">No top gainers data available</Text>
            </Center>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="VOLUME_SHOCKERS" pt="xl">
          {loading ? (
            <Center p="xl">
              <Loader size="lg" />
            </Center>
          ) : volumeShockers.length > 0 ? (
            volumeShockers.map((shortlist) => (
              <ShortlistCard key={shortlist.id} shortlist={shortlist} />
            ))
          ) : (
            <Center p="xl">
              <Text c="dimmed">No volume shockers data available</Text>
            </Center>
          )}
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
