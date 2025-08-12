import type { Resource } from "@dpkit/core"
import { prefetchFiles } from "@dpkit/file"
import { concat } from "nodejs-polars"
import { DataFrame } from "nodejs-polars"
import { scanIPC } from "nodejs-polars"

export async function loadArrowTable(resource: Partial<Resource>) {
  const [firstPath, ...restPaths] = await prefetchFiles(resource.path)
  if (!firstPath) {
    return DataFrame().lazy()
  }

  let table = scanIPC(firstPath)
  if (restPaths.length) {
    table = concat([table, ...restPaths.map(path => scanIPC(path))])
  }

  return table
}
