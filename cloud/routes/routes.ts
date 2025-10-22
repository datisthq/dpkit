import { type RouteConfig, route } from "@react-router/dev/routes"
import { objectEntries, objectKeys } from "ts-extras"
import { Languages } from "#constants/language.ts"
import { Pages } from "#constants/page.ts"

const routes: RouteConfig = []

routes.push(
  route("", "system/redirects/home.ts"),

  route("sitemap.xml", "sitemap/root.ts"),
  route(":languageId/sitemap.xml", "sitemap/page.ts"),
)

for (const [pageId, page] of objectEntries(Pages)) {
  for (const languageId of objectKeys(Languages)) {
    const id = [languageId, pageId].join("/")
    const path = [":languageId", page.path?.[languageId]]
      .filter(Boolean)
      .join("")

    routes.push(route(path, page.file, { id }))
  }
}

export default routes
