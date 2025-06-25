import type { Resource } from "@dpkit/core"
import type { Table } from "@dpkit/table"
import { inferSchema, processTable } from "@dpkit/table"
import { dpkit } from "../plugin.js"

// TODO: implement inferDialect

export async function readTable(
  resource: Partial<Resource>,
  options?: {
    infer?: boolean | "dialect" | "schema"
    sampleSize?: number
    dontProcess?: boolean
  },
): Promise<Table> {
  const { infer, sampleSize } = options ?? {}

  //const withInferDialect = infer === true || infer === "dialect"
  const withInferSchema = infer === true || infer === "schema"

  let table: Table | undefined
  for (const plugin of dpkit.plugins) {
    table = await plugin.loadTable?.(resource)
    if (table) break
  }

  if (!table) {
    throw new Error(`No plugin can load the table: ${resource}`)
  }

  let schema = resource.schema
  if (!schema && withInferSchema) {
    schema = await inferSchema(table, { sampleSize })
  }

  if (!options?.dontProcess) {
    table = await processTable(table, { schema })
  }

  return table
}
