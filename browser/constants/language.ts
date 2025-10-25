export const LanguageIdDefault = "en"

export const Languages = {
  en: { languageId: "en", title: "English" },
  de: { languageId: "de", title: "Deutsch" },
  es: { languageId: "es", title: "Español" },
  fr: { languageId: "fr", title: "Français" },
  it: { languageId: "it", title: "Italiano" },
  pt: { languageId: "pt", title: "Português" },
  ru: { languageId: "ru", title: "Русский" },
  uk: { languageId: "uk", title: "Українська" },
} as const satisfies Record<string, AbstractLanguage>

interface AbstractLanguage {
  languageId: string
  title: string
}
