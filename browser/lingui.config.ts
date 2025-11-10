import { defineConfig } from "@lingui/cli"
import { LanguageIdDefault, Languages } from "#constants/language.ts"

export default defineConfig({
  sourceLocale: LanguageIdDefault,
  locales: Object.keys(Languages),
  catalogs: [
    {
      path: "<rootDir>/locales/{locale}/messages",
      // TODO: Remove routes
      include: ["<rootDir>/app", "<rootDir>/components", "<rootDir>/routes"],
    },
  ],
})
