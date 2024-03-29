/// <reference types="vitest" />
import path                from "path";
import { UserConfig } from "vitest";

export default import("vitest/config").then(({ defineConfig, configDefaults }) => {
  return defineConfig({
    resolve: {
      alias: [
        {
          find: /^@(.+)/,
          replacement: path.join(process.cwd(), "src"),
        },
      ],
    },
    test: {
      ...configDefaults,
      include: ["src/__test__/unit/**/*.spec.ts"],
      coverage: {
        exclude: [
          ...configDefaults.exclude,
          "node_modules",
          "**/router/**",
          "./src/router/*.route.ts",
        ],
      },
      globals: true,
      environment: "node",
    },
    plugins: [],
  }) as UserConfig;
});