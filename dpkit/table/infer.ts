import type { Dialect, Resource, Schema } from "@dpkit/core"
import { loadDialect, loadSchema } from "@dpkit/core"
import type { Table } from "@dpkit/table"
import { inferSchema } from "@dpkit/table"
import { inferDialect } from "../dialect/index.ts"
import { loadTable } from "./load.ts"

export async function inferTable(
  resource: Partial<Resource>,
): Promise<{ dialect: Dialect; schema: Schema; table: Table }> {
  const dialect =
    typeof resource.dialect === "string"
      ? await loadDialect(resource.dialect)
      : resource.dialect
        ? resource.dialect
        : await inferDialect(resource)

  const table = await loadTable({ ...resource, dialect })

  const schema =
    typeof resource.schema === "string"
      ? await loadSchema(resource.schema)
      : resource.schema
        ? resource.schema
        : await inferSchema(table)

  return { dialect, schema, table }
}
