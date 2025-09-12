import type { Resource, Schema } from "@dpkit/core"
import type { InferSchemaOptions } from "@dpkit/table"
import { inferSchemaFromTable } from "@dpkit/table"
import { dpkit } from "../plugin.ts"
import { loadTable } from "../table/index.ts"

export async function inferSchema(
  resource: Partial<Resource>,
  options?: InferSchemaOptions,
): Promise<Schema> {
  for (const plugin of dpkit.plugins) {
    const schema = await plugin.inferSchema?.(resource, options)
    if (schema) {
      return schema
    }
  }

  const table = await loadTable(resource, { denormalized: true })
  const schema = await inferSchemaFromTable(table, options)
  return schema
}
