import type { Resource } from "@dpkit/core"
import { inferFormat } from "@dpkit/core"
import type { TablePlugin } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { loadAvroTable, saveAvroTable } from "./table/index.js"

export class AvroPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>) {
    const isAvro = getIsAvro(resource)
    if (!isAvro) return undefined

    return await loadAvroTable(resource)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const isAvro = getIsAvro({ path: options.path })
    if (!isAvro) return undefined

    return await saveAvroTable(table, options)
  }
}

function getIsAvro(resource: Partial<Resource>) {
  const format = inferFormat(resource)
  return format === "avro"
}
