import { i18n } from "@lingui/core"
import { detect, fromHtmlTag } from "@lingui/detect-locale"
import { LanguageIdDefault, Languages } from "#constants/language.ts"
import type * as types from "#types/index.ts"

export async function activateLocal(languageId: types.LanguageId) {
  const { messages } = await import(`../locales/${languageId}/messages.po`)

  i18n.load(languageId, messages)
  i18n.activate(languageId)
}

export async function detectClientLanguageId() {
  const langTag = detect(fromHtmlTag("lang"))

  const language =
    Object.values(Languages).find(
      language => language.languageId === langTag,
    ) ?? Languages[LanguageIdDefault]

  return language.languageId
}

export async function detectServerLanguageId(request: Request) {
  const { pathname } = new URL(request.url)

  return detectLanguageIdFromPath(pathname)
}

export function detectLanguageIdFromPath(path: string) {
  const [languageParam] = path.split("/").slice(1)

  const language =
    Object.values(Languages).find(
      language => language.languageId === languageParam,
    ) ?? Languages[LanguageIdDefault]

  return language.languageId
}
