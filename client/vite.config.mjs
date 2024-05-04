import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgr({
      include: "**/*.svg?react",
      exclude: "",
    }),
  ],
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: [path.join(__dirname, "src/styles")],
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.join(process.cwd(), "src"),
      },
    ],
  },
});
