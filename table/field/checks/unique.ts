import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Table } from "../../table/index.js"

// TODO: Support schema.primaryKey and schema.uniqueKeys
export function checkCellUnique(field: Field, errorTable: Table) {
  const unique = field.constraints?.unique

  if (unique) {
    const target = col(`target:${field.name}`)
    const errorName = `error:cell/unique:${field.name}`

    errorTable = errorTable
      .withColumn(
        target.isNotNull().and(target.isFirstDistinct().not()).alias(errorName),
      )
      .withColumn(col("error").or(col(errorName)).alias("error"))
  }

  return errorTable
}
