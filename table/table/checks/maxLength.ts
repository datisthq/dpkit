import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Table } from "../Table.js"

export function checkCellMaxLength(table: Table, field: Field) {
  if (field.type === "string") {
    const maxLength = field.constraints?.maxLength

    if (maxLength !== undefined) {
      const target = col(`target:${field.name}`)
      const column = `error:cell/maxLength:${field.name}`

      table = table
        .withColumn(target.str.lengths().gt(maxLength).alias(column))
        .withColumn(col("error").or(col(column)).alias("error"))
    }
  }

  return table
}