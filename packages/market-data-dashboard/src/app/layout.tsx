import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { ReactNode } from "react";

const theme = createTheme({});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
