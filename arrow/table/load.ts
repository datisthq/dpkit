import type { Resource } from "@dpkit/core"
import { loadResourceSchema } from "@dpkit/core"
import { prefetchFiles } from "@dpkit/file"
import type { LoadTableOptions } from "@dpkit/table"
import { inferSchemaFromTable, normalizeTable } from "@dpkit/table"
import { concat } from "nodejs-polars"
import { scanIPC } from "nodejs-polars"

export async function loadArrowTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  const [firstPath, ...restPaths] = await prefetchFiles(resource.path)
  if (!firstPath) {
    throw new Error("Resource path is not defined")
  }

  let table = scanIPC(firstPath)
  if (restPaths.length) {
    table = concat([table, ...restPaths.map(path => scanIPC(path))])
  }

  if (!options?.denormalized) {
    let schema = await loadResourceSchema(resource.schema)
    if (!schema) schema = await inferSchemaFromTable(table, options)
    table = await normalizeTable(table, schema)
  }

  return table
}
