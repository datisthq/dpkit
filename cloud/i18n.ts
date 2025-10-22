import i18next from "i18next"
import { initReactI18next } from "react-i18next"
import de from "#locales/de.json" with { type: "json" }
import en from "#locales/en.json" with { type: "json" }
import es from "#locales/es.json" with { type: "json" }
import fr from "#locales/fr.json" with { type: "json" }
import it from "#locales/it.json" with { type: "json" }
import pt from "#locales/pt.json" with { type: "json" }
import ru from "#locales/ru.json" with { type: "json" }
import uk from "#locales/uk.json" with { type: "json" }

export const locales = { de, en, es, fr, it, pt, ru, uk }

export const i18n = i18next.createInstance()
i18n.use(initReactI18next).init({
  // debug: true,
  defaultNS: "main",
  fallbackLng: "en",
  resources: {
    de: { main: de },
    en: { main: en },
    es: { main: es },
    fr: { main: fr },
    it: { main: it },
    pt: { main: pt },
    ru: { main: ru },
    uk: { main: uk },
  },
})

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "main"
    resources: { main: typeof en }
  }
}
