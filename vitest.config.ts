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
    testTimeout: 60 * 1000,
    passWithNoTests: true,
    silent: "passed-only",
    coverage: {
      enabled: true,
      reporter: ["html", "json"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/build/**",
        "**/compile/**",
        "**/coverage/**",
        "**/scripts/**",
        "**/entrypoints/**",
        "app/**",
        "docs/**",
        "site/**",
        "examples/**",
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
