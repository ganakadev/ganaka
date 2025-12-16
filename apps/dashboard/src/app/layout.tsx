import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@/app/globals.css";
import { ReactNode } from "react";

const theme = createTheme({});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-mantine-color-scheme="dark">
      <head>
        <title>Market Data Dashboard</title>
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
