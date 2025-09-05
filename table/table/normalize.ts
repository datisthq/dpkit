import type { Schema } from "@dpkit/core"
import { normalizeFields } from "../field/index.ts"
import { getPolarsSchema } from "../schema/index.ts"
import type { Table } from "./Table.ts"

const HEAD_ROWS = 100

export async function normalizeTable(
  table: Table,
  schema: Schema,
  options?: {
    noParse?: boolean
  },
) {
  const { noParse } = options ?? {}

  const head = await table.head(HEAD_ROWS).collect()
  const polarsSchema = getPolarsSchema(head.schema)

  return table.select(
    Object.values(normalizeFields(schema, polarsSchema, { noParse })),
  )
}
