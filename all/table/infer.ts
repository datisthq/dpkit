import type { Dialect, Resource, Schema } from "@dpkit/core"
import { loadResourceDialect, loadResourceSchema } from "@dpkit/core"
import type { Table } from "@dpkit/table"
import { inferTableSchema } from "@dpkit/table"
import { inferDialect } from "../dialect/index.ts"
import { loadTable } from "./load.ts"

// TODO: Allow non-tabular resources returning undefined?

export async function inferTable(
  resource: Partial<Resource>,
): Promise<{ dialect: Dialect; schema: Schema; table: Table }> {
  let dialect = await loadResourceDialect(resource.dialect)
  if (!dialect) {
    dialect = await inferDialect(resource)
  }

  const table = await loadTable(
    { ...resource, dialect },
    { denormalized: true },
  )

  let schema = await loadResourceSchema(resource.schema)
  if (!schema) {
    schema = await inferTableSchema(table)
  }

  return { dialect, schema, table }
}
