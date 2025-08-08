import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Table } from "../../table/index.ts"

export function checkCellRequired(field: Field, errorTable: Table) {
  if (field.constraints?.required) {
    const target = col(`target:${field.name}`)
    const errorName = `error:cell/required:${field.name}`

    errorTable = errorTable
      .withColumn(target.isNull().alias(errorName))
      .withColumn(col("error").or(col(errorName)).alias("error"))
  }

  return errorTable
}
