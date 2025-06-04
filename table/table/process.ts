import type { Schema } from "@dpkit/core"
import { loadSchema } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { DataType } from "nodejs-polars"
import { col } from "nodejs-polars"
import { parseColumn } from "../column/index.js"
import type { PolarsSchema } from "../polars/index.js"
import type { Table } from "./Table.js"

export async function processTable(props: {
  table: Table
  schema?: Schema | string
}) {
  const { table } = props

  if (!props.schema) {
    return table
  }

  const schema =
    typeof props.schema === "string"
      ? await loadSchema({ path: props.schema })
      : props.schema

  const sample = await table.head(100).collect()
  const polarsSchema = sample.schema

  return table.select(processColumns({ schema, polarsSchema }))
}

function processColumns(props: { schema: Schema; polarsSchema: PolarsSchema }) {
  const { schema, polarsSchema } = props
  const exprs: Expr[] = []

  for (const field of schema.fields) {
    const polarsType = polarsSchema[field.name]
    if (polarsType) {
      let expr = col(field.name)

      if (polarsType.equals(DataType.String)) {
        expr = parseColumn({ field, expr })
      }

      exprs.push(expr)
    }
  }

  return exprs
}
