import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  v1_auth_schemas,
  v1_candles_schemas,
  v1_dates_schemas,
  v1_shortlists_schemas,
  v1_runs_schemas,
  v1_groww_credentials_schemas,
} from "@ganaka/schemas";
import { z } from "zod";
import { authLocalStorage } from "../../utils/authLocalStorage";

// Get base URL from environment variable
const baseUrl = `${import.meta.env.VITE_API_DOMAIN}` || "http://localhost:4000";

// Create base query with 401 error handling
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: `${baseUrl}/v1`,
  prepareHeaders: (headers) => {
    const token = authLocalStorage.getToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wrap baseQuery to handle 401 errors globally
const baseQueryWithReauth: typeof baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQueryWithAuth(args, api, extraOptions);

  // Handle 401 Unauthorized errors
  if (result.error && "status" in result.error && result.error.status === 401) {
    // Clear authentication data
    authLocalStorage.clearAuth();
    // Redirect to sign in page
    window.location.href = "/signin";
  }

  return result;
};

export const dashboardAPI = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Shortlists", "AvailableDatetimes", "Candles", "Runs", "GrowwCredentials"],
  endpoints: (builder) => ({
    // Get available datetimes
    getAvailableDatetimes: builder.query<
      z.infer<typeof v1_dates_schemas.getDates.response>,
      z.infer<typeof v1_dates_schemas.getDates.query>
    >({
      query: () => ({
        url: "/dates",
        method: "GET",
      }),
      providesTags: ["AvailableDatetimes"],
    }),

    // Get shortlists
    getShortlists: builder.query<
      z.infer<typeof v1_shortlists_schemas.getShortlists.response>,
      z.infer<typeof v1_shortlists_schemas.getShortlists.query>
    >({
      query: (params) => {
        // Validate query params using Zod schema
        const validatedParams = v1_shortlists_schemas.getShortlists.query.parse(params);
        return {
          url: "/shortlists",
          method: "GET",
          params: validatedParams,
        };
      },
      providesTags: ["Shortlists"],
    }),

    // Get candles
    getCandles: builder.query<
      z.infer<typeof v1_candles_schemas.getDashboardCandles.response>,
      z.infer<typeof v1_candles_schemas.getDashboardCandles.query>
    >({
      query: (params) => {
        const validatedParams = v1_candles_schemas.getDashboardCandles.query.parse(params);
        return {
          url: "/candles",
          method: "GET",
          params: validatedParams,
        };
      },
      providesTags: ["Candles"],
    }),

    // Sign in
    signIn: builder.query<
      z.infer<typeof v1_auth_schemas.signIn.response>,
      z.infer<typeof v1_auth_schemas.signIn.body>
    >({
      query: (body) => ({
        url: "/auth",
        method: "POST",
        headers: {
          authorization: `Bearer ${body.developerToken}`,
        },
        body,
      }),
    }),

    // Get runs
    getRuns: builder.query<z.infer<typeof v1_runs_schemas.getRuns.response>, void>({
      query: () => ({
        url: "/runs",
        method: "GET",
      }),
      providesTags: ["Runs"],
    }),

    // Get run orders
    getRunOrders: builder.query<
      z.infer<typeof v1_runs_schemas.getRunOrders.response>,
      z.infer<typeof v1_runs_schemas.getRunOrders.params> &
        z.infer<typeof v1_runs_schemas.getRunOrders.query>
    >({
      query: (params) => {
        const validatedParams = v1_runs_schemas.getRunOrders.params.parse(params);
        const validatedQuery = v1_runs_schemas.getRunOrders.query.parse(params);
        return {
          url: `/runs/${validatedParams.runId}/orders`,
          method: "GET",
          params: validatedQuery,
        };
      },
      providesTags: ["Runs"],
    }),

    // Delete run
    deleteRun: builder.mutation<
      z.infer<typeof v1_runs_schemas.deleteRun.response>,
      z.infer<typeof v1_runs_schemas.deleteRun.params>
    >({
      query: (params) => {
        const validatedParams = v1_runs_schemas.deleteRun.params.parse(params);
        return {
          url: `/runs/${validatedParams.runId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Runs"],
    }),

    // Update run
    updateRun: builder.mutation<
      z.infer<typeof v1_runs_schemas.updateRun.response>,
      z.infer<typeof v1_runs_schemas.updateRun.params> &
        z.infer<typeof v1_runs_schemas.updateRun.body>
    >({
      query: (params) => {
        const validatedParams = v1_runs_schemas.updateRun.params.parse(params);
        const validatedBody = v1_runs_schemas.updateRun.body.parse(params);
        return {
          url: `/runs/${validatedParams.runId}`,
          method: "PATCH",
          body: validatedBody,
        };
      },
      invalidatesTags: ["Runs"],
    }),

    // Get run tags (for autocomplete)
    getRunTags: builder.query<z.infer<typeof v1_runs_schemas.getRunTags.response>, void>({
      query: () => ({
        url: "/runs/tags",
        method: "GET",
      }),
      // Tags don't change frequently, so we can keep this cached longer
      keepUnusedDataFor: 300, // 5 minutes
    }),

    // Get Groww credentials
    getGrowwCredentials: builder.query<
      z.infer<typeof v1_groww_credentials_schemas.getGrowwCredentials.response>,
      void
    >({
      query: () => ({
        url: "/groww/credentials",
        method: "GET",
      }),
      providesTags: ["GrowwCredentials"],
    }),

    // Update Groww credentials
    updateGrowwCredentials: builder.mutation<
      z.infer<typeof v1_groww_credentials_schemas.updateGrowwCredentials.response>,
      z.infer<typeof v1_groww_credentials_schemas.updateGrowwCredentials.body>
    >({
      query: (body) => {
        const validatedBody = v1_groww_credentials_schemas.updateGrowwCredentials.body.parse(body);
        return {
          url: "/groww/credentials",
          method: "PUT",
          body: validatedBody,
        };
      },
      invalidatesTags: ["GrowwCredentials"],
    }),

    // Delete Groww credentials
    deleteGrowwCredentials: builder.mutation<
      z.infer<typeof v1_groww_credentials_schemas.deleteGrowwCredentials.response>,
      void
    >({
      query: () => ({
        url: "/groww/credentials",
        method: "DELETE",
      }),
      invalidatesTags: ["GrowwCredentials"],
    }),
  }),
});

export const {
  useGetAvailableDatetimesQuery,
  useGetShortlistsQuery,
  useGetCandlesQuery,
  useSignInQuery,
  useGetRunsQuery,
  useGetRunOrdersQuery,
  useDeleteRunMutation,
  useUpdateRunMutation,
  useGetRunTagsQuery,
  useGetGrowwCredentialsQuery,
  useUpdateGrowwCredentialsMutation,
  useDeleteGrowwCredentialsMutation,
} = dashboardAPI;
