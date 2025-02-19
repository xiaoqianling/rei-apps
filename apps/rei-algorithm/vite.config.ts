import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import mdx from "@mdx-js/rollup";

const userConfig: UserConfig = {
  assetsInclude: ["**/*.lottie", "**/*.json"],
  plugins: [react(), tsconfigPaths(), mdx()],
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
    modules: {
      generateScopedName: "rei-algo_[local]_[hash:5]",
    },
  },
};

export default defineConfig(userConfig);
