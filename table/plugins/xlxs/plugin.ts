import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type {
  LoadTableOptions,
  SaveTableOptions,
  TablePlugin,
} from "../../plugin.ts"
import type { Table } from "../../table/index.ts"
import { loadXlsxTable } from "./table/index.ts"
import { saveXlsxTable } from "./table/index.ts"

export class XlsxPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const isXlsx = getIsXlsx(resource)
    if (!isXlsx) return undefined

    return await loadXlsxTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path, format } = options

    const isXlsx = getIsXlsx({ path, format })
    if (!isXlsx) return undefined

    return await saveXlsxTable(table, options)
  }
}

function getIsXlsx(resource: Partial<Resource>) {
  const format = inferResourceFormat(resource)
  return ["xlsx"].includes(format ?? "")
}
