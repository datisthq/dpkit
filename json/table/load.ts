import type { Resource } from "@dpkit/core"
import { prefetchFiles } from "@dpkit/file"
import { concat } from "nodejs-polars"
import { DataFrame } from "nodejs-polars"
import { readJSON, scanJson } from "nodejs-polars"

export async function loadJsonTable(resource: Partial<Resource>) {
  const [firstPath, ...restPaths] = await prefetchFiles(resource.path)

  if (!firstPath) {
    return DataFrame().lazy()
  }

  let table = readJSON(firstPath).lazy()
  if (restPaths.length) {
    table = concat([table, ...restPaths.map(path => readJSON(path).lazy())])
  }

  return table
}

export async function loadJsonlTable(resource: Partial<Resource>) {
  const [firstPath, ...restPaths] = await prefetchFiles(resource.path)

  if (!firstPath) {
    return DataFrame().lazy()
  }

  let table = scanJson(firstPath)
  if (restPaths.length) {
    table = concat([table, ...restPaths.map(path => scanJson(path))])
  }

  return table
}
