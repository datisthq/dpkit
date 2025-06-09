import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Table } from "../../table/index.js"

export function checkCellPattern(field: Field, errorTable: Table) {
  if (field.type === "string") {
    const pattern = field.constraints?.pattern

    if (pattern) {
      const target = col(`target:${field.name}`)
      const column = `error:cell/pattern:${field.name}`

      errorTable = errorTable
        .withColumn(target.str.contains(pattern).not().alias(column))
        .withColumn(col("error").or(col(column)).alias("error"))
    }
  }

  return errorTable
}
