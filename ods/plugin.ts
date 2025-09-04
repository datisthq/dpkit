import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type { LoadTableOptions } from "@dpkit/table"
import type { TablePlugin } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { loadOdsTable, saveOdsTable } from "./table/index.ts"

export class OdsPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const isOds = getIsOds(resource)
    if (!isOds) return undefined

    return await loadOdsTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const isOds = getIsOds(options)
    if (!isOds) return undefined

    return await saveOdsTable(table, options)
  }
}

function getIsOds(resource: Partial<Resource>) {
  const format = inferResourceFormat(resource)
  return ["ods"].includes(format ?? "")
}
