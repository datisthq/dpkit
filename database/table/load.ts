import { resolveDialect, resolveSchema } from "@dpkit/core"
import type { Resource } from "@dpkit/core"
import { normalizeTable } from "@dpkit/table"
import type { LoadTableOptions } from "@dpkit/table"
import { DataFrame } from "nodejs-polars"
import { createAdapter } from "../adapters/create.ts"
import { inferDatabaseSchema } from "../schema/index.ts"

// Currently, we use slow non-rust implementation as in the future
// polars-rust might be able to provide a faster native implementation

export async function loadDatabaseTable(
  resource: Partial<Resource> & { format: "postgresql" | "mysql" | "sqlite" },
  options?: LoadTableOptions,
) {
  const dialect = await resolveDialect(resource.dialect)
  if (!dialect?.table) {
    throw new Error("Table name is not defined in dialect")
  }

  const path = typeof resource.path === "string" ? resource.path : undefined
  if (!path) {
    throw new Error("Resource path is not defined")
  }

  const adapter = createAdapter(resource.format)
  const database = await adapter.connectDatabase(path)
  const records = await database.selectFrom(dialect.table).selectAll().execute()
  console.log(records)

  let table = DataFrame(records).lazy()

  if (!options?.denormalized) {
    let schema = await resolveSchema(resource.schema)
    if (!schema) schema = await inferDatabaseSchema(resource)
    table = await normalizeTable(table, schema)
  }

  return table
}
