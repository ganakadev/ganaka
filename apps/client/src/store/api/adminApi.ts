import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { v1_admin_schemas } from "@ganaka/schemas";
import { z } from "zod";
import { authLocalStorage } from "../../utils/authLocalStorage";

// Get base URL from environment variable
const baseUrl = `${import.meta.env.VITE_API_DOMAIN}` || "http://localhost:4000";

// Create base query with admin auth
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: `${baseUrl}/v1/admin`,
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

export const adminAPI = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["AvailableDates", "Holidays"],
  endpoints: (builder) => ({
    // Get available dates
    getAvailableDates: builder.query<
      z.infer<
        typeof v1_admin_schemas.v1_admin_data_schemas.getAvailableDates.response
      >,
      void
    >({
      query: () => ({
        url: "/data/available-dates",
        method: "GET",
      }),
      providesTags: ["AvailableDates"],
    }),

    // Delete dates
    deleteDates: builder.mutation<
      z.infer<typeof v1_admin_schemas.v1_admin_data_schemas.deleteDates.response>,
      z.infer<typeof v1_admin_schemas.v1_admin_data_schemas.deleteDates.body>
    >({
      query: (body) => ({
        url: "/data/dates",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["AvailableDates"],
    }),

    // Get holidays
    getHolidays: builder.query<
      z.infer<typeof v1_admin_schemas.v1_admin_holidays_schemas.getHolidays.response>,
      void
    >({
      query: () => ({
        url: "/holidays",
        method: "GET",
      }),
      providesTags: ["Holidays"],
    }),

    // Add holidays
    addHolidays: builder.mutation<
      z.infer<typeof v1_admin_schemas.v1_admin_holidays_schemas.addHolidays.response>,
      z.infer<typeof v1_admin_schemas.v1_admin_holidays_schemas.addHolidays.body>
    >({
      query: (body) => ({
        url: "/holidays",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Holidays"],
    }),

    // Remove holidays
    removeHolidays: builder.mutation<
      z.infer<typeof v1_admin_schemas.v1_admin_holidays_schemas.removeHolidays.response>,
      z.infer<typeof v1_admin_schemas.v1_admin_holidays_schemas.removeHolidays.body>
    >({
      query: (body) => ({
        url: "/holidays",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Holidays"],
    }),
  }),
});

export const {
  useGetAvailableDatesQuery,
  useDeleteDatesMutation,
  useGetHolidaysQuery,
  useAddHolidaysMutation,
  useRemoveHolidaysMutation,
} = adminAPI;
