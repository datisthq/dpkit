import { xml } from "remix-utils/responses"
import { PartitionSitemap } from "#services/sitemap.ts"
import type { Route } from "./+types/pages.ts"

export async function loader(props: Route.ComponentProps) {
  const sitemap = new PartitionSitemap({ languageId: props.params.languageId })

  // General

  sitemap.addPage({ pageId: "home" })

  return xml(sitemap.toXml())
}
