import { LanguageIdDefault, Languages } from "#constants/language.ts"
import { PageIdDefault, Pages } from "#constants/page.ts"
import type * as types from "#types/index.ts"

export type Payload = {
  language: types.Language
  page: types.Page
}

export function createPayload(options?: {
  pageId: types.PageId
  params: Record<string, string>
}) {
  const page = Pages[options?.pageId ?? PageIdDefault]

  let language: types.Language | undefined = Languages[LanguageIdDefault]
  if (options?.params.languageId) {
    language = Object.values(Languages).find(
      language => language.languageId === options.params.languageId,
    )
  }

  if (!language) {
    throw new Response(null, { status: 404, statusText: "Not Found" })
  }

  const payload: Payload = {
    language,
    page,
  }

  return {
    payload,
    languageId: language.languageId,
    pageId: page.pageId,
  }
}
