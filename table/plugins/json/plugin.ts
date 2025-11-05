import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type {
  LoadTableOptions,
  SaveTableOptions,
  TablePlugin,
} from "../../plugin.ts"
import type { Table } from "../../table/index.ts"
import { loadJsonTable } from "./table/index.ts"
import { saveJsonTable } from "./table/index.ts"

export class JsonPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const jsonFormat = getJsonFormat(resource)
    if (!jsonFormat) return undefined

    return await loadJsonTable({ ...resource, format: jsonFormat }, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path, format } = options

    const jsonFormat = getJsonFormat({ path, format })
    if (!jsonFormat) return undefined

    return await saveJsonTable(table, { ...options, format: jsonFormat })
  }
}

function getJsonFormat(resource: Partial<Resource>) {
  const format = inferResourceFormat(resource)
  return format === "json" || format === "jsonl" || format === "ndjson"
    ? format
    : undefined
}
