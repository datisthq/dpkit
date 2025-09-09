import type { Resource } from "@dpkit/core"
import { loadResourceDialect } from "@dpkit/core"
import { createDriver } from "../drivers/create.ts"

export async function inferDatabaseSchema(
  resource: Partial<Resource> & { format: "postgresql" | "mysql" | "sqlite" },
) {
  const driver = createDriver(resource.format)
  if (!driver) {
    throw new Error("Supported database format is not defined")
  }

  const dialect = await loadResourceDialect(resource.dialect)
  if (!dialect?.table) {
    throw new Error("Table name is not defined in dialect")
  }

  const path = typeof resource.path === "string" ? resource.path : undefined
  if (!path) {
    throw new Error("Resource path is not defined")
  }

  const database = await driver.connectDatabase(path)
  const databaseTables = await database.introspection.getTables()

  const databaseTable = databaseTables.find(r => r.name === dialect.table)
  if (!databaseTable) {
    throw new Error(`Table is not found in database: ${dialect.table}`)
  }

  return driver.normalizeSchema(databaseTable)
}
