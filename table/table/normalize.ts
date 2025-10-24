import type { Schema } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { DataType } from "nodejs-polars"
import { col, lit } from "nodejs-polars"
import { matchField } from "../field/index.ts"
import { normalizeField } from "../field/index.ts"
import { getPolarsSchema } from "../schema/index.ts"
import type { PolarsSchema } from "../schema/index.ts"
import type { Table } from "./Table.ts"

const HEAD_ROWS = 100

export async function normalizeTable(
  table: Table,
  schema: Schema,
  options?: {
    dontParse?: boolean
  },
) {
  const { dontParse } = options ?? {}

  const head = await table.head(HEAD_ROWS).collect()
  const polarsSchema = getPolarsSchema(head.schema)

  return table.select(
    ...Object.values(normalizeFields(schema, polarsSchema, { dontParse })),
  )
}

export function normalizeFields(
  schema: Schema,
  polarsSchema: PolarsSchema,
  options?: {
    dontParse?: boolean
  },
) {
  const { dontParse } = options ?? {}
  const exprs: Record<string, Expr> = {}

  for (const [index, field] of schema.fields.entries()) {
    const polarsField = matchField(index, field, schema, polarsSchema)
    let expr = lit(null).alias(field.name)

    if (polarsField) {
      expr = col(polarsField.name).alias(field.name)

      // TODO: Move this logic to normalizeField?
      if (polarsField.type.equals(DataType.String)) {
        const missingValues = field.missingValues ?? schema.missingValues
        const mergedField = { ...field, missingValues }
        expr = normalizeField(mergedField, expr, { dontParse })
      }
    }

    exprs[field.name] = expr
  }

  return exprs
}
