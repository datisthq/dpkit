import type { Resource } from "@dpkit/metadata"
import { inferFormat } from "@dpkit/metadata"
import type {
  LoadTableOptions,
  SaveTableOptions,
  TablePlugin,
} from "../../plugin.ts"
import type { Table } from "../../table/index.ts"
import { loadParquetTable } from "./table/index.ts"
import { saveParquetTable } from "./table/index.ts"

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
  const format = inferFormat(resource)
  return format === "parquet"
}
