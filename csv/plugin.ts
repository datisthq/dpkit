import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type { InferDialectOptions, TablePlugin } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { inferCsvDialect } from "./dialect/index.ts"
import { loadCsvTable, saveCsvTable } from "./table/index.ts"

export class CsvPlugin implements TablePlugin {
  async inferDialect(
    resource: Partial<Resource>,
    options?: InferDialectOptions,
  ) {
    const isCsv = getIsCsv(resource)
    if (!isCsv) return undefined

    return await inferCsvDialect(resource, options)
  }

  async loadTable(resource: Partial<Resource>) {
    const isCsv = getIsCsv(resource)
    if (!isCsv) return undefined

    return await loadCsvTable(resource)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const isCsv = getIsCsv(options)
    if (!isCsv) return undefined

    return await saveCsvTable(table, options)
  }
}

function getIsCsv(resource: Partial<Resource>) {
  const format = inferResourceFormat(resource)
  return ["csv", "tsv"].includes(format ?? "")
}
