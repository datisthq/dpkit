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
  const reflections = await database.introspection.getTables()

  const reflection = reflections.find(r => r.name === dialect.table)
  if (!reflection) {
    throw new Error(`Table is not found in database: ${dialect.table}`)
  }

  console.log(reflection)
}
