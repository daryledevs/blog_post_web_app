/// <reference types="vitest" />
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { UserConfig } from "vitest";

export default import("vitest/config").then(({ defineConfig, configDefaults, coverageConfigDefaults }) => {
  return defineConfig({
    resolve: {
      alias: [
        {
          find: "@",
          replacement: path.join(process.cwd(), "src"),
        },
      ],
    },
    test: {
      ...configDefaults,
      globals: true,
      environment: "node",
      include: ["src/__test__/unit/**/*.{test,spec}.{ts,js}"],
      exclude: [
        ...configDefaults.exclude,
        "node_modules",
        "src/dist/**",
        "src/types/**",
        "src/config/**",
      ],
      coverage: {
        exclude: [
          ...coverageConfigDefaults.exclude,
          "node_modules",
          "src/dist",
          "src/__test__/**",
          "src/types/**",
          "src/config/**",
        ],
      },
    },
    plugins: [tsconfigPaths()],
  }) as UserConfig;
});