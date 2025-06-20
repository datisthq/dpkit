import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Table } from "../../table/index.js"

export function checkCellEnum(field: Field, errorTable: Table) {
  if (field.type === "string") {
    const rawEnum = field.constraints?.enum

    if (rawEnum) {
      const target = col(`target:${field.name}`)
      const errorName = `error:cell/enum:${field.name}`

      errorTable = errorTable
        .withColumn(target.isIn(rawEnum).not().alias(errorName))
        .withColumn(col("error").or(col(errorName)).alias("error"))
    }
  }

  return errorTable
}
