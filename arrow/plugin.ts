import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type { LoadTableOptions } from "@dpkit/table"
import type { TablePlugin } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { loadArrowTable, saveArrowTable } from "./table/index.ts"

export class ArrowPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const isArrow = getIsArrow(resource)
    if (!isArrow) return undefined

    return await loadArrowTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const isArrow = getIsArrow(options)
    if (!isArrow) return undefined

    return await saveArrowTable(table, options)
  }
}

function getIsArrow(resource: Partial<Resource>) {
  const format = inferResourceFormat(resource)
  return format === "arrow" || format === "feather"
}
