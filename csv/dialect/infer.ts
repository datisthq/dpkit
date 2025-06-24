import type { Resource } from "@dpkit/core"

export function inferCsvDialect(resource: Resource) {
  return resource.dialect
}
