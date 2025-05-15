import { configDefaults, defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["**/*.spec.(ts|tsx)"],
    exclude: ["**/build/**", ...configDefaults.exclude],
    testTimeout: 60 * 1000,
    passWithNoTests: true,
    coverage: {
      enabled: true,
      reporter: ["html", "json"],
    },
  },
})
