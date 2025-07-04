import type { Schema } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { DataType } from "nodejs-polars"
import { col, lit } from "nodejs-polars"
import { matchField } from "../field/index.js"
import { parseField } from "../field/index.js"
import type { PolarsSchema } from "../schema/index.js"
import { getPolarsSchema } from "../schema/index.js"
import type { Table } from "./Table.js"

export async function processTable(
  table: Table,
  options?: {
    schema?: Schema
    sampleSize?: number
  },
) {
  const { schema, sampleSize = 100 } = options ?? {}

  if (!schema) {
    return table
  }

  const sample = await table.head(sampleSize).collect()
  const polarsSchema = getPolarsSchema(sample.schema)

  return table.select(Object.values(processFields(schema, polarsSchema)))
}

export function processFields(
  schema: Schema,
  polarsSchema: PolarsSchema,
  options?: { dontParse?: boolean },
) {
  const exprs: Record<string, Expr> = {}

  for (const [index, field] of schema.fields.entries()) {
    const polarsField = matchField(index, field, schema, polarsSchema)
    let expr = lit(null).alias(field.name)

    if (polarsField) {
      expr = col(polarsField.name).alias(field.name)

      if (!options?.dontParse && polarsField.type.equals(DataType.String)) {
        expr = parseField(field, { expr, schema })
      }
    }

    exprs[field.name] = expr
  }

  return exprs
}
