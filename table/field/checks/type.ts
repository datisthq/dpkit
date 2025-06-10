import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Table } from "../../table/index.js"

export function checkCellType(field: Field, errorTable: Table) {
  const source = col(`source:${field.name}`)
  const target = col(`target:${field.name}`)
  const errorName = `error:cell/type:${field.name}`

  errorTable = errorTable
    .withColumn(source.isNotNull().and(target.isNull()).alias(errorName))
    .withColumn(col("error").or(col(errorName)).alias("error"))

  return errorTable
}
