import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    // environment: "jsdom",
    browser: {
      enabled: false,
      provider: "playwright",
      instances: [{ browser: "chromium" }],
    },
    testTimeout: 3000,
    include: ["src/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
