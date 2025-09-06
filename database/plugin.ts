import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type { TablePlugin } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { loadDatabaseTable } from "./table/index.ts"
import { saveDatabaseTable } from "./table/index.ts"

export class DatabasePlugin implements TablePlugin {
  async loadTable(resource: Partial<Resource>) {
    const databaseFormat = getDatabaseFormat(resource)
    if (!databaseFormat) return undefined

    return await loadDatabaseTable({ ...resource, format: databaseFormat })
  }

  async saveTable(table: Table, options: SaveTableOptions) {
    const { path, format } = options

    const databaseFormat = getDatabaseFormat({ path, format })
    if (!databaseFormat) return undefined

    return await saveDatabaseTable(table, {
      ...options,
      format: databaseFormat,
    })
  }
}

function getDatabaseFormat(resource: Partial<Resource>) {
  const format = inferResourceFormat(resource)
  return format === "postgresql" || format === "mysql" || format === "sqlite"
    ? format
    : undefined
}
