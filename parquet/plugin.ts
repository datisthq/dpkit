import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type { LoadTableOptions } from "@dpkit/table"
import type { TablePlugin } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { loadParquetTable, saveParquetTable } from "./table/index.ts"

export class ParquetPlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>, options?: LoadTableOptions) {
    const isParquet = getIsParquet(resource)
    if (!isParquet) return undefined

    return await loadParquetTable(resource, options)
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path, format } = options

    const isParquet = getIsParquet({ path, format })
    if (!isParquet) return undefined

    return await saveParquetTable(table, options)
  }
}

function getIsParquet(resource: Partial<Resource>) {
  const format = inferResourceFormat(resource)
  return format === "parquet"
}
