import type { Resource } from "@dpkit/metadata"
import { resolveDialect } from "@dpkit/metadata"
import { createAdapter } from "../adapters/create.ts"

export async function inferDatabaseSchema(
  resource: Partial<Resource> & { format: "postgresql" | "mysql" | "sqlite" },
) {
  const adapter = createAdapter(resource.format)
  if (!adapter) {
    throw new Error("Supported database format is not defined")
  }

  const dialect = await resolveDialect(resource.dialect)
  if (!dialect?.table) {
    throw new Error("Table name is not defined in dialect")
  }

  const path = typeof resource.path === "string" ? resource.path : undefined
  if (!path) {
    throw new Error("Resource path is not defined")
  }

  const database = await adapter.connectDatabase(path)
  const databaseSchemas = await database.introspection.getTables()

  const databaseSchema = databaseSchemas.find(s => s.name === dialect.table)
  if (!databaseSchema) {
    throw new Error(`Table is not found in database: ${dialect.table}`)
  }

  return adapter.normalizeSchema(databaseSchema)
}
