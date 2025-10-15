import { generatePath } from "react-router"
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
  const pagePath =
    typeof page.path === "string" ? page.path : page.path[languageId]

  const rawPath = [languageId, pagePath].join("/")
  let path = generatePath(rawPath)

  if (fragment) {
    path = [path, fragment].join("#")
  }

  const base = absolute ? settings.URL : ""
  const link = [base, path].join("/")

  return link
}
