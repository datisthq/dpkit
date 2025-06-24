import type { Resource } from "@dpkit/core"

export async function readCsvTable(
  resource: Resource,
  options?: {
    dontProcess?: boolean
  },
) {
  return { resource, options }
}
