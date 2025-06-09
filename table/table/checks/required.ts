import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Table } from "../Table.js"

export function checkCellRequired(table: Table, field: Field) {
  if (field.constraints?.required) {
    const target = col(`target:${field.name}`)
    const column = `error:cell/required:${field.name}`

    table = table
      .withColumn(target.isNull().alias(column))
      .withColumn(col("error").or(col(column)).alias("error"))
  }

  return table
}
