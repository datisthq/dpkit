import { basename, dirname, join } from "node:path"
import { loadEnvFile } from "node:process"
import { configDefaults, defineConfig } from "vitest/config"
import { coverageConfigDefaults } from "vitest/config"

try {
  loadEnvFile(join(import.meta.dirname, ".env"))
} catch {}

export default defineConfig({
  test: {
    include: ["**/*.spec.(ts|tsx)"],
    exclude: [...configDefaults.exclude, "**/build/**", "**/compile/**"],
    env: { NODE_OPTIONS: "--no-warnings" },
    testTimeout: 60 * 1000,
    passWithNoTests: true,
    silent: "passed-only",
    coverage: {
      enabled: true,
      reporter: ["html", "json"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/@*",
        "**/build/**",
        "**/compile/**",
        "**/coverage/**",
        "**/entrypoints/**",
        "**/examples/**",
        "**/messages.js",
        "**/program.ts",
        "**/index.ts",
        "**/main.ts",
        "portal/**",
        // TODO: Enalbe when ready
        "website/**",
        // TODO: Enalbe when ready
        "mobile/**",
        // TODO: Enalbe when ready
        "engine/**",
      ],
    },
    resolveSnapshotPath: (testPath, snapExtension) => {
      return (
        join(dirname(testPath), "fixtures", "generated", basename(testPath)) +
        snapExtension
      )
    },
  },
})
