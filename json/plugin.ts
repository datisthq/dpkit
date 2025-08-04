import type { Resource } from "@dpkit/core"
import { inferFormat } from "@dpkit/core"
import type { TablePlugin } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { loadJsonTable, saveJsonTable } from "./table/index.js"

export class JsonPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>) {
    const isJson = getIsJson(resource)
    if (!isJson) return undefined

    return await loadJsonTable(resource)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const isJson = getIsJson({ path: options.path })
    if (!isJson) return undefined

    return await saveJsonTable(table, options)
  }
}

function getIsJson(resource: Partial<Resource>) {
  const format = inferFormat(resource)
  return ["json", "jsonl", "ndjson"].includes(format ?? "")
}
