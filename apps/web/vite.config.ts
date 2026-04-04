import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  base: "/ats-scanner/",
  resolve: {
    alias: {
      "@ats-scanner/core": path.resolve(
        __dirname,
        "../../packages/core/src",
      ),
    },
  },
  build: {
    outDir: "dist",
  },
});
