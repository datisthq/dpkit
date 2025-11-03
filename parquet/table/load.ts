import type { Resource } from "@dpkit/core"
import { resolveSchema } from "@dpkit/core"
import { prefetchFiles } from "@dpkit/file"
import type { LoadTableOptions } from "@dpkit/table"
import { inferSchemaFromTable, normalizeTable } from "@dpkit/table"
import * as pl from "nodejs-polars"

export async function loadParquetTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  const [firstPath, ...restPaths] = await prefetchFiles(resource.path)
  if (!firstPath) {
    throw new Error("Resource path is not defined")
  }

  let table = pl.scanParquet(firstPath)
  if (restPaths.length) {
    table = pl.concat([table, ...restPaths.map(path => pl.scanParquet(path))])
  }

  if (!options?.denormalized) {
    let schema = await resolveSchema(resource.schema)
    if (!schema) schema = await inferSchemaFromTable(table, options)
    table = await normalizeTable(table, schema)
  }

  return table
}
