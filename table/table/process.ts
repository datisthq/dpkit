import type { Schema } from "@dpkit/core"
import { loadSchema } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { DataType } from "nodejs-polars"
import { col, lit } from "nodejs-polars"
import { parseColumn } from "../column/index.js"
import type { PolarsSchema } from "../schema/index.js"
import { getPolarsSchema } from "../schema/index.js"
import type { Table } from "./Table.js"

export async function processTable(
  table: Table,
  options?: {
    schema?: Schema | string
    sampleSize?: number
  },
) {
  const { sampleSize = 100 } = options ?? {}

  if (!options?.schema) {
    return table
  }

  const schema =
    typeof options.schema === "string"
      ? await loadSchema(options.schema)
      : options.schema

  const sample = await table.head(sampleSize).collect()
  const polarsSchema = getPolarsSchema(sample.schema)

  return table.select(processColumns({ schema, polarsSchema }))
}

function processColumns(options: {
  schema: Schema
  polarsSchema: PolarsSchema
}) {
  const { schema, polarsSchema } = options
  const exprs: Expr[] = []

  const polarsFields = polarsSchema.fields
  const fieldsMatch = schema.fieldsMatch ?? "exact"

  for (const [index, field] of schema.fields.entries()) {
    let expr = lit(null).alias(field.name)

    const polarsField =
      fieldsMatch !== "exact"
        ? polarsFields.find(polarsField => polarsField.name === field.name)
        : polarsFields[index]

    if (polarsField) {
      expr = col(polarsField.name).alias(field.name)

      if (polarsField.type.equals(DataType.String)) {
        expr = parseColumn(field, { expr })
      }
    }

    exprs.push(expr)
  }

  return exprs
}
