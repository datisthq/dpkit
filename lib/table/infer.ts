import type { Resource } from "@dpkit/core"
import { resolveDialect, resolveSchema } from "@dpkit/core"
import { inferSchemaFromTable } from "@dpkit/table"
import { inferDialect } from "../dialect/index.ts"
import { loadTable } from "./load.ts"

export async function inferTable(resource: Partial<Resource>) {
  let dialect = await resolveDialect(resource.dialect)
  if (!dialect) {
    dialect = await inferDialect(resource)
  }

  const table = await loadTable(
    { ...resource, dialect },
    { denormalized: true },
  )

  if (!table) {
    return undefined
  }

  let schema = await resolveSchema(resource.schema)
  if (!schema) {
    schema = await inferSchemaFromTable(table)
  }

  return { dialect, schema, table }
}
