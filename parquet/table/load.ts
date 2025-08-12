import type { Resource } from "@dpkit/core"
import { prefetchFiles } from "@dpkit/file"
import { concat } from "nodejs-polars"
import { DataFrame } from "nodejs-polars"
import { scanParquet } from "nodejs-polars"

export async function loadParquetTable(resource: Partial<Resource>) {
  const [firstPath, ...restPaths] = await prefetchFiles(resource.path)
  if (!firstPath) {
    return DataFrame().lazy()
  }

  let table = scanParquet(firstPath)
  if (restPaths.length) {
    table = concat([table, ...restPaths.map(path => scanParquet(path))])
  }

  return table
}
