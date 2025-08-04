import type { Resource } from "@dpkit/core"
import { inferFormat } from "@dpkit/core"
import type { TablePlugin } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { loadParquetTable, saveParquetTable } from "./table/index.js"

export class ParquetPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>) {
    const isParquet = getIsParquet(resource)
    if (!isParquet) return undefined

    return await loadParquetTable(resource)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const isParquet = getIsParquet({ path: options.path })
    if (!isParquet) return undefined

    return await saveParquetTable(table, options)
  }
}

function getIsParquet(resource: Partial<Resource>) {
  const format = inferFormat(resource)
  return format === "parquet"
}
