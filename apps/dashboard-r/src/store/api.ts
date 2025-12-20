import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import type { z } from "zod";

// Base URL for the API
const API_BASE_URL = import.meta.env.VITE_API_DOMAIN || "http://localhost:4000";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/v1/dashboard`,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "shortlists",
    "availableDatetimes",
    "dailyPersistentCompanies",
    "dailyUniqueCompanies",
    "candles",
  ],
  endpoints: (builder) => ({
    // Get shortlists
    getShortlists: builder.query<
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.response
      >["data"],
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.query
      >
    >({
      query: (params) => ({
        url: "/shortlists",
        params,
      }),
      providesTags: ["shortlists"],
    }),

    // Get available datetimes
    getAvailableDatetimes: builder.query<
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_available_datetimes_schemas.getAvailableDatetimes.response
      >["data"],
      void
    >({
      query: () => "/available-datetimes",
      providesTags: ["availableDatetimes"],
    }),

    // Get daily persistent companies
    getDailyPersistentCompanies: builder.query<
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_daily_persistent_companies_schemas.getDailyPersistentCompanies.response
      >["data"],
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_daily_persistent_companies_schemas.getDailyPersistentCompanies.query
      >
    >({
      query: (params) => ({
        url: "/daily-persistent-companies",
        params,
      }),
      providesTags: ["dailyPersistentCompanies"],
    }),

    // Get daily unique companies
    getDailyUniqueCompanies: builder.query<
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_daily_unique_companies_schemas.getDailyUniqueCompanies.response
      >["data"],
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_daily_unique_companies_schemas.getDailyUniqueCompanies.query
      >
    >({
      query: (params) => ({
        url: "/daily-unique-companies",
        params,
      }),
      providesTags: ["dailyUniqueCompanies"],
    }),

    // Get candles
    getCandles: builder.query<
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.response
      >["data"],
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.query
      >
    >({
      query: (params) => ({
        url: "/candles",
        params,
      }),
      providesTags: ["candles"],
    }),
  }),
});

export const {
  useGetShortlistsQuery,
  useGetAvailableDatetimesQuery,
  useGetDailyPersistentCompaniesQuery,
  useGetDailyUniqueCompaniesQuery,
  useGetCandlesQuery,
} = dashboardApi;
