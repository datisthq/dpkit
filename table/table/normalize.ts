import type { Schema } from "@dpkit/core"
import { normalizeFields } from "../field/index.ts"
import { getPolarsSchema } from "../schema/index.ts"
import type { Table } from "./Table.ts"

export async function normalizeTable(
  table: Table,
  options?: {
    schema?: Schema
    sampleRows?: number
  },
) {
  const { schema, sampleRows = 100 } = options ?? {}

  if (!schema) {
    return table
  }

  const sample = await table.head(sampleRows).collect()
  const polarsSchema = getPolarsSchema(sample.schema)

  return table.select(Object.values(normalizeFields(schema, polarsSchema)))
}
