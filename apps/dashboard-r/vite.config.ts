import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Stub Prisma imports since we only use types (not runtime code)
    {
      name: "prisma-stub",
      resolveId(id) {
        if (id.includes("generated/prisma") && !id.endsWith(".d.ts")) {
          return { id: "\0prisma-stub", external: false };
        }
        if (id === "@prisma/client" || id.startsWith("@prisma/")) {
          return { id: "\0prisma-stub", external: false };
        }
      },
      load(id) {
        if (id === "\0prisma-stub") return "export {};";
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["@ganaka/db", "@prisma/client"],
  },
  server: {
    proxy: {
      "/v1": {
        target: process.env.VITE_API_URL || "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
