import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    // browser: {
    //   enabled: true,
    //   provider: "playwright",
    //   instances: [{ browser: "chromium" }],
    // },
    testTimeout: 3000,
  },
});
