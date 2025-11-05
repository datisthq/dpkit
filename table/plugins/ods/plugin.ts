import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type {
  LoadTableOptions,
  SaveTableOptions,
  TablePlugin,
} from "../../plugin.ts"
import type { Table } from "../../table/index.ts"
import { loadOdsTable } from "./table/index.ts"
import { saveOdsTable } from "./table/index.ts"

export class OdsPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const isOds = getIsOds(resource)
    if (!isOds) return undefined

    return await loadOdsTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path, format } = options

    const isOds = getIsOds({ path, format })
    if (!isOds) return undefined

    return await saveOdsTable(table, options)
  }
}

function getIsOds(resource: Partial<Resource>) {
  const format = inferResourceFormat(resource)
  return ["ods"].includes(format ?? "")
}
