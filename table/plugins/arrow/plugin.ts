import type { Resource } from "@dpkit/metadata"
import { inferResourceFormat } from "@dpkit/metadata"
import type {
  LoadTableOptions,
  SaveTableOptions,
  TablePlugin,
} from "../../plugin.ts"
import type { Table } from "../../table/index.ts"
import { loadArrowTable, saveArrowTable } from "./table/index.ts"

export class ArrowPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const isArrow = getIsArrow(resource)
    if (!isArrow) return undefined

    return await loadArrowTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path, format } = options

    const isArrow = getIsArrow({ path, format })
    if (!isArrow) return undefined

    return await saveArrowTable(table, options)
  }
}

function getIsArrow(resource: Partial<Resource>) {
  const format = inferResourceFormat(resource)
  return format === "arrow" || format === "feather"
}
