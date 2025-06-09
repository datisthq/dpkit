import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Table } from "../Table.js"

export function checkCellPattern(table: Table, field: Field) {
  if (field.type === "string") {
    const pattern = field.constraints?.pattern

    if (pattern) {
      const target = col(`target:${field.name}`)
      const column = `error:cell/pattern:${field.name}`

      table = table
        .withColumn(target.str.contains(pattern).not().alias(column))
        .withColumn(col("error").or(col(column)).alias("error"))
    }
  }

  return table
}
