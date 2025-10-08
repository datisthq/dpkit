import type { Schema } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { DataType } from "nodejs-polars"
import { col, lit } from "nodejs-polars"
import { matchField } from "../field/index.ts"
import { parseField } from "../field/index.ts"
import { getPolarsSchema } from "../schema/index.ts"
import type { PolarsSchema } from "../schema/index.ts"
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
    ...Object.values(normalizeFields(schema, polarsSchema, { noParse })),
  )
}

export function normalizeFields(
  schema: Schema,
  polarsSchema: PolarsSchema,
  options?: {
    noParse?: boolean
  },
) {
  const { noParse } = options ?? {}
  const exprs: Record<string, Expr> = {}

  for (const [index, field] of schema.fields.entries()) {
    const polarsField = matchField(index, field, schema, polarsSchema)
    let expr = lit(null).alias(field.name)

    if (polarsField) {
      expr = col(polarsField.name).alias(field.name)

      if (!noParse && polarsField.type.equals(DataType.String)) {
        const missingValues = field.missingValues ?? schema.missingValues
        const mergedField = { ...field, missingValues }
        expr = parseField(mergedField, expr)
      }
    }

    exprs[field.name] = expr
  }

  return exprs
}
