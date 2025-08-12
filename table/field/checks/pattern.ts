import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Table } from "../../table/index.ts"

export function checkCellPattern(field: Field, errorTable: Table) {
  if (field.type === "string") {
    const pattern = field.constraints?.pattern

    if (pattern) {
      const target = col(`target:${field.name}`)
      const errorName = `error:cell/pattern:${field.name}`

      errorTable = errorTable
        .withColumn(target.str.contains(pattern).not().alias(errorName))
        .withColumn(col("error").or(col(errorName)).alias("error"))
    }
  }

  return errorTable
}
