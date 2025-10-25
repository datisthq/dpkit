import { usePayload } from "#components/System/index.ts"
import * as settings from "#settings.ts"

export function Meta() {
  const { page, languageId } = usePayload()

  const title = [page.title[languageId], settings.TITLE].join(" - ")
  const description = page.description[languageId]

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </>
  )
}
