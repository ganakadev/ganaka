import { configureStore } from "@reduxjs/toolkit";
import { dashboardAPI } from "./api/dashboardApi";

export const store = configureStore({
  reducer: {
    [dashboardAPI.reducerPath]: dashboardAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(dashboardAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
