import type { Schema } from "@dpkit/core"
import { loadSchema } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { DataType } from "nodejs-polars"
import { col, lit } from "nodejs-polars"
import { parseColumn } from "../column/index.js"
import type { PolarsSchema } from "../schema/index.js"
import { getPolarsSchema } from "../schema/index.js"
import type { Table } from "./Table.js"

export async function processTable(props: {
  table: Table
  schema?: Schema | string
  sampleSize?: number
}) {
  const { table, sampleSize = 100 } = props

  if (!props.schema) {
    return table
  }

  const schema =
    typeof props.schema === "string"
      ? await loadSchema({ path: props.schema })
      : props.schema

  const sample = await table.head(sampleSize).collect()
  const polarsSchema = getPolarsSchema({ typeMapping: sample.schema })

  return table.select(processColumns({ schema, polarsSchema }))
}

function processColumns(props: { schema: Schema; polarsSchema: PolarsSchema }) {
  const { schema, polarsSchema } = props
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
        expr = parseColumn({ field, expr })
      }
    }

    exprs.push(expr)
  }

  return exprs
}
