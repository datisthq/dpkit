import { Pages } from "#constants/page.ts"
import * as settings from "#settings.ts"
import type * as types from "#types/index.ts"

export function Meta(props: {
  languageId: types.LanguageId
  pageId: types.PageId
}) {
  const page = Pages[props.pageId]

  const title = [page.title[props.languageId], settings.TITLE].join(" - ")
  const description = page.description[props.languageId]

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </>
  )
}
