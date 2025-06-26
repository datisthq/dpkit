import type { Resource } from "@dpkit/core"
import { inspectTable } from "@dpkit/table"
import { loadTable } from "./load.js"
import type { LoadTableOptions } from "./load.js"

export async function validateTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  const { table, schema } = await loadTable(resource, options)

  return await inspectTable(table, { schema })
}
