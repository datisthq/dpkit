import { xml } from "remix-utils/responses"
import { Pages } from "#constants/page.ts"
import { createPayload } from "#payload.ts"
import type { Route } from "./+types/page.ts"
import { PartitionSitemap } from "./services.ts"

export async function loader(props: Route.ComponentProps) {
  const { languageId } = createPayload({ params: props.params })

  const sitemap = new PartitionSitemap({
    languageId,
  })

  for (const page of Object.values(Pages)) {
    sitemap.addPage({ pageId: page.pageId })
  }

  return xml(sitemap.toXml())
}
