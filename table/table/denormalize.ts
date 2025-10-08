import type { Field, Schema } from "@dpkit/core"
import { col, lit } from "nodejs-polars"
import type { Expr } from "nodejs-polars"
import { stringifyField } from "../field/index.ts"
import type { PolarsSchema } from "../schema/index.ts"
import { getPolarsSchema } from "../schema/index.ts"
import type { Table } from "./Table.ts"

const HEAD_ROWS = 100

type DenormalizeTableOptions = {
  nativeTypes?: Exclude<Field["type"], undefined>[]
}

export async function denormalizeTable(
  table: Table,
  schema: Schema,
  options?: DenormalizeTableOptions,
) {
  const head = await table.head(HEAD_ROWS).collect()
  const polarsSchema = getPolarsSchema(head.schema)

  return table.select(
    ...Object.values(denormalizeFields(schema, polarsSchema, options)),
  )
}

export function denormalizeFields(
  schema: Schema,
  polarsSchema: PolarsSchema,
  options?: DenormalizeTableOptions,
) {
  const { nativeTypes } = options ?? {}
  const exprs: Record<string, Expr> = {}

  for (const field of schema.fields) {
    const polarsField = polarsSchema.fields.find(f => f.name === field.name)
    let expr = lit(null).alias(field.name)

    if (polarsField) {
      expr = col(polarsField.name).alias(field.name)

      if (!nativeTypes?.includes(field.type ?? "any")) {
        const missingValues = field.missingValues ?? schema.missingValues
        const mergedField = { ...field, missingValues }
        expr = stringifyField(mergedField, expr)
      }
    }

    exprs[field.name] = expr
  }

  return exprs
}
