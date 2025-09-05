import type { Resource } from "@dpkit/core"
import { loadResourceDialect } from "@dpkit/core"
import { loadResourceSchema } from "@dpkit/core"
import { getRecordsFromRows } from "@dpkit/table"
import type { LoadTableOptions } from "@dpkit/table"
import { inferSchema, normalizeTable } from "@dpkit/table"
import { DataFrame } from "nodejs-polars"

export async function loadInlineTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  const { noInfer, noParse, inferOptions, parseOptions } = options ?? {}

  const dialect = await loadResourceDialect(resource.dialect)
  const data = resource.data

  if (!Array.isArray(data)) {
    return DataFrame().lazy()
  }

  const isRows = data.every(row => Array.isArray(row))
  const records = isRows ? getRecordsFromRows(data, dialect) : data

  let table = DataFrame(records).lazy()

  let schema = await loadResourceSchema(resource.schema)
  if (!schema && !noInfer) {
    schema = await inferSchema(table, inferOptions)
  }

  if (schema) {
    table = await normalizeTable(table, schema, { noParse, parseOptions })
  }

  return table
}
