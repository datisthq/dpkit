import type { LoaderFunctionArgs } from "react-router"
import { xml } from "remix-utils/responses"
import { createPayload } from "#payload.ts"
import { listBrands } from "#services/brand.ts"
import { listCities } from "#services/city.ts"
import { listDealers } from "#services/dealer.ts"
import { connectBindings } from "#services/env.ts"
import { listModels } from "#services/model.ts"
import { listRegions } from "#services/region.ts"
import { PartitionSitemap } from "#services/sitemap.ts"
import { listTrends } from "#services/trend.ts"

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const { languageId, countryId } = createPayload({
    pageId: "home",
    testUrl: request.url,
    params,
  })

  const bindings = await connectBindings(context.cloudflare.env)
  const sitemap = new PartitionSitemap({ languageId, countryId })

  // General

  sitemap.addPage({ pageId: "home" })
  sitemap.addPage({ pageId: "carSearch" })
  sitemap.addPage({ pageId: "brandSearch" })
  sitemap.addPage({ pageId: "modelSearch" })
  sitemap.addPage({ pageId: "regionSearch" })
  sitemap.addPage({ pageId: "citySearch" })
  sitemap.addPage({ pageId: "dealerSearch" })
  sitemap.addPage({ pageId: "trends" })
  sitemap.addPage({ pageId: "insights" })
  sitemap.addPage({ pageId: "toolValuation" })
  sitemap.addPage({ pageId: "toolTaxation" })
  sitemap.addPage({ pageId: "helpGeneral" })
  sitemap.addPage({ pageId: "helpTerms" })
  sitemap.addPage({ pageId: "helpPrivacy" })
  sitemap.addPage({ pageId: "helpContacts" })

  // Brands

  const brands = await listBrands(bindings, { countryId })
  for (const brand of brands) {
    const params = { recordSlug: brand.slug }
    sitemap.addPage({ pageId: "brandCars", params })
    sitemap.addPage({ pageId: "brandModels", params })
    sitemap.addPage({ pageId: "postList", params })
    sitemap.addPage({ pageId: "brandAbout", params })
  }

  // Models

  const models = await listModels(bindings, { countryId })
  for (const model of models) {
    const params = { recordSlug: model.slug }
    sitemap.addPage({ pageId: "modelCars", params })
    sitemap.addPage({ pageId: "generationList", params })
    sitemap.addPage({ pageId: "videoList", params })
    sitemap.addPage({ pageId: "modelAbout", params })
  }

  // Regions

  const regions = await listRegions(bindings, { countryId })
  for (const region of regions) {
    const params = { recordSlug: region.slug }
    sitemap.addPage({ pageId: "regionCars", params })
    sitemap.addPage({ pageId: "regionDealers", params })
    sitemap.addPage({ pageId: "regionAbout", params })
  }

  // Cities

  const cities = await listCities(bindings, { countryId })
  for (const city of cities) {
    const params = { recordSlug: city.slug }
    sitemap.addPage({ pageId: "cityCars", params })
    sitemap.addPage({ pageId: "cityDealers", params })
    sitemap.addPage({ pageId: "cityAbout", params })
  }

  // Dealers

  const dealers = await listDealers(bindings, { countryId })
  for (const dealer of dealers) {
    const params = { recordSlug: dealer.slug }
    sitemap.addPage({ pageId: "dealerCars", params })
    sitemap.addPage({ pageId: "dealerAbout", params })
  }

  // Trends

  const trends = await listTrends(bindings, {
    languageId,
    countryId,
    limit: 100,
  })
  for (const trend of trends) {
    const params = {
      recordSlug: trend.recordSlug,
      promptSlug: trend.promptSlug,
    }
    // @ts-ignore
    sitemap.addPage({ pageId: trend.pageId, params })
  }

  return xml(sitemap.toXml())
}
