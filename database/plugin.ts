import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type { TablePlugin } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { loadPostgresTable } from "./table/index.ts"
import { loadMysqlTable } from "./table/index.ts"
import { loadSqliteTable } from "./table/index.ts"
import { savePostgresTable } from "./table/index.ts"
import { saveMysqlTable } from "./table/index.ts"
import { saveSqliteTable } from "./table/index.ts"

export class DatabasePlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>) {
    const format = getFormat(resource)

    switch (format) {
      case "postgresql":
        return await loadPostgresTable(resource)
      case "mysql":
        return await loadMysqlTable(resource)
      case "sqlite":
        return await loadSqliteTable(resource)
      default:
        return undefined
    }
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path, format } = options
    const inferredFormat = getFormat({ path, format })

    switch (inferredFormat) {
      case "postgresql":
        return await savePostgresTable(table, options)
      case "mysql":
        return await saveMysqlTable(table, options)
      case "sqlite":
        return await saveSqliteTable(table, options)
      default:
        return undefined
    }
  }
}

function getFormat(resource: Partial<Resource>) {
  const format = inferResourceFormat(resource)
  return format
}
