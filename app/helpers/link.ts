import { href } from "react-router"
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
