import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type { LoadTableOptions } from "@dpkit/table"
import type { TablePlugin } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { loadCsvTable, saveCsvTable } from "./table/index.ts"

export class CsvPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const csvFormat = getCsvFormat(resource)
    if (!csvFormat) return undefined

    return await loadCsvTable({ ...resource, format: csvFormat }, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path, format } = options

    const csvFormat = getCsvFormat({ path, format })
    if (!csvFormat) return undefined

    return await saveCsvTable(table, { ...options, format: csvFormat })
  }
}

function getCsvFormat(resource: Partial<Resource>) {
  const format = inferResourceFormat(resource)
  return format === "csv" || format === "tsv" ? format : undefined
}
