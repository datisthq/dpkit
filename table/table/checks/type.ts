import type { Schema } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Table } from "../Table.js"

export function checkCellType(table: Table, schema: Schema) {
  for (const field of schema.fields) {
    const source = col(`source:${field.name}`)
    const target = col(`target:${field.name}`)
    const column = `error:cell/type:${field.name}`

    table = table
      .withColumn(source.isNotNull().and(target.isNull()).alias(column))
      .withColumn(col("error").or(col(column)).alias("error"))
  }

  return table
}
