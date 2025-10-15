import { Languages } from "#constants/language.ts"
import { PageIdDefault, Pages } from "#constants/pages.ts"
import { makeLink } from "#helpers/link.ts"
import type * as types from "#types/index.ts"

export type Payload = {
  language: types.Language
  page: types.Page
}

export function createPayload(options: {
  pageId: types.PageId
  params: Record<string, string>
  testUrl?: string
}) {
  const notFound = new Response(null, { status: 404, statusText: "Not Found" })

  const language = getLanguage(options.params)
  if (!language) {
    throw notFound
  }

  const page = Pages[options.pageId]
  if (!page) {
    throw notFound
  }

  if (options.testUrl) {
    const path = makeLink({
      languageId: language.languageId,
      pageId: options.pageId,
    })

    const test = new URL(options.testUrl)
    if (!test.pathname.startsWith(path)) {
      throw notFound
    }
  }

  const payload: Payload = {
    language,
    page,
  }

  return {
    payload,
    languageId: payload.language.languageId,
    pageId: payload.page.pageId,
  }
}

export function createDefaultPayload(options: {
  params: Record<string, string>
}) {
  return createPayload({
    pageId: PageIdDefault,
    params: options.params,
  })
}

function getLanguage(params?: Record<string, string>) {
  return Object.values(Languages).find(
    language => language.languageId === params?.languageId,
  )
}
