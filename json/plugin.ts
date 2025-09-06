import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type { LoadTableOptions } from "@dpkit/table"
import type { TablePlugin } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { loadJsonTable } from "./table/index.ts"
import { saveJsonTable } from "./table/index.ts"

export class JsonPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const jsonFormat = getJsonFormat(resource)

    if (jsonFormat) {
      return await loadJsonTable({ ...resource, format: jsonFormat }, options)
    }

    return undefined
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path, format } = options
    const jsonFormat = getJsonFormat({ path, format })

    if (jsonFormat) {
      return await saveJsonTable(table, { ...options, format: jsonFormat })
    }

    return undefined
  }
}

function getJsonFormat(resource: Partial<Resource>) {
  const format = inferResourceFormat(resource)
  return format === "json" || format === "jsonl" || format === "ndjson"
    ? format
    : undefined
}
