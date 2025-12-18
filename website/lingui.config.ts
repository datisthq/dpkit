import { defineConfig } from "@lingui/cli"
import { LanguageIdDefault, Languages } from "#constants/language.ts"

export default defineConfig({
  sourceLocale: LanguageIdDefault,
  locales: Object.keys(Languages),
  catalogs: [
    {
      path: "<rootDir>/locales/{locale}/messages",
      include: ["<rootDir>/components", "<rootDir>/routes"],
    },
  ],
})
