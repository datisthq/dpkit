import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type { LoadTableOptions } from "@dpkit/table"
import type { TablePlugin } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { loadXlsxTable, saveXlsxTable } from "./table/index.ts"

export class XlsxPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const isXlsx = getIsXlsx(resource)
    if (!isXlsx) return undefined

    return await loadXlsxTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const isXlsx = getIsXlsx(options)
    if (!isXlsx) return undefined

    return await saveXlsxTable(table, options)
  }
}

function getIsXlsx(resource: Partial<Resource>) {
  const format = inferResourceFormat(resource)
  return ["xlsx"].includes(format ?? "")
}
