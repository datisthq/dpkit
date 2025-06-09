import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Table } from "../../table/index.js"

export function checkCellRequired(field: Field, errorTable: Table) {
  if (field.constraints?.required) {
    const target = col(`target:${field.name}`)
    const column = `error:cell/required:${field.name}`

    errorTable = errorTable
      .withColumn(target.isNull().alias(column))
      .withColumn(col("error").or(col(column)).alias("error"))
  }

  return errorTable
}
