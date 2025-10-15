import { Countries } from "@mycarro/system/constants/country.ts"
import { CountrySlugs } from "@mycarro/system/constants/country.ts"
import { Languages } from "@mycarro/system/constants/language.ts"
import { xml } from "remix-utils/responses"
import { objectKeys } from "ts-extras"
import { IndexSitemap } from "#services/sitemap.ts"
import * as settings from "#settings.ts"

export async function loader() {
  const sitemap = new IndexSitemap()

  for (const country of Object.values(Countries)) {
    if (!country.active) continue
    for (const languageId of objectKeys(Languages)) {
      const countrySlug = CountrySlugs[country.countryId][languageId]
      const prefix = `${settings.URL}/${languageId}/${countrySlug}`
      sitemap.locations.push(`${prefix}/sitemap.xml`)
      //sitemap.locations.push(`${prefix}/sitemap-cars.xml`)
    }
  }

  return xml(sitemap.toXml())
}
