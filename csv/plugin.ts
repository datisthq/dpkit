import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type { InferDialectOptions, TablePlugin } from "@dpkit/table"
import { inferCsvDialect } from "./dialect/index.js"
import { loadCsvTable } from "./table/index.js"

export class CsvPlugin implements TablePlugin {
  async inferDialect(resource: Resource, options?: InferDialectOptions) {
    const isCsv = getIsCsv(resource)
    if (!isCsv) return undefined

    return await inferCsvDialect(resource, options)
  }

  async loadTable(resource: Resource) {
    const isCsv = getIsCsv(resource)
    if (!isCsv) return undefined

    return await loadCsvTable(resource)
  }
}

function getIsCsv(resource: Resource) {
  const format = inferResourceFormat(resource)
  return ["csv", "tsv"].includes(format ?? "")
}
