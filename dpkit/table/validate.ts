import type { Resource } from "@dpkit/core"
import { inspectTable } from "@dpkit/table"
import { loadTable } from "./load.js"

export async function validateTable(
  resource: Partial<Resource>,
  options?: {
    invalidRowsLimit?: number
  },
) {
  const table = await loadTable(resource)

  return await inspectTable(table, {
    schema: resource.schema,
    ...options,
  })
}
