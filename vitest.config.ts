import {
  configDefaults,
  coverageConfigDefaults,
  defineConfig,
} from "vitest/config"

export default defineConfig({
  test: {
    include: ["**/*.spec.(ts|tsx)"],
    exclude: [...configDefaults.exclude, "**/build/**"],
    testTimeout: 60 * 1000,
    passWithNoTests: true,
    coverage: {
      enabled: true,
      reporter: ["html", "json"],
      exclude: [...coverageConfigDefaults.exclude, "docs/**", "examples/**"],
    },
  },
})
