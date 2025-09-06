import type { Resource } from "@dpkit/core"
import { loadResourceSchema } from "@dpkit/core"
import { prefetchFiles } from "@dpkit/file"
import type { LoadTableOptions } from "@dpkit/table"
import { normalizeTable, inferTableSchema } from "@dpkit/table"
import { concat } from "nodejs-polars"
import { scanParquet } from "nodejs-polars"

export async function loadParquetTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  const [firstPath, ...restPaths] = await prefetchFiles(resource.path)
  if (!firstPath) {
    throw new Error("Resource path is not defined")
  }

  let table = scanParquet(firstPath)
  if (restPaths.length) {
    table = concat([table, ...restPaths.map(path => scanParquet(path))])
  }

  if (!options?.denormalized) {
    let schema = await loadResourceSchema(resource.schema)
    if (!schema) schema = await inferTableSchema(table, options)
    table = await normalizeTable(table, schema)
  }

  return table
}
