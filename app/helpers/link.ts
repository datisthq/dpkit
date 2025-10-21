import { href } from "react-router"
import { Languages } from "#constants/language.ts"
import { Pages } from "#constants/page.ts"
import * as settings from "#settings.ts"
import type * as types from "#types/index.ts"

export function makeLink(options: {
  languageId: types.LanguageId
  pageId: types.PageId
  absolute?: boolean
  fragment?: string
}) {
  const { languageId, pageId, absolute, fragment } = options

  const page = Pages[pageId]
  const path = href(`/:languageId${page.path?.[languageId] ?? ""}`, {
    languageId,
  })

  const url = new URL(path, settings.URL)
  if (fragment) {
    url.hash = fragment
  }

  return absolute ? url.toString() : url.pathname
}

export function makeHeadLinks(options: {
  languageId: types.LanguageId
  pageId: types.PageId
}) {
  const canonical = {
    rel: "canonical",
    hreflang: undefined,
    href: makeLink({ ...options, absolute: true }),
  }

  const xdefault = {
    rel: "alternate",
    hreflang: "x-default",
    href: makeLink({
      ...options,
      languageId: "en",
      absolute: true,
    }),
  }

  const alternate = Object.values(Languages).map(language => {
    return {
      rel: "alternate",
      hreflang: language.languageId,
      href: makeLink({
        ...options,
        languageId: language.languageId,
        absolute: true,
      }),
    }
  })

  return alternate.length > 1
    ? [canonical, xdefault, ...alternate]
    : [canonical]
}
