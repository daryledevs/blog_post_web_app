import tsconfigPaths from "vite-tsconfig-paths";
const defineConfig = import("vitest/config").then((mod) => mod.defineConfig);

export default (await defineConfig)({
  test: {
    globals: true,
  },
  plugins: [tsconfigPaths()],
});
