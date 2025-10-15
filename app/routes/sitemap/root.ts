import { xml } from "remix-utils/responses"
import { objectKeys } from "ts-extras"
import { Languages } from "#constants/language.ts"
import { IndexSitemap } from "#services/sitemap.ts"
import * as settings from "#settings.ts"

export async function loader() {
  const sitemap = new IndexSitemap()

  for (const languageId of objectKeys(Languages)) {
    const prefix = `${settings.URL}/${languageId}`
    sitemap.locations.push(`${prefix}/sitemap.xml`)
  }

  return xml(sitemap.toXml())
}
