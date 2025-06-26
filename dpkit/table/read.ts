import type { Resource } from "@dpkit/core"
import type { Table } from "@dpkit/table"
import { processTable } from "@dpkit/table"
import { loadTable } from "./load.js"
import type { LoadTableOptions } from "./load.js"

export async function readTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
): Promise<Table> {
  const { table, schema } = await loadTable(resource, options)

  return await processTable(table, { schema })
}
