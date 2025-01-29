import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

const userConfig: UserConfig = {
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@scss": path.resolve(__dirname, "src/scss"),
      "@public": path.resolve(__dirname, "public"),
    },
  },
  server: {
    port: 3000,
    open: "/",
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 全局使用变量
        additionalData: `@use '@scss/_variables.scss' as *;
        @use '@scss/_mixins.scss' as *;`,
      },
    },
  },
};

export default defineConfig(userConfig);
