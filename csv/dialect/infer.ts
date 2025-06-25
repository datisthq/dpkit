import type { Dialect, Resource } from "@dpkit/core"

export async function inferCsvDialect(resource: Resource) {
  const dialect: Dialect = {}

  const path =
    typeof resource.path === "string" ? resource.path : resource.path?.[0]

  return dialect
}
