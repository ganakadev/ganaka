import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import { z } from "zod";

// Get base URL from environment variable
const baseUrl = import.meta.env.VITE_API_DOMAIN || "http://localhost:4000";

export const dashboardAPI = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/v1/dashboard`,
  }),
  tagTypes: [
    "Shortlists",
    "AvailableDatetimes",
    "PersistentCompanies",
    "UniqueCompanies",
    "Candles",
  ],
  endpoints: (builder) => ({
    // Get available datetimes
    getAvailableDatetimes: builder.query<
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_available_datetimes_schemas.getAvailableDatetimes.response
      >,
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_available_datetimes_schemas.getAvailableDatetimes.query
      >
    >({
      query: () => ({
        url: "/available-datetimes",
        method: "GET",
      }),
      providesTags: ["AvailableDatetimes"],
    }),

    // Get shortlists
    getShortlists: builder.query<
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.response
      >,
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.query
      >
    >({
      query: (params) => {
        // Validate query params using Zod schema
        const validatedParams =
          v1_dashboard_schemas.v1_dashboard_shortlists_schemas.getShortlists.query.parse(
            params
          );
        return {
          url: "/shortlists",
          method: "GET",
          params: validatedParams,
        };
      },
      providesTags: ["Shortlists"],
    }),

    // Get daily persistent companies
    getDailyPersistentCompanies: builder.query<
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_daily_persistent_companies_schemas.getDailyPersistentCompanies.response
      >,
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_daily_persistent_companies_schemas.getDailyPersistentCompanies.query
      >
    >({
      query: (params) => {
        const validatedParams =
          v1_dashboard_schemas.v1_dashboard_daily_persistent_companies_schemas.getDailyPersistentCompanies.query.parse(
            params
          );
        return {
          url: "/daily-persistent-companies",
          method: "GET",
          params: validatedParams,
        };
      },
      providesTags: ["PersistentCompanies"],
    }),

    // Get daily unique companies
    getDailyUniqueCompanies: builder.query<
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_daily_unique_companies_schemas.getDailyUniqueCompanies.response
      >,
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_daily_unique_companies_schemas.getDailyUniqueCompanies.query
      >
    >({
      query: (params) => {
        const validatedParams =
          v1_dashboard_schemas.v1_dashboard_daily_unique_companies_schemas.getDailyUniqueCompanies.query.parse(
            params
          );
        return {
          url: "/daily-unique-companies",
          method: "GET",
          params: validatedParams,
        };
      },
      providesTags: ["UniqueCompanies"],
    }),

    // Get candles
    getCandles: builder.query<
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.response
      >,
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.query
      >
    >({
      query: (params) => {
        const validatedParams =
          v1_dashboard_schemas.v1_dashboard_candles_schemas.getCandles.query.parse(
            params
          );
        return {
          url: "/candles",
          method: "GET",
          params: validatedParams,
        };
      },
      providesTags: ["Candles"],
    }),
  }),
});
