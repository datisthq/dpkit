import type { Dialect, Resource, Schema } from "@dpkit/core"
import { loadDialect, loadSchema } from "@dpkit/core"
import type { Table } from "@dpkit/table"
import { inferSchema } from "@dpkit/table"
import { inferDialect } from "../dialect/index.js"
import { dpkit } from "../plugin.js"

export type LoadTableOptions = {
  infer?: boolean | "dialect" | "schema"
}

export async function loadTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
): Promise<{ table: Table; schema?: Schema; dialect?: Dialect }> {
  const { infer } = options ?? {}

  const withInferDialect = infer === true || infer === "dialect"
  const withInferSchema = infer === true || infer === "schema"

  let dialect: Dialect | undefined
  if (resource.dialect) {
    dialect =
      typeof resource.dialect === "string"
        ? await loadDialect(resource.dialect)
        : resource.dialect
  } else if (withInferDialect) {
    dialect = await inferDialect(resource)
  }

  let table: Table | undefined
  for (const plugin of dpkit.plugins) {
    table = await plugin.loadTable?.({ ...resource, dialect })
    if (table) break
  }

  if (!table) {
    throw new Error(`No plugin can load the table: ${resource}`)
  }

  let schema: Schema | undefined
  if (resource.schema) {
    schema =
      typeof resource.schema === "string"
        ? await loadSchema(resource.schema)
        : resource.schema
  } else if (withInferSchema) {
    schema = await inferSchema(table)
  }

  return { table, schema, dialect }
}
