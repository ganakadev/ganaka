import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { v1_dashboard_schemas } from "@ganaka/schemas";
import { z } from "zod";
import { authLocalStorage } from "../../utils/authLocalStorage";

// Get base URL from environment variable
const baseUrl = import.meta.env.VITE_API_DOMAIN || "http://localhost:4000";

export const dashboardAPI = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/v1/dashboard`,
    prepareHeaders: (headers) => {
      const token = authLocalStorage.getToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Shortlists",
    "AvailableDatetimes",
    "PersistentCompanies",
    "UniqueCompanies",
    "Candles",
    "QuoteTimeline",
    "Runs",
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

    // Get quote timeline
    getQuoteTimeline: builder.query<
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_quote_timeline_schemas.getQuoteTimeline.response
      >,
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_quote_timeline_schemas.getQuoteTimeline.query
      >
    >({
      query: (params) => {
        const validatedParams =
          v1_dashboard_schemas.v1_dashboard_quote_timeline_schemas.getQuoteTimeline.query.parse(
            params
          );
        return {
          url: "/quote-timelines",
          method: "GET",
          params: validatedParams,
        };
      },
      providesTags: ["QuoteTimeline"],
    }),

    // Sign in
    signIn: builder.query<
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_auth_schemas.signIn.response
      >,
      z.infer<typeof v1_dashboard_schemas.v1_dashboard_auth_schemas.signIn.body>
    >({
      query: (body) => ({
        url: "/auth/sign-in",
        method: "POST",
        headers: {
          authorization: `Bearer ${body.developerToken}`,
        },
        body,
      }),
    }),

    // Get runs
    getRuns: builder.query<
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.getRuns.response
      >,
      void
    >({
      query: () => ({
        url: "/runs",
        method: "GET",
      }),
      providesTags: ["Runs"],
    }),

    // Get run orders
    getRunOrders: builder.query<
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunOrders.response
      >,
      z.infer<
        typeof v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunOrders.params
      >
    >({
      query: (params) => {
        const validatedParams =
          v1_dashboard_schemas.v1_dashboard_runs_schemas.getRunOrders.params.parse(
            params
          );
        return {
          url: `/runs/${validatedParams.runId}/orders`,
          method: "GET",
        };
      },
      providesTags: ["Runs"],
    }),
  }),
});
