import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/charts/styles.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider defaultColorScheme="dark">
        <Notifications />
        <App />
      </MantineProvider>
    </Provider>
  </StrictMode>
);
