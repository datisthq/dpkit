import i18next from "i18next"
import { initReactI18next } from "react-i18next"
import * as locales from "./locales/index.ts"

export const locale = i18next.createInstance()
locale.use(initReactI18next).init({
  // debug: true,
  defaultNS: "main",
  fallbackLng: "en",
  resources: {
    de: { main: locales.de },
    en: { main: locales.en },
    es: { main: locales.es },
    fr: { main: locales.fr },
    it: { main: locales.it },
    pt: { main: locales.pt },
    ru: { main: locales.ru },
    uk: { main: locales.uk },
  },
})

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "main"
    resources: { main: typeof locales.en }
  }
}
