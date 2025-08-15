import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type { TablePlugin } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { loadJsonTable, loadJsonlTable } from "./table/index.ts"
import { saveJsonTable, saveJsonlTable } from "./table/index.ts"

export class JsonPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>) {
    const formatInfo = getFormatInfo(resource)

    if (formatInfo.isJson) {
      return await loadJsonTable(resource)
    }

    if (formatInfo.isJsonl) {
      return await loadJsonlTable(resource)
    }

    return undefined
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const formatInfo = getFormatInfo(options)

    if (formatInfo.isJson) {
      return await saveJsonTable(table, options)
    }

    if (formatInfo.isJsonl) {
      return await saveJsonlTable(table, options)
    }

    return undefined
  }
}

function getFormatInfo(resource: Partial<Resource>) {
  const format = inferResourceFormat(resource)
  const isJson = format === "json"
  const isJsonl = format === "jsonl" || format === "ndjson"
  return { isJson, isJsonl }
}
