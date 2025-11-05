import type { SavePackageOptions } from "@dpkit/dataset"
import type { Package, Resource } from "@dpkit/metadata"
import { inferResourceFormat } from "@dpkit/metadata"
import type { TablePlugin } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { loadPackageFromDatabase } from "./package/index.ts"
import { savePackageToDatabase } from "./package/index.ts"
import { inferDatabaseSchema } from "./schema/index.ts"
import { loadDatabaseTable } from "./table/index.ts"
import { saveDatabaseTable } from "./table/index.ts"

export class DatabasePlugin implements TablePlugin {
  async savePackage(
    dataPackage: Package,
    options: SavePackageOptions & { plugins?: TablePlugin[] },
  ) {
    const databaseFormat = getDatabaseFormat({ path: options.target })
    if (!databaseFormat) return undefined

    return await savePackageToDatabase(dataPackage, {
      format: databaseFormat,
      ...options,
    })
  }

  async loadPackage(source: string) {
    const databaseFormat = getDatabaseFormat({ path: source })
    if (!databaseFormat) return undefined

    return await loadPackageFromDatabase(source, {
      format: databaseFormat,
    })
  }

  async inferSchema(resource: Partial<Resource>) {
    const databaseFormat = getDatabaseFormat(resource)
    if (!databaseFormat) return undefined

    return await inferDatabaseSchema({ ...resource, format: databaseFormat })
  }

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
