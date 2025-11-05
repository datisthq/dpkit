import type { Resource } from "@dpkit/core"
import { resolveDialect } from "@dpkit/core"
import { resolveSchema } from "@dpkit/core"
import { getRecordsFromRows } from "../../../data/index.ts"
import type { LoadTableOptions } from "../../../plugin.ts"
import { inferSchemaFromTable } from "../../../schema/index.ts"
import { normalizeTable } from "../../../table/index.ts"
import * as pl from "nodejs-polars"

export async function loadInlineTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  const data = resource.data
  if (!Array.isArray(data)) {
    throw new Error("Resource data is not defined or tabular")
  }

  const dialect = await resolveDialect(resource.dialect)
  const isRows = data.every(row => Array.isArray(row))

  const records = isRows ? getRecordsFromRows(data, dialect) : data
  let table = pl.DataFrame(records).lazy()

  if (!options?.denormalized) {
    let schema = await resolveSchema(resource.schema)
    if (!schema) schema = await inferSchemaFromTable(table, options)
    table = await normalizeTable(table, schema)
  }

  return table
}
