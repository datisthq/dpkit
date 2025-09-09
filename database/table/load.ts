import { loadResourceDialect, loadResourceSchema } from "@dpkit/core"
import type { Resource } from "@dpkit/core"
import { normalizeTable } from "@dpkit/table"
import type { LoadTableOptions } from "@dpkit/table"
import { DataFrame } from "nodejs-polars"
import { createDriver } from "../drivers/create.ts"
import { inferDatabaseSchema } from "../schema/index.ts"

// Currently, we use slow non-rust implementation as in the future
// polars-rust might be able to provide a faster native implementation

export async function loadDatabaseTable(
  resource: Partial<Resource> & { format: "postgresql" | "mysql" | "sqlite" },
  options?: LoadTableOptions,
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
  const records = await database.selectFrom(dialect.table).selectAll().execute()

  let table = DataFrame(records).lazy()

  if (!options?.denormalized) {
    let schema = await loadResourceSchema(resource.schema)
    if (!schema) schema = await inferDatabaseSchema(resource)
    table = await normalizeTable(table, schema)
  }

  await database.destroy()
  return table
}
