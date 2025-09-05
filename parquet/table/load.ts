import type { Resource } from "@dpkit/core"
import { loadResourceSchema } from "@dpkit/core"
import { prefetchFiles } from "@dpkit/file"
import type { LoadTableOptions } from "@dpkit/table"
import { inferSchema, normalizeTable } from "@dpkit/table"
import { concat } from "nodejs-polars"
import { DataFrame } from "nodejs-polars"
import { scanParquet } from "nodejs-polars"

export async function loadParquetTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  const [firstPath, ...restPaths] = await prefetchFiles(resource.path)
  if (!firstPath) {
    return DataFrame().lazy()
  }

  let table = scanParquet(firstPath)
  if (restPaths.length) {
    table = concat([table, ...restPaths.map(path => scanParquet(path))])
  }

  let schema = await loadResourceSchema(resource.schema)
  if (!schema && !options?.noInfer) {
    schema = await inferSchema(table, options)
  }

  if (schema) {
    table = await normalizeTable(table, schema, options)
  }

  return table
}
