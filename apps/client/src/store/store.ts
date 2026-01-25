import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { dashboardAPI } from "./api/dashboardApi";
import { adminAPI } from "./api/adminApi";

export const store = configureStore({
  reducer: {
    [dashboardAPI.reducerPath]: dashboardAPI.reducer,
    [adminAPI.reducerPath]: adminAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(dashboardAPI.middleware, adminAPI.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
