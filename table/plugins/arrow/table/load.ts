import type { Resource } from "@dpkit/metadata"
import { resolveSchema } from "@dpkit/metadata"
import { prefetchFiles } from "@dpkit/file"
import type { LoadTableOptions } from "../../../plugin.ts"
import { inferSchemaFromTable } from "../../../schema/index.ts"
import { normalizeTable } from "../../../table/index.ts"
import * as pl from "nodejs-polars"

export async function loadArrowTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  const [firstPath, ...restPaths] = await prefetchFiles(resource.path)
  if (!firstPath) {
    throw new Error("Resource path is not defined")
  }

  let table = pl.scanIPC(firstPath)
  if (restPaths.length) {
    table = pl.concat([table, ...restPaths.map(path => pl.scanIPC(path))])
  }

  if (!options?.denormalized) {
    let schema = await resolveSchema(resource.schema)
    if (!schema) schema = await inferSchemaFromTable(table, options)
    table = await normalizeTable(table, schema)
  }

  return table
}
