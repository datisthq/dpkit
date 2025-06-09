import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Table } from "../../table/index.js"

export function checkCellType(field: Field, errorTable: Table) {
  const source = col(`source:${field.name}`)
  const target = col(`target:${field.name}`)
  const column = `error:cell/type:${field.name}`

  errorTable = errorTable
    .withColumn(source.isNotNull().and(target.isNull()).alias(column))
    .withColumn(col("error").or(col(column)).alias("error"))

  return errorTable
}
