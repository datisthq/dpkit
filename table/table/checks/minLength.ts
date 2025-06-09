import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Table } from "../Table.js"

export function checkCellMinLength(table: Table, field: Field) {
  if (field.type === "string") {
    const minLength = field.constraints?.minLength

    if (minLength !== undefined) {
      const target = col(`target:${field.name}`)
      const column = `error:cell/minLength:${field.name}`

      table = table
        .withColumn(target.str.lengths().lt(minLength).alias(column))
        .withColumn(col("error").or(col(column)).alias("error"))
    }
  }

  return table
}