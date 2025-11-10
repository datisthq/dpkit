import { defineConfig } from "@lingui/cli"

export default defineConfig({
  sourceLocale: "en",
  locales: ["en", "de", "es", "fr", "it", "pt", "ru", "uk"],
  catalogs: [
    {
      path: "<rootDir>/locales/{locale}/messages",
      include: ["<rootDir>/app", "<rootDir>/components"],
    },
  ],
})
