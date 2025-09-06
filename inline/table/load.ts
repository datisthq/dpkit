import type { Resource } from "@dpkit/core"
import { loadResourceDialect } from "@dpkit/core"
import { loadResourceSchema } from "@dpkit/core"
import { getRecordsFromRows } from "@dpkit/table"
import type { LoadTableOptions } from "@dpkit/table"
import { normalizeTable, inferTableSchema } from "@dpkit/table"
import { DataFrame } from "nodejs-polars"

export async function loadInlineTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  const data = resource.data
  if (!Array.isArray(data)) {
    throw new Error("Resource data is not defined or tabular")
  }

  const dialect = await loadResourceDialect(resource.dialect)
  const isRows = data.every(row => Array.isArray(row))

  const records = isRows ? getRecordsFromRows(data, dialect) : data
  let table = DataFrame(records).lazy()

  if (!options?.denormalized) {
    let schema = await loadResourceSchema(resource.schema)
    if (!schema) schema = await inferTableSchema(table, options)
    table = await normalizeTable(table, schema)
  }

  return table
}
