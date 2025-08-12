import type { Resource } from "@dpkit/core"
import { inferFormat } from "@dpkit/core"
import type { TablePlugin } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { loadArrowTable, saveArrowTable } from "./table/index.ts"

export class ArrowPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>) {
    const isArrow = getIsArrow(resource)
    if (!isArrow) return undefined

    return await loadArrowTable(resource)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const isArrow = getIsArrow(options)
    if (!isArrow) return undefined

    return await saveArrowTable(table, options)
  }
}

function getIsArrow(resource: Partial<Resource>) {
  const format = inferFormat(resource)
  return format === "arrow" || format === "feather"
}
