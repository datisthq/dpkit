import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type { TablePlugin } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { loadOdsTable, saveOdsTable } from "./table/index.ts"

export class OdsPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>) {
    const isOds = getIsOds(resource)
    if (!isOds) return undefined

    return await loadOdsTable(resource)
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
