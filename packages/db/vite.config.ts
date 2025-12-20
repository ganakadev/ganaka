import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: false,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: (id) => {
        // Externalize @prisma/client and its dependencies
        if (id === "@prisma/client" || id.startsWith("@prisma/")) {
          return true;
        }
        // Externalize relative imports to generated Prisma files
        // These will be resolved at runtime from dist/generated/prisma
        if (id.startsWith("./generated/prisma") || id.startsWith("../generated/prisma")) {
          return true;
        }
        return false;
      },
      output: {
        exports: "named",
      },
    },
  },
});

