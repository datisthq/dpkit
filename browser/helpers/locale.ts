import { i18n } from "@lingui/core"
import type * as types from "#types/index.ts"

export async function activateLocale(languageId: types.LanguageId) {
  const { messages } = await import(`../../locales/${languageId}.po`)

  i18n.load(languageId, messages)
  i18n.activate(languageId)
}
