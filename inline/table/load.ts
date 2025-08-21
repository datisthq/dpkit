import type { Resource } from "@dpkit/core"
import { loadResourceDialect } from "@dpkit/core"
import { getRecordsFromRows } from "@dpkit/table"
import { DataFrame } from "nodejs-polars"

export async function loadInlineTable(resource: Partial<Resource>) {
  const dialect = await loadResourceDialect(resource.dialect)
  const data = resource.data

  if (!Array.isArray(data)) {
    return DataFrame().lazy()
  }

  const isRows = data.every(row => Array.isArray(row))
  const records = isRows ? getRecordsFromRows(data, dialect) : data

  const table = DataFrame(records).lazy()
  return table
}
