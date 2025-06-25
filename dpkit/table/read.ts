import type { Resource } from "@dpkit/core"
import type { Table } from "@dpkit/table"
import { inferSchema, processTable } from "@dpkit/table"
import { dpkit } from "../plugin.js"

export async function readTable(
  resource: Partial<Resource>,
  options?: {
    sampleSize?: number
    // TODO: implement
    //inferDialect?: boolean
    inferSchema?: boolean
    dontProcess?: boolean
  },
): Promise<Table> {
  const { sampleSize } = options ?? {}

  let table: Table | undefined
  for (const plugin of dpkit.plugins) {
    table = await plugin.loadTable?.(resource)
    if (table) break
  }

  if (!table) {
    throw new Error(`No plugin can load the table: ${resource}`)
  }

  let schema = resource.schema
  if (!schema) {
    schema = await inferSchema(table, { sampleSize })
  }

  if (!options?.dontProcess) {
    table = await processTable(table, { schema })
  }

  return table
}
